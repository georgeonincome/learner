/**
 * sitemap-audit.mjs — crawl every sitemap URL against the running app and report:
 *   status, <title>, meta description, console errors / page errors, handler kind.
 *
 * Handler kind is derived from the repo, not guessed:
 *   spec     — src/app/<route>/page.tsx renders PublicPage (reference page spec)
 *   functional — a hand-written route (auth, cart, checkout, dashboard, admin, api)
 *   missing  — no route file at all
 *
 * Output: sitemap-audit.json + a printed table.
 *
 * Usage:
 *   npm run build && npx next start -p 3000 &
 *   node scripts/sitemap-audit.mjs [--base http://127.0.0.1:3000] [--json-only]
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const ROOT = process.cwd()
const SITEMAP = path.resolve(ROOT, '..', '_reference', 'sitemap.xml')
const BASE = (() => {
  const i = process.argv.indexOf('--base')
  return i >= 0 ? process.argv[i + 1] : process.env.BASE || 'http://127.0.0.1:3000'
})()
const JSON_ONLY = process.argv.includes('--json-only')

/** Route table from the app directory, with the same normalisation as the crawler. */
function routeTable() {
  const appDir = path.join(ROOT, 'src', 'app')
  const map = new Map()
  const walk = (dir, base) => {
    if (fs.existsSync(path.join(dir, 'page.tsx'))) {
      map.set(normalise(base || '/'), dir)
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const name = entry.name
      if (name.startsWith('(')) {
        walk(path.join(dir, name), base)
        continue
      }
      const next = `${base}/${name}`
      walk(path.join(dir, name), next)
    }
  }
  walk(appDir, '')
  return map
}

function normalise(p) {
  const s = p.replace(/^\/+|\/+$/g, '')
  return s ? '/' + s : '/'
}

function handlerKind(route, routes) {
  const dir = matchRoute(route, routes)
  if (!dir) return 'missing'
  const src = fs.readFileSync(path.join(dir, 'page.tsx'), 'utf8')
  if (/PublicPage/.test(src)) return 'spec'
  return 'functional'
}

/** Match a concrete path against literal and dynamic ([seg]) route keys. */
function matchRoute(routePath, routes) {
  const target = normalise(routePath)
  if (routes.has(target)) return routes.get(target)
  const segments = target.split('/').filter(Boolean)
  for (const [key, dir] of routes) {
    const parts = key.split('/').filter(Boolean)
    if (parts.length !== segments.length) continue
    if (parts.every((p, i) => p.startsWith('[') || p === segments[i])) return dir
  }
  return null
}

const xml = fs.readFileSync(SITEMAP, 'utf8')
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
const routes = routeTable()

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })

const rows = []
let i = 0
for (const url of urls) {
  i++
  const pathname = new URL(url).pathname
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200))
  })
  page.on('pageerror', (e) => pageErrors.push(String(e).split('\n')[0].slice(0, 200)))
  let status = 0
  let title = ''
  let description = ''
  let maxOnce = false
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const resp = await page.goto(BASE + pathname, { waitUntil: 'domcontentloaded', timeout: 90_000 })
      status = resp?.status() ?? 0
      await page.waitForTimeout(500)
      const meta = await page.evaluate(() => ({
        title: document.title || '',
        description:
          document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      }))
      title = meta.title
      description = meta.description
    } catch (e) {
      pageErrors.push('GOTO: ' + String(e).split('\n')[0].slice(0, 160))
    }
    if (status !== 0) break
    // First hit on a dev server compiles the route; give it one more chance.
    await page.waitForTimeout(1500)
  }
  await page.close()

  rows.push({
    route: pathname,
    status,
    title,
    description,
    handler: handlerKind(pathname, routes),
    consoleErrors: consoleErrors.slice(0, 5),
    pageErrors: pageErrors.slice(0, 5),
    errorCount: consoleErrors.length + pageErrors.length,
  })
  if (!JSON_ONLY) {
    const flag = status !== 200 || !title || rows[i - 1].errorCount > 0 ? '  <--' : ''
    console.log(
      `${String(i).padStart(3)}/${urls.length} ${String(status).padStart(3)} ${handler(rows[i - 1].handler)} ${truncate(title, 46).padEnd(48)} ${truncate(description, 40)}${flag}`,
    )
  }
}

await browser.close()

function handler(h) {
  return h === 'spec' ? 'spec    ' : h === 'functional' ? 'function' : 'MISSING '
}
function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

const summary = {
  base: BASE,
  at: new Date().toISOString(),
  total: rows.length,
  ok: rows.filter((r) => r.status === 200).length,
  non200: rows.filter((r) => r.status !== 200).map((r) => `${r.status} ${r.route}`),
  missingTitle: rows.filter((r) => !r.title).map((r) => r.route),
  missingDescription: rows.filter((r) => !r.description).map((r) => r.route),
  withErrors: rows.filter((r) => r.errorCount > 0).map((r) => ({
    route: r.route,
    console: r.consoleErrors,
    page: r.pageErrors,
  })),
  byHandler: rows.reduce((acc, r) => {
    acc[r.handler] = (acc[r.handler] || 0) + 1
    return acc
  }, {}),
  rows,
}

fs.writeFileSync(path.join(ROOT, 'sitemap-audit.json'), JSON.stringify(summary, null, 2))

console.log('\n=== SUMMARY ===')
console.log(`base                ${BASE}`)
console.log(`urls                ${summary.total}`)
console.log(`status 200          ${summary.ok}`)
console.log(`non-200             ${summary.non200.length ? summary.non200.join(', ') : 'none'}`)
console.log(`missing title       ${summary.missingTitle.length ? summary.missingTitle.join(', ') : 'none'}`)
console.log(`missing description ${summary.missingDescription.length}`)
console.log(`pages with errors   ${summary.withErrors.length}`)
console.log(`handlers            ${JSON.stringify(summary.byHandler)}`)
if (summary.withErrors.length) {
  console.log('\nfirst 12 erroring routes:')
  for (const e of summary.withErrors.slice(0, 12)) {
    console.log(`  ${e.route}`)
    if (e.console.length) console.log(`    console: ${e.console[0]}`)
    if (e.page.length) console.log(`    page:    ${e.page[0]}`)
  }
}
console.log('\nwrote sitemap-audit.json')
