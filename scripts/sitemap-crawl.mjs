/**
 * Crawls all 181 reference sitemap URLs against the running production build
 * and writes SITEMAP-CRAWL.md with status, unique title/meta description,
 * console errors and the handler (dedicated page, dynamic template or catch-all).
 *
 * Usage: npx next start -p 3000 & node scripts/sitemap-crawl.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const ROOT = process.cwd()
const SITEMAP = path.resolve(ROOT, '..', '_reference', 'sitemap.xml')
const APP = path.join(ROOT, 'src', 'app')
const BASE = process.env.OUR_BASE || 'http://127.0.0.1:3000'

const xml = fs.readFileSync(SITEMAP, 'utf8')
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
const pathname = (u) => new URL(u).pathname.replace(/\/$/, '') || '/'

function collectRoutes(dir, base = '') {
  const out = []
  if (fs.existsSync(path.join(dir, 'page.tsx'))) out.push({ route: base || '/', dynamic: false, catchAll: false })
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    if (e.name.startsWith('(')) {
      out.push(...collectRoutes(path.join(dir, e.name), base))
      continue
    }
    const dynamic = e.name.startsWith('[')
    const catchAll = /^\[\.\.\./.test(e.name)
    const next = `${base}/${e.name}`
    const full = path.join(dir, e.name)
    if (fs.existsSync(path.join(full, 'page.tsx'))) out.push({ route: next, dynamic, catchAll })
    out.push(...collectRoutes(full, next))
  }
  return out
}

const routes = collectRoutes(APP)

function handlerFor(p) {
  const segs = p.split('/').filter(Boolean)
  // Exact static route first.
  const exact = routes.find((r) => r.route === `/${segs.join('/')}`)
  if (exact) return { handler: exact.dynamic ? 'dynamic template' : 'dedicated page', route: exact.route }
  // Match a dynamic route pattern.
  for (const r of routes) {
    const rs = r.route.split('/').filter(Boolean)
    if (rs.length !== segs.length) continue
    if (rs.every((s, i) => (s.startsWith('[') ? true : s === segs[i]))) {
      return { handler: r.catchAll ? 'catch-all' : 'dynamic template', route: r.route }
    }
  }
  return { handler: '404 / not found', route: '-' }
}

const browser = await chromium.launch({ headless: true })
const results = []
for (const url of urls) {
  const p = pathname(url)
  const page = await browser.newPage()
  const consoleErrors = []
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200))
  })
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message.slice(0, 200)}`))
  let status = 0
  try {
    const res = await page.goto(`${BASE}${p}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    status = res?.status() ?? 0
  } catch (e) {
    status = -1
    consoleErrors.push(e.message.split('\n')[0].slice(0, 200))
  }
  const meta = await page
    .evaluate(() => ({
      title: document.title,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    }))
    .catch(() => ({ title: '', description: '' }))
  await page.close()
  const { handler, route } = handlerFor(p)
  results.push({ url: p, status, ...meta, consoleErrors, handler, route })
}
await browser.close()

const titles = new Map()
const descs = new Map()
for (const r of results) {
  titles.set(r.title, (titles.get(r.title) ?? 0) + 1)
  descs.set(r.description, (descs.get(r.description) ?? 0) + 1)
}

const lines = []
lines.push('# SITEMAP-CRAWL.md — All 181 reference sitemap URLs')
lines.push('')
lines.push(`Crawled against \`${BASE}\` with Playwright/Chromium. Handler class derived from \`src/app\` route files.`)
lines.push('')
lines.push('| URL | Status | Title | Meta description | Handler | Console errors |')
lines.push('|---|---|---|---|---|---|')
for (const r of results) {
  const esc = (s) => String(s).replace(/\|/g, '\\|').slice(0, 90)
  lines.push(
    `| ${esc(r.url)} | ${r.status} | ${esc(r.title)} | ${esc(r.description)} | ${r.handler} (${esc(r.route)}) | ${r.consoleErrors.length ? esc(r.consoleErrors.join(' / ')) : 'none'} |`,
  )
}
lines.push('')
lines.push('## Summary')
lines.push('')
lines.push(`- URLs crawled: ${results.length}`)
lines.push(`- Non-200: ${results.filter((r) => r.status !== 200).length}`)
lines.push(`- Unique titles: ${titles.size}; duplicate title groups: ${[...titles].filter(([, n]) => n > 1).length}`)
for (const [t, n] of [...titles].filter(([, n]) => n > 1)) lines.push(`  - "${t}" ×${n}`)
lines.push(`- Unique meta descriptions: ${descs.size}; duplicate groups: ${[...descs].filter(([, n]) => n > 1).length}`)
for (const [d, n] of [...descs].filter(([, n]) => n > 1).slice(0, 20)) lines.push(`  - "${d.slice(0, 80)}" ×${n}`)
lines.push(`- Console errors: ${results.reduce((a, r) => a + r.consoleErrors.length, 0)}`)
lines.push(`- Handlers: ${[...new Set(results.map((r) => r.handler))].map((h) => `${h}=${results.filter((r) => r.handler === h).length}`).join(', ')}`)
lines.push('')

fs.writeFileSync('SITEMAP-CRAWL.md', lines.join('\n'))
fs.writeFileSync('sitemap-results.json', JSON.stringify(results, null, 2))
console.log(`Crawled ${results.length} URLs; non-200=${results.filter((r) => r.status !== 200).length}; unique titles=${titles.size}; console errors=${results.reduce((a, r) => a + r.consoleErrors.length, 0)}`)
