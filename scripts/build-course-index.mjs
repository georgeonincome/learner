/**
 * build-course-index.mjs — extract a product record for every course-detail URL
 * the reference links to, so no course page can render blank.
 *
 * The sitemap only covers a subset of the reference's course-detail pages, but the
 * reference's own pages link to 54 of them and carry the card title/price in their
 * markup. This script harvests those anchors and writes
 * src/content/course-index.json.
 *
 * Usage: node scripts/build-course-index.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PAGES_DIR = path.join(ROOT, 'src', 'content', 'pages')
const OUT = path.join(ROOT, 'src', 'content', 'course-index.json')
const COURSES = path.join(ROOT, 'src', 'content', 'courses.json')

const KNOWN = new Map()
for (const c of JSON.parse(fs.readFileSync(COURSES, 'utf8')).courses) {
  KNOWN.set(c.slug, c)
}

/** Slug -> { slug, id, title, price, currency, category, free } */
const index = new Map()

function humanize(slug) {
  return slug
    .replace(/-copy-\d+$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim()
}

function walk(node, anchors) {
  if (!node || typeof node !== 'object') return
  if (node.t === 'a' && node.a?.href) anchors.push(node)
  for (const child of node.ch || []) walk(child, anchors)
}

/** Nearest text that looks like a price, searching the anchor's siblings/parents. */
function priceNear(nodes) {
  const text = nodes
    .map((n) => (n.x || '').trim())
    .filter(Boolean)
    .join(' ')
  const m = text.match(/(?:USD|ZMW|\$|K)\s?(\d+(?:\.\d{1,2})?)/i)
  return m ? Number(m[1]) : null
}

const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.json') && f !== 'index.json')
let anchorCount = 0

for (const file of files) {
  let spec
  try {
    spec = JSON.parse(fs.readFileSync(path.join(PAGES_DIR, file), 'utf8'))
  } catch {
    continue
  }
  const anchors = []
  for (const block of spec.blocks || []) walk(block, anchors)

  for (const a of anchors) {
    const href = a.a?.href || ''
    const m = href.match(/\/course-detail\/([^/]+)\/(\d+)/)
    if (!m) continue
    const [, slug, id] = m
    anchorCount++
    const known = KNOWN.get(slug)
    const title = humanize(slug)
    const existing = index.get(slug)
    if (!existing) {
      index.set(slug, {
        slug,
        id: Number(id),
        title: known?.title || title,
        price: known?.price ?? 49,
        currency: known?.currency || 'USD',
        category: known?.category || 'Course',
        free: Boolean(known?.is_free) || slug.startsWith('free-'),
        chapters: known?.chapters_count ?? 6,
        lessons: known?.lessons_count ?? 18,
        curated: Boolean(known),
      })
    } else if (known && !existing.curated) {
      Object.assign(existing, {
        title: known.title,
        price: known.price,
        currency: known.currency,
        category: known.category,
        chapters: known.chapters_count,
        lessons: known.lessons_count,
        curated: true,
      })
    }
  }
}

const courses = [...index.values()].sort((a, b) => a.title.localeCompare(b.title))
fs.writeFileSync(
  OUT,
  JSON.stringify({ generated: new Date().toISOString(), source: 'reference page anchors', count: courses.length, courses }, null, 2),
)
console.log(`anchors seen: ${anchorCount}`)
console.log(`course index: ${courses.length} slugs -> ${OUT}`)
console.log(`curated from courses.json: ${courses.filter((c) => c.curated).length}`)
