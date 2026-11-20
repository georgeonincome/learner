/**
 * import-reference.mts — M1 full reference seed (audit C4/D10/G26, plan §0.3).
 *
 * Imports the authoritative reference dump into Turso with FULL structure:
 * 32 courses / 305 chapters / 1106 lessons / prices (USD+ZMW, tiers), 6 book
 * products, 22 blog posts + 6 categories, 96 builder pages (block trees),
 * 5 community spaces, navigation, settings, testimonials, conservative
 * membership tiers / webinars / appointment services / lead magnets.
 *
 * Brand rule (D3): factual structure (ids, slugs, positions, prices, types) is
 * preserved for parity; brand tokens are replaced with Lena; marketing prose
 * is ORIGINAL generated copy (never the reference's text). Lesson media and
 * book files were not capturable (GAPS U1/U2) -> pending slots, not fake data.
 *
 * Run: TURSO_DATABASE_URL=file:local.db npx tsx scripts/import-reference.mts
 * Idempotent: INSERT OR REPLACE keyed by reference ids.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

const ROOT = process.cwd()
const BRAND = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/brand.json'), 'utf8'))
const debrand = (s: string) => String(s ?? '').replace(/savvy\s*pro/gi, BRAND.name).replace(/savvypro/gi, BRAND.name)
const j = (v: unknown) => JSON.stringify(v ?? null)

const allCourses: Record<string, any> = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'database/reference/all-courses.json'), 'utf8'),
)
const nextDataPath = path.join(ROOT, '.cache/next-data.json')
if (!fs.existsSync(nextDataPath)) {
  console.error('Missing .cache/next-data.json — run: python3 scripts/extract-next-data.py')
  process.exit(1)
}
const nextData: Record<string, any> = JSON.parse(fs.readFileSync(nextDataPath, 'utf8'))
const specs: Record<string, any> = {}
for (const f of fs.readdirSync(path.join(ROOT, 'src/content/pages'))) {
  if (f.endsWith('.json') && f !== 'index.json') {
    try { specs[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/pages', f), 'utf8')) } catch {}
  }
}
const home = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/home.json'), 'utf8'))
const sitemap = fs.readFileSync(path.join(ROOT, '../_reference/sitemap.xml'), 'utf8')
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  new URL(m[1].trim()).pathname.replace(/\/$/, '') || '/',
)

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})
// Batched writes: per-statement execute is ~1s on this WSL disk; batch() is orders
// of magnitude faster. Flush before any read that depends on queued writes.
const queue: { sql: string; args: any[] }[] = []
async function flush() {
  if (!queue.length) return
  const batch = queue.splice(0, queue.length)
  await client.batch(batch, 'write')
}
async function run(sql: string, args: any[] = []) {
  queue.push({ sql, args })
  if (queue.length >= 400) await flush()
}

// ---------- original copy generators (never reference prose) ----------
function courseDescription(title: string, category: string, chapters: number, lessons: number): string {
  return `${title} is a ${category.toLowerCase()} program from ${BRAND.name}. Work through ${chapters} chapters and ${lessons} lessons at your own pace, with practical exercises you can apply to a real business or freelance career. Enrol once and keep lifetime access to every update.`
}
function lessonContent(type: string, title: string): string {
  switch (type) {
    case 'video': return j({ videoUrl: null, pending: true, note: 'Video media pending — supply via CMS (GAPS U1).' })
    case 'audio': return j({ audioUrl: null, pending: true, note: 'Audio media pending — supply via CMS (GAPS U1).' })
    case 'pdf': return j({ fileMediaId: null, pending: true, note: 'PDF pending — supply via CMS (GAPS U1).' })
    case 'download': return j({ fileMediaId: null, pending: true, note: 'Download file pending — supply via CMS (GAPS U1).' })
    case 'asgmt': return j({ prompt: `Assignment: ${title}. Submit your work as text or a file; your instructor reviews and grades it.`, pending: false })
    case 'quiz': return j({ questions: [], passMark: 70, pending: true, note: 'Quiz questions pending — supply via CMS (GAPS U1).' })
    default: return j({ html: '', pending: true, note: 'Lesson text pending — supply via CMS (GAPS U1).' })
  }
}
function blogBody(title: string, categoryName: string): string {
  const t = title.replace(/&amp;/g, '&')
  return [
    `<p>${t} — a practical question we hear often at ${BRAND.name}. This guide breaks it down into steps you can act on today, whether you are starting out or growing an existing business.</p>`,
    `<h2>Why it matters</h2><p>In ${categoryName.toLowerCase()}, small consistent actions compound. The businesses that win are not the ones with the biggest budget; they are the ones that understand their customer and show up with a clear offer, repeatedly.</p>`,
    `<h2>How to start</h2><p>Begin with one concrete action this week: write down the problem you solve, who has it, and where those people already gather. Then test a single message or offer against that audience and measure the response before scaling.</p>`,
    `<h2>Next step</h2><p>Explore the related ${BRAND.name} courses and books for structured practice, or ask the community for feedback on your first attempt. Progress beats perfection.</p>`,
  ].join('\n')
}
function bookChapters(title: string): string {
  return j([
    { title: 'Introduction', body: `${title} — preview chapter. This ${BRAND.name} edition opens with the core idea of the book and how to use it: read a chapter, apply one action, then move on. The full manuscript is delivered after enrolment.` },
    { title: 'Chapter 1 — Foundations', body: `Foundations preview: the vocabulary, the landscape, and the first decisions every beginner must make. Full chapters unlock with the complete book.` },
  ])
}

let n = { courses: 0, chapters: 0, lessons: 0, prices: 0, books: 0, posts: 0, cats: 0, pages: 0, spaces: 0 }

// ---------- courses / chapters / lessons / prices ----------
for (const [id, c] of Object.entries(allCourses)) {
  const chapters = c.chapter ?? []
  const lessonCount = chapters.reduce((a: number, ch: any) => a + (ch.lessons?.length ?? 0), 0)
  const title = debrand(c.title ?? c.course_slug)
  await run(
    `INSERT OR REPLACE INTO courses (id, slug, title, category, description, short_description, course_type,
      progressive_mode, max_enrollments, enrollment_days, course_level, language, includes_list, learning_list,
      guarantee_text, faq, preview_video, instructor_ids, bundle_course_ids, status, seo_title, seo_description, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`,
    [
      Number(id), c.course_slug, title, debrand(c.course_category ?? 'General'),
      courseDescription(title, debrand(c.course_category ?? 'General'), chapters.length, lessonCount),
      debrand(c.short_description ?? '').slice(0, 300) || `${title} — ${BRAND.name} program.`,
      c.course_type ?? 'SINGLE', c.progressive_mode ? 1 : 0,
      c.max_enrollments ?? null, null,
      debrand(c.course_level ?? 'All levels'), c.course_language ?? 'English',
      j(c.course_includes_list ?? []), j(c.course_learning_list ?? []),
      debrand(c.guarantee_text ?? ''), j(c.course_faq ?? []),
      c.preview_video_meta ? j(c.preview_video_meta) : null,
      j((c.course_instructors ?? []).map((i: any) => i.id ?? i)),
      j((c.bundle_courses ?? []).map((b: any) => b.id ?? b)),
      c.is_published ? 'published' : 'draft',
      title, courseDescription(title, debrand(c.course_category ?? 'General'), chapters.length, lessonCount).slice(0, 160),
    ],
  )
  n.courses++
  for (const ch of chapters) {
    await run(
      `INSERT OR REPLACE INTO chapters (id, course_id, position, title, content, is_published) VALUES (?,?,?,?,?,?)`,
      [ch.id, Number(id), ch.position ?? 0, debrand(ch.title ?? ''), debrand(ch.content ?? ''), ch.is_published ? 1 : 0],
    )
    n.chapters++
    for (const l of ch.lessons ?? []) {
      await run(
        `INSERT OR REPLACE INTO lessons (id, chapter_id, course_id, position, title, lesson_type, is_free, content, duration_sec, is_published)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [
          l.id, ch.id, Number(id), l.position ?? 0, debrand(l.title ?? ''),
          l.lesson_type ?? 'text', l.is_free ? 1 : 0, lessonContent(l.lesson_type ?? 'text', debrand(l.title ?? '')),
          Number(l.meta?.duration ?? l.duration ?? 0) || 0, l.is_published === 'PUBLISHED' || l.is_published === 1 ? 1 : 0,
        ],
      )
      n.lessons++
    }
  }
  for (const p of c.prices ?? []) {
    await run(
      `INSERT OR REPLACE INTO prices (id, entity_type, entity_id, currency, price, strike_through, price_type,
        interval, interval_count, trial_days, enrollment_days, tier_type, tiers, is_default, stripe_price_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        p.id, 'course', Number(id), p.currency ?? 'USD', Number(p.price ?? 0),
        p.strike_through_price ?? null, p.price_type ?? 'ONE_TIME',
        p.interval ?? null, p.interval_count ?? null, p.trial_period_days ?? 0,
        p.enrollment_days ?? null, p.tier_type ?? null,
        j(p.tiers_flat_price ?? p.tiers ?? []), p.is_default ? 1 : 0,
        p.tiers_flat_price?.[0]?.stripe_price_uuid ?? p.stripe_price_uuid ?? null,
      ],
    )
    n.prices++
  }
}

// ---------- books ----------
// Parity model: the 6 /books product cards + standalone book landing slugs from
// the sitemap. Other ebook/audiobook COURSES stay courses (sold via course-detail).
await flush()
await run('DELETE FROM books')
const BOOK_PRODUCT_IDS = ['50150', '50151', '49792', '49793', '49795', '49794']
const bookSlugMap: Record<string, string> = {
  '49792': 'zero-to-hero-social-media-manager-book',
  '49795': 'infopreneur-roadmap-book',
  '50151': 'start-where-you-are-book',
}
async function insertBook(id: number, slug: string, c: any | null, status: string) {
  const t: string = c?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
  const format = /audiobook/i.test(t) ? 'audiobook' : 'ebook'
  const title = debrand(t).replace(/^free\s+(ebook|audiobook)\s*[-–]?\s*/i, '').replace(/\s*-\s*free audiobook$/i, '').replace(/ Book$/, '')
  await run(
    `INSERT OR REPLACE INTO books (id, slug, title, author, category, description, format, pages, preview_chapters,
      access, chapters, status, seo_title, seo_description, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`,
    [
      id, slug, title, `${BRAND.name} Team`, debrand(c?.course_category ?? 'Books'),
      `${title} — a free ${format} from ${BRAND.name}. Claim your copy, read the preview instantly, and get the full book in your library.`,
      format, Number(c?.meta?.pages ?? 0) || 100, 1, 'free',
      status === 'published' ? bookChapters(title) : '[]', status,
      title, `${title} — free ${format} from ${BRAND.name}.`,
    ],
  )
  n.books++
}
for (const id of BOOK_PRODUCT_IDS) {
  const c = allCourses[id]
  if (!c) {
    // 50150 — the one uncaptured /books card (GAPS U2): explicit draft slot.
    await run(
      `INSERT OR REPLACE INTO books (id, slug, title, author, category, description, format, pages, preview_chapters, access, chapters, status)
       VALUES (50150,'featured-book-50150','Featured Book (identity pending — GAPS U2)',?,'Books',
         'The sixth /books product was not capturable. Slot reserved; George to identify and publish via CMS.',
         'ebook',100,1,'free','[]','draft')`,
      [`${BRAND.name} Team`],
    )
    n.books++
    continue
  }
  await insertBook(Number(id), bookSlugMap[id] ?? c.course_slug, c, 'published')
  for (const p of c.prices ?? []) {
    await run(
      `INSERT OR REPLACE INTO prices (id, entity_type, entity_id, currency, price, strike_through, price_type, is_default)
       VALUES (?,?,?,?,?,?,?,?)`,
      [p.id + 1000000, 'book', Number(id), p.currency ?? 'USD', Number(p.price ?? 0), p.strike_through_price ?? null, p.price_type ?? 'FREE', p.is_default ? 1 : 0],
    )
    n.prices++
  }
}
await flush()
const standaloneBookSlugs = sitemapPaths.filter((p) =>
  (p.endsWith('-book') || p.includes('words-that-sell')) && !p.includes('win-a-book'))
for (const slug of standaloneBookSlugs) {
  const key = slug.replace(/^\//, '')
  const exists = (await client.execute({ sql: 'SELECT id FROM books WHERE slug = ?', args: [key] })).rows.length
  if (exists) continue
  const match = Object.entries(allCourses).find(([, c]) => c.course_slug === key)
  if (match) {
    await insertBook(Number(match[0]), key, match[1], 'published')
  } else {
    await insertBook(900000 + standaloneBookSlugs.indexOf(slug), key, null, 'draft')
  }
}

// ---------- blog categories + posts ----------
await flush()
const catKeys = Object.keys(nextData).filter((k) => k.startsWith('blog__category__'))
for (const k of catKeys) {
  const parts = k.split('__') // blog__category__<slug>__<id>
  const slug = parts[2], id = Number(parts[3])
  const pp = nextData[k]
  const name = debrand(pp.mainCategory?.name ?? pp.mainCategory?.category_name ?? slug.replace(/-/g, ' '))
  await run(`INSERT OR REPLACE INTO blog_categories (id, slug, name, description) VALUES (?,?,?,?)`,
    [id, slug, name, `Articles on ${name.toLowerCase()} from ${BRAND.name}.`])
  n.cats++
}
const postKeys = Object.keys(nextData).filter((k) => k.startsWith('blog__') && !k.startsWith('blog__category__'))
await flush()
const catRows = (await client.execute('SELECT id, slug, name FROM blog_categories')).rows
for (const k of postKeys) {
  const slug = k.slice(6)
  const spec = specs[k]
  const title = debrand(spec?.title ?? slug.replace(/-/g, ' '))
  // assign category by keyword overlap; fallback first category
  let catId = catRows[0]?.id ?? null
  let best = 0
  for (const cr of catRows) {
    const words = String(cr.name).toLowerCase().split(/\s+/)
    const score = words.filter((w) => slug.includes(w) && w.length > 3).length
    if (score > best) { best = score; catId = cr.id }
  }
  const catName = String(catRows.find((c) => c.id === catId)?.name ?? 'Digital Business')
  const body = blogBody(title, catName)
  const excerpt = `${title} — practical steps from ${BRAND.name}.`
  await run(
    `INSERT OR REPLACE INTO blog_posts (id, slug, title, excerpt, category_id, body, author, status, seo_title, seo_description, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'))`,
    [90000 + postKeys.indexOf(k), slug, title, excerpt, catId, body, `${BRAND.name} Team`, 'published', title, excerpt],
  )
  n.posts++
}

// ---------- builder pages (block trees as measurement oracle) ----------
const pageKeys = Object.keys(nextData).filter((k) =>
  !k.startsWith('blog__') && !k.startsWith('community__') && !k.startsWith('course-detail__') &&
  !k.startsWith('audio-details') && !k.startsWith('checkout') && k !== 'index')
function classify(key: string, spec: any): string {
  if (key === 'home' || key === 'index') return 'home'
  const t = spec?.template ?? ''
  if (t && t !== 'page') return t
  if (/terms|privacy|refund/.test(key)) return 'legal'
  if (/signup|free-tips|mailing-list|pdf|freebies|win-a-book|contest/.test(key)) return 'lead-magnet'
  if (/contact|appointment|webinar|consultation/.test(key)) return 'form'
  if (/getting-started|learn-digital|grow-my-business|build-your-expert|business-solutions|choose-your-path/.test(key)) return 'path-landing'
  return 'blocks'
}
for (const k of pageKeys) {
  const pp = nextData[k]
  const spec = specs[k]
  const slug = (pp.page_slug ?? spec?.route ?? k).replace(/^\//, '').replace(/\/$/, '') || k
  const title = debrand(pp.page_name ?? spec?.title ?? slug.replace(/-/g, ' '))
  const present = pp.initialState?.builder?.present ?? {}
  const blocksRaw = { nodeTreeIDS: present.nodeTreeIDS ?? [], nodes: present.nodes ?? {} }
  let seo: any = {}
  try { seo = typeof pp.seo_meta_data === 'string' ? JSON.parse(pp.seo_meta_data || '{}') : (pp.seo_meta_data ?? {}) } catch {}
  await run(
    `INSERT OR REPLACE INTO pages (id, slug, title, template, blocks, blocks_raw, status, seo_title, seo_description, og_image, no_index, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`,
    [
      pp.page_id ?? 800000 + pageKeys.indexOf(k), slug, title, classify(k, spec),
      '[]', j(blocksRaw), 'published',
      debrand(seo.meta_title ?? seo.title ?? spec?.meta?.title ?? title),
      debrand(seo.meta_description ?? spec?.meta?.description ?? '') || `${title} — ${BRAND.name}.`,
      seo['og:image'] ?? null, pp.google_no_index ? 1 : 0,
    ],
  )
  n.pages++
}
// home page record (index key)
{
  const pp = nextData['index']
  const present = pp.initialState?.builder?.present ?? {}
  await run(
    `INSERT OR REPLACE INTO pages (id, slug, title, template, blocks, blocks_raw, status, seo_title, seo_description, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,datetime('now'))`,
    [pp.page_id ?? 288403, 'home', `${BRAND.name} — ${BRAND.tagline}`, 'home', '[]',
     j({ nodeTreeIDS: present.nodeTreeIDS ?? [], nodes: present.nodes ?? {} }), 'published',
     `${BRAND.name} — ${BRAND.tagline}`, BRAND.description],
  )
  n.pages++
}

// ---------- community spaces (all 5 reference groups) ----------
await flush()
await run('DELETE FROM community_spaces')
// 650/853 are gated on the reference (no communityData in capture); facts below
// were observed in the reference UI (captured-browser community pages).
const communityFallback: Record<string, { name: string; tagline: string; access: string }> = {
  '650': { name: 'VIP', tagline: 'By invitation only.', access: 'paid' },
  '853': { name: 'Content Creation School Chatgroup', tagline: 'Let’s discuss Freelancing', access: 'paid' },
}
const usedSpaceSlugs = new Set<string>()
for (const id of ['650', '834', '853', '4943', '4944']) {
  const cd = nextData[`community__${id}`]?.communityData ?? {}
  const fb = communityFallback[id]
  const name = debrand(cd.title ?? cd.group_name ?? fb?.name ?? `Community ${id}`)
  const access = cd.pricing_type === 'PAID' ? 'paid' : (fb?.access ?? 'free')
  // 4943/4944 share a slug on the reference; keep both groups addressable.
  let slug = debrand(cd.slug ?? `community-${id}`)
  if (usedSpaceSlugs.has(slug)) slug = `${slug}-${id}`
  usedSpaceSlugs.add(slug)
  await run(
    `INSERT OR REPLACE INTO community_spaces (id, slug, name, tagline, description, access, member_count, channels, status)
     VALUES (?,?,?,?,?,?,?,?, 'published')`,
    [Number(id), slug, name,
     debrand(cd.short_description ?? fb?.tagline ?? ''), debrand(cd.about ?? cd.short_description ?? fb?.tagline ?? ''),
     access, Number(cd.meta?.enrolled_count ?? 0), j(['General'])],
  )
  n.spaces++
}
// observed reference community prices (captured UI): 853 $67, 650 $250 one-time
await run(`INSERT OR REPLACE INTO prices (id, entity_type, entity_id, currency, price, price_type, is_default) VALUES (910853,'community',853,'USD',67,'ONE_TIME',1)`)
await run(`INSERT OR REPLACE INTO prices (id, entity_type, entity_id, currency, price, price_type, is_default) VALUES (910650,'community',650,'USD',250,'ONE_TIME',1)`)
n.prices += 2

// ---------- settings / navigation ----------
const sd = nextData['index']?.siteData ?? {}
const settings: Record<string, unknown> = {
  currency: sd.currency ?? 'USD',
  multi_currency: ['USD', 'ZMW'],
  is_auth_require_verified_email: sd.is_auth_require_verified_email ?? 1,
  is_auth_disable_signups: sd.is_auth_disable_signups ?? 0,
  is_auth_require_manual_approval: sd.is_auth_require_manual_approval ?? 0,
  checkout_address_mode: sd.checkout_address_mode ?? 'minimal',
  stripe_status: 1,
  gamification_mode: sd.gamification_mode ?? 0,
  brand: BRAND,
}
for (const [key, value] of Object.entries(settings)) {
  await run(`INSERT OR REPLACE INTO site_settings (key, value) VALUES (?,?)`, [key, j(value)])
}
try {
  const menu = JSON.parse(sd.primary_menu?.json ?? '[]')
  let pos = 0
  const walk = async (items: any[], parent: number | null): Promise<void> => {
    for (const it of items) {
      const href = String(it.menuUrl ?? '').replace(/^https?:\/\/(www\.)?savvypro\.org/, '').trim() || '/'
      const label = debrand(it.content?.default ?? it.label ?? href)
      const id = 700000 + pos
      await run(`INSERT OR REPLACE INTO navigation_items (id, menu, label, href, position, parent_id, open_new_tab) VALUES (?,?,?,?,?,?,?)`,
        [id, 'primary', label, href, pos++, parent, it.openInNewTab ? 1 : 0])
      if (it.submenu?.length) await walk(it.submenu, id)
    }
  }
  await walk(menu, null)
} catch (e) { console.warn('menu import skipped:', e) }

// ---------- testimonials (original copy from home.json) ----------
for (const [i, t] of (home.testimonials ?? []).entries()) {
  await run(`INSERT OR REPLACE INTO testimonials (id, name, role, segment, quote, result, position, status) VALUES (?,?,?,?,?,?,?,'published')`,
    [i + 1, debrand(t.name ?? ''), debrand(t.role ?? ''), debrand(t.segment ?? ''), debrand(t.quote ?? ''), debrand(t.result ?? ''), i])
}

// ---------- conservative CMS records (D7 / U3 / U6) ----------
const tiers = [
  ['free', 'Free Explorer', 'Browse free courses, books and community previews.', 0, 0, 'one_time', ['Free courses & ebooks', 'Community read access', 'Newsletter']],
  ['pro-monthly', 'Lena Pro (Monthly)', 'Full access to every course, book and the private community.', 29, 550, 'month', ['All courses & books', 'Private community', 'Monthly live Q&A', 'Certificates']],
  ['pro-yearly', 'Lena Pro (Yearly)', 'Everything in Pro, billed yearly — two months free.', 290, 5500, 'year', ['All courses & books', 'Private community', 'Monthly live Q&A', 'Certificates', '2 months free']],
]
for (const [i, t] of tiers.entries()) {
  await run(`INSERT OR REPLACE INTO membership_tiers (id, slug, name, description, price_usd, price_zmw, interval, features, position, status) VALUES (?,?,?,?,?,?,?,?,?,'published')`,
    [i + 1, t[0], t[1], t[2], t[3], t[4], t[5], j(t[6]), i])
}
await run(`INSERT OR REPLACE INTO webinars (id, slug, title, description, duration_min, host, status) VALUES (1,'freelancer-webinar','Freelancing Starter Webinar','A live introduction to freelancing with digital skills: finding clients, pricing, and delivery. Free registration.',60,'Lena Team','published')`)
await run(`INSERT OR REPLACE INTO appointment_services (id, slug, name, description, duration_min, price, currency, staff_name, availability, status) VALUES (1,'private-1-on-1-consultation','Private 1-on-1 Consultation','A focused 30-minute session on your business or learning path.',30,0,'USD','Lena Coach','{"mon":["09:00","10:00","11:00"],"wed":["09:00","10:00","11:00"],"fri":["09:00","10:00"]}','published')`)
const leads = [
  ['101-digital-skills-pdf-download', '101 Digital Skills PDF', 'A free checklist of 101 digital skills you can learn and sell.'],
  ['pdf-file-101-digital-skills', '101 Digital Skills (alternate)', 'Alternate delivery page for the 101 Digital Skills PDF.'],
  ['pdf-download-file-7-step-whatsapp-automation', '7-Step WhatsApp Automation PDF', 'Free guide: set up WhatsApp automation in 7 steps.'],
  ['freebies', 'Free Resource Library', 'All free Lena resources in one place.'],
]
for (const [i, l] of leads.entries()) {
  await run(`INSERT OR REPLACE INTO lead_magnets (id, slug, title, description, status) VALUES (?,?,?,?,'published')`, [i + 1, l[0], l[1], l[2]])
}
const programs = [
  ['digital-entreprenuership-program', 'Digital Entrepreneurship Program', 'coaching'],
  ['ccp-pdf-program', 'Content Creation Program Outline', 'mini-course'],
  ['launch-your-expert-business-bootcamp', 'Launch Your Expert Business Bootcamp', 'coaching'],
]
for (const [i, p] of programs.entries()) {
  await run(`INSERT OR REPLACE INTO programs (id, slug, title, description, kind, status) VALUES (?,?,?,?,?,'published')`,
    [i + 1, p[0], p[1], `${p[1]} — a ${BRAND.name} program.`, p[2]])
}

// ---------- verify census ----------
await flush()
const counts: Record<string, number> = {}
for (const t of ['courses', 'chapters', 'lessons', 'prices', 'books', 'blog_posts', 'blog_categories', 'pages', 'community_spaces', 'membership_tiers', 'testimonials', 'navigation_items']) {
  counts[t] = Number((await client.execute(`SELECT COUNT(*) c FROM ${t}`)).rows[0].c)
}
console.log('IMPORT CENSUS:', JSON.stringify(counts, null, 1))
const lt = (await client.execute('SELECT lesson_type, COUNT(*) c FROM lessons GROUP BY lesson_type')).rows
console.log('lesson types:', lt.map((r) => `${r.lesson_type}:${r.c}`).join(' '))
const cur = (await client.execute('SELECT currency, COUNT(*) c FROM prices GROUP BY currency')).rows
console.log('price currencies:', cur.map((r) => `${r.currency}:${r.c}`).join(' '))
if (counts.courses !== 32 || counts.chapters !== 305 || counts.lessons !== 1106) {
  console.error('❌ CENSUS MISMATCH vs reference (32/305/1106)')
  process.exit(1)
}
console.log('✅ reference parity census verified (32 courses / 305 chapters / 1106 lessons)')
await client.close()
