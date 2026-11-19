/**
 * extract-page-specs.mjs — turn every captured reference page into a compact,
 * data-driven page spec consumed by the app's reference renderer.
 *
 * Output:
 *   src/content/pages/<key>.json   { route, template, title, meta, blocks }
 *   src/content/pages/index.json   route -> { key, template, title, source }
 *
 * The spec is the reference's own DOM structure (tags, classes, text, links,
 * images) with scripts/styles stripped. Brand name, logo and copy remain
 * editable data; nothing here is hand-written markup.
 *
 * Usage: node scripts/extract-page-specs.mjs [--only substring]
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  PAGES_DIR,
  ROOT,
  bodyBlocks,
  captureFileName,
  extractMeta,
  parseHtml,
  sitemapUrls,
  sourceFor,
} from './lib/extract.mjs'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : fallback
}
const ONLY = arg('only', null)

function keyFor(url) {
  const p = new URL(url).pathname.replace(/^\/+|\/+$/g, '')
  if (!p) return 'home'
  return p.replace(/\//g, '__')
}

/** Template is derived from the route shape — the same mapping COVERAGE.md uses. */
export function templateFor(url) {
  const p = new URL(url).pathname
  if (p === '/') return 'home'
  if (p.startsWith('/course-detail/')) return 'course-detail'
  if (p === '/blog/') return 'blog-list'
  if (p.startsWith('/blog/category/')) return 'blog-category'
  if (p.startsWith('/blog/')) return 'blog-post'
  if (p.startsWith('/community/')) return 'community-group'
  if (p === '/community/' || p === '/community-detail') return 'community'
  if (p === '/books/' || p === '/ebooks/') return 'books'
  if (p === '/courses/' || p === '/all-products/' || p === '/mini-courses/') return 'catalog'
  if (p === '/groups/' || p === '/contest/') return 'community'
  if (p === '/signup/' || p === '/signin/' || p === '/login/') return 'auth'
  if (p === '/user/' || p === '/membership' || p === '/account') return 'account'
  if (p === '/offers/' || p === '/payments/' || p === '/you-have-paid/' || p === '/books-stripe-payment/') return 'checkout'
  if (p === '/appointment' || p === '/private-1-on-1-consultation' || p === '/freelancer-webinar/' || p === '/webinar-registration-freelancing/')
    return 'coaching'
  if (p === '/savvybot-ai-agent/' || p === '/chatbot-test-page/') return 'ai'
  if (p === '/contact-us/' || p === '/about-us/' || p === '/testimonials/' || p === '/ccs-testimonials/') return 'legal'
  if (p.includes('policy') || p.includes('terms')) return 'legal'
  if (p === '/free/' || p === '/freebies/' || p.includes('signup') || p.includes('pdf') || p === '/win-a-book/')
    return 'lead-magnet'
  return 'page'
}

const urls = sitemapUrls().filter((u) => !ONLY || u.includes(ONLY))
fs.mkdirSync(PAGES_DIR, { recursive: true })

const manifest = []
let total = 0
for (const url of urls) {
  const src = sourceFor(url)
  const key = keyFor(url)
  if (!src) {
    console.log(`MISS ${url}`)
    manifest.push({ route: new URL(url).pathname, key, template: templateFor(url), source: null, missing: true })
    continue
  }
  const html = fs.readFileSync(src, 'utf8')
  const ast = parseHtml(html)
  const meta = extractMeta(ast, url)
  const blocks = bodyBlocks(ast, { stripHeader: true })
  const spec = {
    route: new URL(url).pathname,
    key,
    template: templateFor(url),
    title: meta.title,
    meta,
    blocks,
  }
  const out = path.join(PAGES_DIR, `${key}.json`)
  const json = JSON.stringify(spec)
  fs.writeFileSync(out, json)
  total += json.length
  manifest.push({
    route: spec.route,
    key,
    template: spec.template,
    title: meta.title,
    source: path.relative(ROOT, src),
    bytes: json.length,
  })
}

manifest.sort((a, b) => a.route.localeCompare(b.route))
fs.writeFileSync(
  path.join(PAGES_DIR, 'index.json'),
  JSON.stringify({ generated: new Date().toISOString(), count: manifest.length, pages: manifest }, null, 2),
)

console.log(`\npages: ${manifest.length}  total spec bytes: ${(total / 1024 / 1024).toFixed(2)} MB`)
const byTemplate = {}
for (const m of manifest) byTemplate[m.template] = (byTemplate[m.template] || 0) + 1
console.log('templates:', byTemplate)
const biggest = [...manifest].sort((a, b) => (b.bytes || 0) - (a.bytes || 0)).slice(0, 8)
for (const b of biggest) console.log(`  ${String(b.bytes).padStart(8)}  ${b.route}`)
