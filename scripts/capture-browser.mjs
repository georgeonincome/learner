/**
 * capture-browser.mjs — render every sitemap URL in real Chromium and store the
 * fully-hydrated DOM. The plain-HTTP captures in `captured/` are SSR HTML; some
 * pages ship a loading skeleton until client settings load, so those are
 * re-captured here.
 *
 * Usage: node scripts/capture-browser.mjs [--url substring] [--wait 1800]
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'captured-browser')
const SITEMAP = path.resolve(ROOT, '..', '_reference', 'sitemap.xml')
const HOST = process.env.CAPTURE_HOST || 'https://www.savvypro.org'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : fallback
}
const ONLY = arg('url', null)
const WAIT = Number(arg('wait', 1800))
const TIMEOUT = Number(arg('timeout', 60000))
const RETRY_FAILED = process.argv.includes('--retry-failed')

const xml = fs.readFileSync(SITEMAP, 'utf8')
let urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
if (RETRY_FAILED) {
  const report = path.join(OUT, '_capture-report.json')
  const failed = new Set(
    JSON.parse(fs.readFileSync(report, 'utf8'))
      .results.filter((r) => r.error)
      .map((r) => r.url),
  )
  urls = urls.filter((u) => failed.has(u))
  console.log(`retrying ${urls.length} failed urls`)
} else if (ONLY) urls = urls.filter((u) => u.includes(ONLY))
console.log(`urls: ${urls.length}${ONLY ? ` (filtered by ${ONLY})` : ''}`)

fs.mkdirSync(OUT, { recursive: true })

function fileNameFor(u) {
  const p = new URL(u).pathname.replace(/^\/+|\/+$/g, '')
  if (!p) return 'index.html'
  return p.replace(/\//g, '__') + '.html'
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/122.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 900 },
  locale: 'en-US',
})

const results = []
let i = 0
for (const u of urls) {
  i++
  const file = path.join(OUT, fileNameFor(u))
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e).split('\n')[0]))
  try {
    await page.goto(u, { waitUntil: 'domcontentloaded', timeout: TIMEOUT })
    // let client-set settings / lazy blocks settle
    await page.waitForTimeout(WAIT)
    try {
      await page.waitForLoadState('networkidle', { timeout: 5000 })
    } catch {
      /* ignore */
    }
    const html = await page.content()
    fs.writeFileSync(file, html)
    // styled-components runs in "speedy" mode in production, so its rules live in
    // the CSSOM and are NOT serialized into page.content(). Read them back out —
    // without this the captured page renders unstyled when replayed offline.
    let css = ''
    try {
      css = await page.evaluate(() => {
        const out = []
        for (const sheet of document.styleSheets) {
          let rules
          try {
            rules = sheet.cssRules
          } catch {
            continue
          }
          for (const r of rules) out.push(r.cssText)
        }
        return out.join('\n')
      })
    } catch {
      /* ignore */
    }
    if (css) fs.writeFileSync(file.replace(/\.html$/, '.css'), css)
    const pulses = (html.match(/animate-pulse/g) || []).length
    results.push({ url: u, file: path.basename(file), cssBytes: css.length, size: html.length, pulses, errors })
    console.log(`${i}/${urls.length} ${String(html.length).padStart(8)} css=${String(css.length).padStart(7)} pulse=${pulses}  ${path.basename(file)}`)
  } catch (e) {
    results.push({ url: u, error: e.message.split('\n')[0] })
    console.log(`${i}/${urls.length} ERR ${u} ${e.message.split('\n')[0]}`)
  }
  await page.close()
}

await browser.close()
fs.writeFileSync(
  path.join(OUT, '_capture-report.json'),
  JSON.stringify({ host: HOST, at: new Date().toISOString(), results }, null, 2),
)
console.log(`\nwrote ${results.length} pages to ${OUT}`)
