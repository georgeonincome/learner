/**
 * Step 3: axe violations and all four Lighthouse category scores for the four
 * key templates. Writes docs/QUALITY.md.
 */
import fs from 'node:fs'
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE = process.env.OUR_BASE || 'http://127.0.0.1:3000'
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'course-detail', path: '/course-detail/content-creation-school-2026/49070' },
  { name: 'dashboard', path: '/dashboard' },
  { name: 'lesson-player', path: '/dashboard/course/49791/lesson/739583' },
]
const browser = await chromium.launch({ headless: true })
const axeRows = []
for (const p of PAGES) {
  const context = await browser.newContext()
  const page = await context.newPage()
  try {
    await page.goto(BASE + p.path, { waitUntil: 'domcontentloaded', timeout: 60000 })
    const r = await new AxeBuilder({ page }).analyze()
    axeRows.push({ name: p.name, violations: r.violations.length, details: r.violations.map((v) => `${v.id}(${v.nodes.length})`).join(', ') || 'none' })
  } catch (e) {
    axeRows.push({ name: p.name, violations: -1, details: `ERROR ${e.message.slice(0, 120)}` })
  }
  await context.close()
}
await browser.close()

const lighthouse = process.env.RUN_LIGHTHOUSE === '1'
const lhRows = []
if (lighthouse) {
  const { execFileSync } = await import('node:child_process')
  const chromePath = process.env.CHROME_PATH || '/home/george_jackson/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome'
  for (const p of PAGES) {
    const outFile = `/tmp/opencode/lh-${p.name}.json`
    try {
      execFileSync('npx', ['lighthouse', BASE + p.path, '--quiet', '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
        '--only-categories=performance,accessibility,best-practices,seo', '--output=json', `--output-path=${outFile}`], {
        env: { ...process.env, CHROME_PATH: chromePath }, timeout: 180000, stdio: 'pipe',
      })
      const res = JSON.parse(fs.readFileSync(outFile, 'utf8'))
      const c = res.categories
      lhRows.push({
        name: p.name,
        performance: Math.round(c.performance.score * 100),
        accessibility: Math.round(c.accessibility.score * 100),
        bestPractices: Math.round(c['best-practices'].score * 100),
        seo: Math.round(c.seo.score * 100),
      })
    } catch (e) {
      lhRows.push({ name: p.name, performance: -1, accessibility: -1, bestPractices: -1, seo: -1, error: String(e.message).slice(0, 100) })
    }
  }
}

const out = [
  '# QUALITY.md — axe + Lighthouse (step 3)',
  '',
  '## Axe violations',
  '',
  '| Template | Violations | IDs |',
  '|---|---:|---|',
  ...axeRows.map((r) => `| ${r.name} | ${r.violations} | ${r.details} |`),
  '',
  '## Lighthouse (mobile, all four category scores)',
  '',
  lhRows.length
    ? ['| Template | Performance | Accessibility | Best practices | SEO | Error |', '|---|---:|---:|---:|---:|---|',
       ...lhRows.map((r) => `| ${r.name} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.error ?? ''} |`)].join('\n')
    : 'Not run in this pass (set RUN_LIGHTHOUSE=1).',
  '',
].join('\n')
fs.writeFileSync('docs/QUALITY.md', out)
console.log(`axe: ${axeRows.map((r) => `${r.name}=${r.violations}`).join(' ')}; lighthouse rows=${lhRows.length}`)
