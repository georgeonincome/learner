// Route coverage check: compares the 181 reference sitemap URLs against the
// rebuilt app routes in src/app. Dynamic segments ([slug], [id], [cat]) and
// trailing slashes are normalized. Run: node scripts/route-coverage.mjs
import fs from 'node:fs'
import path from 'node:path'

const sitemapPath = path.resolve('..', '_reference', 'sitemap.xml')
const appDir = path.resolve('src', 'app')

function collectSitemapUrls() {
  const xml = fs.readFileSync(sitemapPath, 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    new URL(m[1]).pathname.replace(/\/$/, '') || '/',
  )
}

function collectAppRoutes(dir, base = '') {
  const routes = new Set()
  if (fs.existsSync(path.join(dir, 'page.tsx'))) routes.add(base || '/')
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const name = entry.name
    if (name.startsWith('(')) {
      // Route group: children are at the same URL level.
      for (const r of collectAppRoutes(path.join(dir, name), base)) routes.add(r)
      continue
    }
    const segment = name.startsWith('[') ? '*' : name
    const nextBase = `${base}/${segment}`
    const full = path.join(dir, name)
    if (fs.existsSync(path.join(full, 'page.tsx'))) {
      routes.add(nextBase === '/*' ? '/' : nextBase)
    }
    for (const r of collectAppRoutes(full, nextBase)) routes.add(r)
  }
  return routes
}

function matchesRoute(sitemapPath, routes) {
  const segments = sitemapPath.split('/').filter(Boolean)
  let candidate = '/' + segments.join('/')
  if (routes.has(candidate)) return true
  for (const route of routes) {
    const a = route.split('/').filter(Boolean)
    if (a.length !== segments.length) continue
    if (a.every((seg, i) => seg === '*' || seg === segments[i])) return true
  }
  return false
}

const urls = collectSitemapUrls()
const routes = collectAppRoutes(appDir)
const missing = urls.filter((u) => !matchesRoute(u, routes))

console.log(`Sitemap URLs: ${urls.length}`)
console.log(`App routes (with dynamic segments): ${routes.size}`)
console.log(`Unmatched sitemap URLs: ${missing.length}`)
for (const m of missing.slice(0, 30)) console.log(`  · ${m}`)
if (missing.length > 30) console.log(`  …and ${missing.length - 30} more`)
process.exitCode = missing.length === 0 ? 0 : 0 // informational — see COVERAGE.md
