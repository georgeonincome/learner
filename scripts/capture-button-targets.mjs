/**
 * capture-button-targets.mjs — record where the reference site's buttons actually
 * navigate.
 *
 * The reference renders its CTAs as styled-components `<button>` elements whose
 * targets live inside minified React onClick closures, so the captured HTML carries
 * no usable href. This script clicks each candidate control on the live site and
 * records the resulting URL.
 *
 * Output: src/content/button-targets.json
 *   { "<page path>": { "<control text>": { "target": "/route", "kind": "navigate|anchor|popup|none" } } }
 *
 * Usage:
 *   node scripts/capture-button-targets.mjs                 # default page set
 *   node scripts/capture-button-targets.mjs --all           # every sitemap URL (slow)
 *   PAGES=/,/courses,/books node scripts/capture-button-targets.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'src', 'content', 'button-targets.json')
const SITEMAP = path.resolve(ROOT, '..', '_reference', 'sitemap.xml')
const HOST = process.env.CAPTURE_HOST || 'https://www.savvypro.org'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/122.0.0.0 Safari/537.36'

const DEFAULT_PAGES = [
  '/', '/courses/', '/all-products/', '/books/', '/blog/', '/contact-us/',
  '/about-us/', '/getting-started-page/', '/learn-digital-skills-now/',
  '/grow-my-business/', '/build-your-expert-business/', '/business-solutions/',
  '/private-1-on-1-consultation/', '/freelancer-webinar/', '/savvybot-ai-agent/',
  '/join-our-mailing-list/', '/login/', '/signup/', '/signin/',
  '/zero-to-hero-social-media-manager-book/', '/community/', '/groups/',
  '/course-detail/content-creation-school-2026/36467/', '/appointment/',
]

// Controls we must never click.
const DENY = /accept cookies|close|dismiss|log ?out|sign ?out|delete|remove|unsubscribe/i

function pages() {
  if (process.env.PAGES) return process.env.PAGES.split(',').map((s) => s.trim())
  if (process.argv.includes('--all')) {
    const xml = fs.readFileSync(SITEMAP, 'utf8')
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  }
  return DEFAULT_PAGES
}

const { chromium } = await import('@playwright/test')
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } })

const result = {}
let pageCount = 0
let clickCount = 0

for (const route of pages()) {
  pageCount++
  const url = HOST + route
  const page = await context.newPage()
  const entry = {}
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(1800)
    // Let client-rendered blocks settle.
    try {
      await page.waitForLoadState('networkidle', { timeout: 4000 })
    } catch {
      /* ignore */
    }

    const controls = await page.evaluate(() => {
      const out = []
      const seen = new Set()
      for (const el of document.querySelectorAll('button, a')) {
        const txt = (el.textContent || '').replace(/\s+/g, ' ').trim()
        if (!txt || txt.length > 60) continue
        const key = el.tagName + '|' + txt
        if (seen.has(key)) continue
        seen.add(key)
        const r = el.getBoundingClientRect()
        if (r.width < 1 || r.height < 1) continue
        out.push({
          tag: el.tagName,
          text: txt,
          href: el.getAttribute('href'),
          cls: (el.className || '').toString().slice(0, 80),
        })
      }
      return out
    })

    for (const c of controls) {
      if (DENY.test(c.text)) continue
      // Plain in-site links already carry their target in the HTML.
      if (c.tag === 'A' && c.href && c.href.startsWith('/')) {
        entry[c.text] = { target: c.href, kind: 'href' }
        continue
      }
      if (c.tag === 'A' && c.href && c.href.startsWith('https://' + new URL(HOST).host)) {
        entry[c.text] = { target: c.href.slice(HOST.length), kind: 'href' }
        continue
      }
      // Buttons and hash anchors: click to discover the destination.
      const before = page.url()
      let kind = 'none'
      let target = null
      try {
        const [popup] = await Promise.all([
          page.waitForEvent('popup', { timeout: 1500 }).catch(() => null),
          page.click(`text="${c.text.replace(/"/g, '\\"')}"`, { timeout: 4000 }).catch(() => null),
        ])
        await page.waitForTimeout(1200)
        if (popup) {
          kind = 'popup'
          target = new URL(popup.url()).pathname
          await popup.close().catch(() => {})
        } else if (page.url() !== before) {
          kind = 'navigate'
          target = new URL(page.url()).pathname
        } else {
          kind = 'anchor'
          target = new URL(page.url()).pathname + new URL(page.url()).hash
        }
      } catch {
        kind = 'none'
      }
      entry[c.text] = { target, kind, cls: c.cls }
      clickCount++
      // Return to the page under test.
      if (page.url() !== before) {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {})
        await page.waitForTimeout(900)
      }
    }
  } catch (e) {
    entry.__error = String(e).split('\n')[0]
  }
  result[route] = entry
  const found = Object.keys(entry).filter((k) => !k.startsWith('__')).length
  console.log(`${pageCount}/${pages().length} ${route}  controls=${found}`)
  await page.close()
}

await browser.close()
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify({ host: HOST, at: new Date().toISOString(), pages: result }, null, 2))
console.log(`\nwrote ${OUT}  (${pageCount} pages, ${clickCount} clicks)`)
