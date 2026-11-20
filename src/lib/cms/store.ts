import { query, insert } from '@/lib/turso'
import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * CMS store (M4, plan §0.3). Turso-authoritative CRUD for content entities with
 * revision history, audit log, and on-demand revalidation. Column whitelists per
 * entity prevent injection via dynamic column names. Every mutation records a
 * revision (restore-able) and an audit entry, then revalidates the public tags.
 */
export type Entity =
  | 'courses' | 'chapters' | 'lessons' | 'books' | 'programs'
  | 'blog_posts' | 'blog_categories' | 'pages' | 'testimonials' | 'faqs'
  | 'membership_tiers' | 'products' | 'community_spaces' | 'webinars'
  | 'appointment_services' | 'lead_magnets' | 'navigation_items'

interface EntityCfg {
  table: Entity
  columns: string[]            // writable columns (whitelist)
  slug?: string                // slug column for redirect handling
  tag: (row: any) => string[]  // cache tags to revalidate
  paths: (row: any) => string[] // public paths to revalidate
  json: string[]               // columns stored as JSON strings
}

const COMMON_SEO = ['seo_title', 'seo_description', 'og_image', 'canonical', 'no_index', 'status', 'publish_at']

export const ENTITIES: Record<Entity, EntityCfg> = {
  courses: {
    table: 'courses',
    columns: ['slug', 'title', 'category', 'description', 'short_description', 'course_type', 'progressive_mode', 'max_enrollments', 'enrollment_days', 'course_level', 'language', 'includes_list', 'learning_list', 'guarantee_text', 'faq', 'preview_video', 'instructor_ids', 'bundle_course_ids', 'cover_media_id', ...COMMON_SEO],
    slug: 'slug', json: ['includes_list', 'learning_list', 'faq', 'instructor_ids', 'bundle_course_ids'],
    tag: (r) => [`course-${r.id}`, 'catalog', 'sitemap'],
    paths: (r) => ['/courses', '/all-products', `/course-detail/${r.slug}/${r.id}`],
  },
  chapters: {
    table: 'chapters', columns: ['course_id', 'position', 'title', 'content', 'is_published'], json: [],
    tag: (r) => [`course-${r.course_id}`], paths: () => [],
  },
  lessons: {
    table: 'lessons', columns: ['chapter_id', 'course_id', 'position', 'title', 'lesson_type', 'is_free', 'content', 'duration_sec', 'drip_offset_days', 'prerequisite_lesson_id', 'is_published'], json: ['content'],
    tag: (r) => [`course-${r.course_id}`], paths: () => [],
  },
  books: {
    table: 'books', columns: ['slug', 'title', 'author', 'category', 'description', 'format', 'pages', 'cover_media_id', 'file_media_id', 'preview_chapters', 'access', 'chapters', ...COMMON_SEO],
    slug: 'slug', json: ['chapters'],
    tag: (r) => [`book-${r.slug}`, 'catalog', 'sitemap'], paths: (r) => ['/books', `/read/${r.slug}`],
  },
  programs: { table: 'programs', columns: ['slug', 'title', 'description', 'kind', 'course_ids', 'cover_media_id', ...COMMON_SEO], slug: 'slug', json: ['course_ids'], tag: () => ['catalog', 'sitemap'], paths: () => ['/mini-courses'] },
  blog_posts: {
    table: 'blog_posts', columns: ['slug', 'title', 'excerpt', 'category_id', 'body', 'cover_media_id', 'author', ...COMMON_SEO],
    slug: 'slug', json: [], tag: (r) => [`post-${r.slug}`, 'sitemap'], paths: (r) => ['/blog', `/blog/${r.slug}`],
  },
  blog_categories: { table: 'blog_categories', columns: ['slug', 'name', 'description'], slug: 'slug', json: [], tag: () => ['sitemap'], paths: () => ['/blog'] },
  pages: {
    table: 'pages', columns: ['slug', 'title', 'template', 'blocks', 'blocks_raw', ...COMMON_SEO],
    slug: 'slug', json: ['blocks', 'blocks_raw'], tag: (r) => [`page-${r.slug}`, 'sitemap'], paths: (r) => [r.slug === 'home' ? '/' : `/${r.slug}`],
  },
  testimonials: { table: 'testimonials', columns: ['name', 'role', 'segment', 'quote', 'result', 'avatar_media_id', 'position', 'status'], json: [], tag: () => ['page-home'], paths: () => ['/'] },
  faqs: { table: 'faqs', columns: ['entity_type', 'entity_id', 'question', 'answer', 'position'], json: [], tag: () => [], paths: () => [] },
  membership_tiers: { table: 'membership_tiers', columns: ['slug', 'name', 'description', 'price_usd', 'price_zmw', 'interval', 'features', 'position', 'status', 'publish_at'], slug: 'slug', json: ['features'], tag: () => ['settings'], paths: () => ['/membership'] },
  products: { table: 'products', columns: ['slug', 'name', 'product_type', 'description', 'file_media_id', ...COMMON_SEO], slug: 'slug', json: [], tag: () => ['catalog', 'sitemap'], paths: () => ['/all-products'] },
  community_spaces: { table: 'community_spaces', columns: ['slug', 'name', 'tagline', 'description', 'cover_media_id', 'access', 'member_count', 'channels', 'status'], slug: 'slug', json: ['channels'], tag: (r) => [`space-${r.id}`], paths: (r) => ['/groups', `/community/${r.id}`] },
  webinars: { table: 'webinars', columns: ['slug', 'title', 'description', 'starts_at', 'duration_min', 'host', 'cover_media_id', 'registration_open', 'status', 'publish_at', 'seo_title', 'seo_description', 'og_image', 'canonical'], slug: 'slug', json: [], tag: () => ['sitemap'], paths: (r) => [`/${r.slug}`] },
  appointment_services: { table: 'appointment_services', columns: ['slug', 'name', 'description', 'duration_min', 'price', 'currency', 'staff_name', 'availability', 'status'], slug: 'slug', json: ['availability'], tag: () => [], paths: () => ['/appointment'] },
  lead_magnets: { table: 'lead_magnets', columns: ['slug', 'title', 'description', 'file_media_id', 'deliver_email', 'status'], slug: 'slug', json: [], tag: () => [], paths: (r) => [`/${r.slug}`] },
  navigation_items: { table: 'navigation_items', columns: ['menu', 'label', 'href', 'position', 'parent_id', 'open_new_tab'], json: [], tag: () => ['settings'], paths: () => [] },
}

function serialize(cfg: EntityCfg, data: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(data)) {
    if (!cfg.columns.includes(k)) continue
    out[k] = cfg.json.includes(k) && typeof v !== 'string' ? JSON.stringify(v ?? null) : v
  }
  return out
}

export async function listEntity(entity: Entity, opts: { includeDrafts?: boolean; limit?: number } = {}) {
  const cfg = ENTITIES[entity]
  const where = opts.includeDrafts || !cfg.columns.includes('status') ? '' : "WHERE status = 'published'"
  const rows = await query<any>(`SELECT * FROM ${cfg.table} ${where} ORDER BY id DESC LIMIT ?`, [opts.limit ?? 500])
  return rows
}

export async function getEntity(entity: Entity, id: string | number) {
  const cfg = ENTITIES[entity]
  const rows = await query<any>(`SELECT * FROM ${cfg.table} WHERE id = ? LIMIT 1`, [id])
  return rows[0] ?? null
}

async function snapshot(entity: Entity, id: string | number, author: string) {
  const row = await getEntity(entity, id)
  if (!row) return
  const v = await query<{ v: number }>('SELECT COALESCE(MAX(version),0)+1 v FROM revisions WHERE entity_type=? AND entity_id=?', [entity, String(id)])
  await query('INSERT INTO revisions (entity_type, entity_id, version, snapshot, author) VALUES (?,?,?,?,?)',
    [entity, String(id), v[0]?.v ?? 1, JSON.stringify(row), author])
}

async function audit(actor: string, action: string, entity: Entity, id: string | number, diff: unknown) {
  await query('INSERT INTO audit_log (actor, action, entity_type, entity_id, diff) VALUES (?,?,?,?,?)',
    [actor, action, entity, String(id), JSON.stringify(diff ?? {})])
}

export function revalidateEntity(entity: Entity, row: any) {
  const cfg = ENTITIES[entity]
  try {
    for (const t of cfg.tag(row)) revalidateTag(t)
    for (const p of cfg.paths(row)) revalidatePath(p)
    revalidateTag('sitemap')
  } catch { /* revalidation is best-effort outside a request context */ }
}

export async function createEntity(entity: Entity, data: Record<string, any>, author: string) {
  const cfg = ENTITIES[entity]
  const clean = serialize(cfg, data)
  if (cfg.columns.includes('status') && !clean.status) clean.status = 'draft'
  const cols = Object.keys(clean)
  if (!cols.length) throw new Error('No valid fields')
  const ph = cols.map(() => '?').join(',')
  const newId = await insert(`INSERT INTO ${cfg.table} (${cols.join(',')}) VALUES (${ph})`, Object.values(clean))
  const id = newId ?? clean.id
  const row = await getEntity(entity, id as any)
  await snapshot(entity, id as any, author)
  await audit(author, 'create', entity, id as any, clean)
  if (row) revalidateEntity(entity, row)
  return row
}

export async function updateEntity(entity: Entity, id: string | number, data: Record<string, any>, author: string) {
  const cfg = ENTITIES[entity]
  const before = await getEntity(entity, id)
  if (!before) throw new Error('Not found')
  // slug change -> record a redirect from the old slug
  if (cfg.slug && data[cfg.slug] && before[cfg.slug] && data[cfg.slug] !== before[cfg.slug]) {
    await query('INSERT OR REPLACE INTO slug_redirects (from_slug, to_slug, entity_type) VALUES (?,?,?)',
      [before[cfg.slug], data[cfg.slug], entity])
  }
  const clean = serialize(cfg, data)
  const cols = Object.keys(clean)
  if (cols.length) {
    const set = cols.map((c) => `${c} = ?`).join(',')
    await query(`UPDATE ${cfg.table} SET ${set} WHERE id = ?`, [...Object.values(clean), id])
  }
  await snapshot(entity, id, author)
  await audit(author, 'update', entity, id, clean)
  const row = await getEntity(entity, id)
  if (row) revalidateEntity(entity, row)
  return row
}

export async function deleteEntity(entity: Entity, id: string | number, author: string) {
  const cfg = ENTITIES[entity]
  const before = await getEntity(entity, id)
  if (!before) return
  await snapshot(entity, id, author)
  if (cfg.columns.includes('deleted_at')) {
    await query(`UPDATE ${cfg.table} SET deleted_at = datetime('now'), status='archived' WHERE id = ?`, [id])
  } else {
    await query(`DELETE FROM ${cfg.table} WHERE id = ?`, [id])
  }
  await audit(author, 'delete', entity, id, {})
  revalidateEntity(entity, before)
}

export async function duplicateEntity(entity: Entity, id: string | number, author: string) {
  const cfg = ENTITIES[entity]
  const row = await getEntity(entity, id)
  if (!row) throw new Error('Not found')
  const copy: Record<string, any> = {}
  for (const c of cfg.columns) if (row[c] != null) copy[c] = row[c]
  if (cfg.slug && copy[cfg.slug]) copy[cfg.slug] = `${copy[cfg.slug]}-copy-${Date.now()}`
  if (copy.title) copy.title = `${copy.title} (copy)`
  if (cfg.columns.includes('status')) copy.status = 'draft'
  return createEntity(entity, copy, author)
}

export async function restoreRevision(entity: Entity, id: string | number, version: number, author: string) {
  const rows = await query<{ snapshot: string }>('SELECT snapshot FROM revisions WHERE entity_type=? AND entity_id=? AND version=? LIMIT 1', [entity, String(id), version])
  if (!rows[0]) throw new Error('Revision not found')
  const snap = JSON.parse(rows[0].snapshot)
  const cfg = ENTITIES[entity]
  const data: Record<string, any> = {}
  for (const c of cfg.columns) if (snap[c] != null) data[c] = snap[c]
  return updateEntity(entity, id, data, author)
}

export async function listRevisions(entity: Entity, id: string | number) {
  return query<any>('SELECT id, version, author, created_at FROM revisions WHERE entity_type=? AND entity_id=? ORDER BY version DESC', [entity, String(id)])
}

/** Reorder children (chapters/lessons) by explicit id order. */
export async function reorder(entity: Entity, orderedIds: (string | number)[], author: string) {
  for (let i = 0; i < orderedIds.length; i++) {
    const oid = orderedIds[i]
    if (oid == null) continue
    await query(`UPDATE ${ENTITIES[entity].table} SET position = ? WHERE id = ?`, [i, oid])
  }
  await audit(author, 'reorder', entity, 0, { orderedIds })
}
