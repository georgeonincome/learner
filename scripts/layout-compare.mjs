/**
 * Screenshot-free layout comparison (step 2). Loads the captured reference
 * HTML+CSS from _reference/site in Playwright at five breakpoints and compares
 * section order, DOM structure, bounding boxes and computed typography against
 * the Lena template. Brand colour/copy/image differences are expected.
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const ROOT = process.cwd()
const REF = path.resolve(ROOT, '..', '_reference', 'site', 'www.savvypro.org')
const CSS = path.resolve(ROOT, '..', '_reference', 'site', 'cdn.ezycourse.net', '_next', 'static', 'css')
const BASE = process.env.OUR_BASE || 'http://127.0.0.1:3000'
const WIDTHS = [375, 768, 1024, 1280, 1536]

const TEMPLATES = [
  { name: 'home', ref: 'index.html', route: '/' },
  { name: 'catalog', ref: 'courses.html', route: '/courses' },
  { name: 'course-detail', ref: 'content-creation-school-2026-49070.html', route: '/course-detail/content-creation-school-2026/49070' },
  { name: 'books', ref: 'books.html', route: '/books' },
  { name: 'blog', ref: 'blog.html', route: '/blog' },
  { name: 'auth', ref: 'login.html', route: '/login' },
  { name: 'about-us', ref: 'about-us.html', route: '/about-us' },
  { name: 'contact-us', ref: 'contact-us.html', route: '/contact-us' },
  { name: 'testimonials', ref: 'testimonials.html', route: '/testimonials' },
]

function htmlFor(refFile) {
  const direct = path.join(REF, refFile)
  if (fs.existsSync(direct)) return fs.readFileSync(direct, 'utf8')
  // Fall back to the first slug-ish match.
  const slug = refFile.replace(/\.html$/, '')
  const match = fs.readdirSync(REF).find((f) => f.includes(slug) || slug.includes(f.replace(/\.html$/, '')))
  return match ? fs.readFileSync(path.join(REF, match), 'utf8') : null
}

function localCss() {
  if (!fs.existsSync(CSS)) return ''
  return fs.readdirSync(CSS).filter((f) => f.endsWith('.css')).map((f) => fs.readFileSync(path.join(CSS, f), 'utf8')).join('\n')
}

async function metrics(page, selector, isRef) {
  return page.evaluate(({ selector, isRef }) => {
    const root = document.querySelector(selector) || document.querySelector('main') || document.body
    const sections = [...(root?.children ?? [])].slice(0, 14).map((el) => {
      const r = el.getBoundingClientRect()
      return {
        tag: el.tagName.toLowerCase(),
        top: Math.round(r.top),
        height: Math.round(r.height),
        width: Math.round(r.width),
        cls: (el.className || '').toString().slice(0, 60),
      }
    })
    const typography = ['h1', 'h2', 'p'].map((tag) => {
      const el = document.querySelector(`${selector} ${tag}`) || document.querySelector(tag)
      if (!el) return null
      const cs = getComputedStyle(el)
      return { tag, fontSize: Math.round(parseFloat(cs.fontSize)), fontWeight: cs.fontWeight, lineHeight: cs.lineHeight }
    }).filter(Boolean)
    return { sections, typography, sectionCount: sections.length, isRef }
  }, { selector, isRef })
}

const results = []
const browser = await chromium.launch({ headless: true })
for (const t of TEMPLATES) {
  const refHtml = htmlFor(t.ref)
  for (const width of WIDTHS) {
    const row = { template: t.name, width, ref: null, lena: null, status: 'SKIP', notes: [] }
    if (!refHtml) { row.notes.push('reference HTML not found'); results.push(row); continue }
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    try {
      // Reference: inline the captured CSS, strip remote scripts.
      const css = localCss()
      const cleaned = refHtml
        .replace(/<link[^>]+rel="stylesheet"[^>]*>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
      await page.setContent(`<style>${css}</style>${cleaned}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
      row.ref = await metrics(page, '#__next-content', true)
    } catch (e) { row.notes.push(`ref: ${e.message.slice(0, 80)}`) }

    try {
      await page.goto(BASE + t.route, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForTimeout(300)
      row.lena = await metrics(page, 'main#__next-content', false)
    } catch (e) { row.notes.push(`lena: ${e.message.slice(0, 80)}`) }
    await page.close()

    if (row.ref && row.lena) {
      const refTags = row.ref.sections.map((s) => s.tag)
      const lenaTags = row.lena.sections.map((s) => s.tag)
      const orderOk = refTags.length === lenaTags.length && refTags.every((tag, i) => tag === lenaTags[i])
      const boxDeltas = row.ref.sections.map((s, i) => {
        const l = row.lena.sections[i]
        return l ? Math.max(Math.abs(s.top - l.top), Math.abs(s.height - l.height), Math.abs(s.width - l.width)) : 999
      })
      const typeDeltas = row.ref.typography.map((s, i) => {
        const l = row.lena.typography[i]
        return l ? Math.abs(s.fontSize - l.fontSize) : 999
      })
      const maxBox = Math.max(...boxDeltas, 0)
      const maxType = Math.max(...typeDeltas, 0)
      row.boxDelta = maxBox
      row.typeDelta = maxType
      row.status = orderOk && maxBox <= 4 && maxType <= 4 ? 'PASS' : 'FAIL'
      if (!orderOk) row.notes.push(`section order ref=[${refTags.join(',')}] lena=[${lenaTags.join(',')}]`)
      if (maxBox > 4) row.notes.push(`max box delta ${maxBox}px`)
      if (maxType > 4) row.notes.push(`max type delta ${maxType}px`)
    } else row.status = 'FAIL'
    results.push(row)
  }
}
await browser.close()

const out = [
  '# COMPARISON.md — layout comparison (no screenshots)',
  '',
  'Captured reference HTML+CSS from `_reference/site` vs Lena templates at five breakpoints.',
  'Tolerance: ±4px on bounding boxes and computed font size. Brand colour/copy/images may differ.',
  '',
  '| Template | Width | Status | Sections (ref/lena) | Max box Δ | Max type Δ | Notes |',
  '|---|---:|---|---|---:|---:|---|',
  ...results.map((r) => `| ${r.template} | ${r.width} | ${r.status} | ${r.ref?.sectionCount ?? '-'}/${r.lena?.sectionCount ?? '-'} | ${r.boxDelta ?? '-'} | ${r.typeDelta ?? '-'} | ${r.notes.join('; ').slice(0, 160)} |`),
  '',
  `Summary: ${results.filter((r) => r.status === 'PASS').length} PASS / ${results.length} cells.`,
  '',
].join('\n')
fs.writeFileSync(path.join(ROOT, 'docs', 'COMPARISON.md'), out)
console.log(`comparison written: ${results.filter((r) => r.status === 'PASS').length}/${results.length} PASS cells`)
