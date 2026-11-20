import { query } from '@/lib/turso'

/**
 * Content read layer (M2). Turso is authoritative (plan §0.1). Every public
 * render reads through here; admin mutations revalidate the matching tags.
 * Published-only by default; preview tokens bypass in M4.
 */
export const TAGS = {
  catalog: 'catalog',
  sitemap: 'sitemap',
  course: (id: string | number) => `course-${id}`,
  book: (slug: string) => `book-${slug}`,
  post: (slug: string) => `post-${slug}`,
  page: (slug: string) => `page-${slug}`,
  space: (id: string | number) => `space-${id}`,
  settings: 'settings',
}

const parse = <T>(s: unknown, fallback: T): T => {
  if (typeof s !== 'string') return (s as T) ?? fallback
  try { return JSON.parse(s) as T } catch { return fallback }
}

export interface CourseRow {
  id: number; slug: string; title: string; category: string; description: string
  short_description: string; course_type: string; progressive_mode: number
  max_enrollments: number | null; enrollment_days: number | null; course_level: string
  language: string; includes_list: string; learning_list: string; guarantee_text: string
  faq: string; preview_video: string | null; instructor_ids: string; bundle_course_ids: string
  cover_media_id: string | null; status: string; seo_title: string | null
  seo_description: string | null; og_image: string | null; canonical: string | null; no_index: number
}
export interface ChapterRow { id: number; course_id: number; position: number; title: string; content: string; is_published: number }
export interface LessonRow {
  id: number; chapter_id: number; course_id: number; position: number; title: string
  lesson_type: string; is_free: number; content: string; duration_sec: number
  drip_offset_days: number; prerequisite_lesson_id: number | null; is_published: number
}
export interface PriceRow {
  id: number; entity_type: string; entity_id: number; currency: string; price: number
  strike_through: number | null; price_type: string; interval: string | null
  interval_count: number | null; trial_days: number; enrollment_days: number | null
  tier_type: string | null; tiers: string; is_default: number; stripe_price_id: string | null
}
export interface BookRow {
  id: number; slug: string; title: string; author: string; category: string; description: string
  format: string; pages: number; cover_media_id: string | null; file_media_id: string | null
  preview_chapters: number; access: string; chapters: string; status: string
  seo_title: string | null; seo_description: string | null; og_image: string | null; canonical: string | null; no_index: number
}
export interface PostRow {
  id: number; slug: string; title: string; excerpt: string; category_id: number | null
  body: string; cover_media_id: string | null; author: string; status: string
  seo_title: string | null; seo_description: string | null; og_image: string | null; canonical: string | null; no_index: number
  created_at: string; updated_at: string
}
export interface PageRow {
  id: number; slug: string; title: string; template: string; blocks: string; blocks_raw: string
  status: string; seo_title: string | null; seo_description: string | null; og_image: string | null
  canonical: string | null; no_index: number
}

const COURSE_COLS = 'id, slug, title, category, description, short_description, course_type, progressive_mode, max_enrollments, enrollment_days, course_level, language, includes_list, learning_list, guarantee_text, faq, preview_video, instructor_ids, bundle_course_ids, cover_media_id, status, seo_title, seo_description, og_image, canonical, no_index'

export async function listCourses(opts: { search?: string; category?: string; sort?: string; page?: number; pageSize?: number; includeDrafts?: boolean } = {}) {
  const { search, category, sort = 'newest', page = 1, pageSize = 12, includeDrafts } = opts
  const where: string[] = includeDrafts ? [] : ["status = 'published'", 'deleted_at IS NULL']
  const args: any[] = []
  if (search) { where.push('(title LIKE ? OR description LIKE ?)'); args.push(`%${search}%`, `%${search}%`) }
  if (category) { where.push('category = ?'); args.push(category) }
  const order = sort === 'price-low' ? 'id ASC' : sort === 'price-high' ? 'id DESC' : sort === 'title' ? 'title ASC' : 'id DESC'
  const w = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const total = Number((await query<{ c: number }>(`SELECT COUNT(*) c FROM courses ${w}`, args))[0]?.c ?? 0)
  const rows = await query<CourseRow>(
    `SELECT ${COURSE_COLS} FROM courses ${w} ORDER BY ${order} LIMIT ? OFFSET ?`,
    [...args, pageSize, (page - 1) * pageSize],
  )
  return { courses: rows, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function getCourse(slugOrId: string | number): Promise<CourseRow | null> {
  const key = String(slugOrId)
  const rows = await query<CourseRow>(
    `SELECT ${COURSE_COLS} FROM courses WHERE (slug = ? OR CAST(id AS TEXT) = ?) AND deleted_at IS NULL LIMIT 1`,
    [key, key],
  )
  return rows[0] ?? null
}

export async function getCurriculum(courseId: number): Promise<{ chapter: ChapterRow; lessons: LessonRow[] }[]> {
  const chapters = await query<ChapterRow>(
    'SELECT id, course_id, position, title, content, is_published FROM chapters WHERE course_id = ? AND is_published = 1 ORDER BY position',
    [courseId],
  )
  const lessons = await query<LessonRow>(
    'SELECT id, chapter_id, course_id, position, title, lesson_type, is_free, content, duration_sec, drip_offset_days, prerequisite_lesson_id, is_published FROM lessons WHERE course_id = ? AND is_published = 1 ORDER BY position',
    [courseId],
  )
  return chapters.map((chapter) => ({ chapter, lessons: lessons.filter((l) => l.chapter_id === chapter.id) }))
}

export async function getLesson(lessonId: number): Promise<LessonRow | null> {
  const rows = await query<LessonRow>(
    'SELECT id, chapter_id, course_id, position, title, lesson_type, is_free, content, duration_sec, drip_offset_days, prerequisite_lesson_id, is_published FROM lessons WHERE id = ? LIMIT 1',
    [lessonId],
  )
  return rows[0] ?? null
}

export async function getPrices(entityType: string, entityId: number): Promise<PriceRow[]> {
  return query<PriceRow>(
    'SELECT id, entity_type, entity_id, currency, price, strike_through, price_type, interval, interval_count, trial_days, enrollment_days, tier_type, tiers, is_default, stripe_price_id FROM prices WHERE entity_type = ? AND entity_id = ? ORDER BY is_default DESC, currency',
    [entityType, entityId],
  )
}

export async function listBooks(includeDrafts = false): Promise<BookRow[]> {
  const w = includeDrafts ? '' : "WHERE status = 'published' AND deleted_at IS NULL"
  return query<BookRow>(`SELECT * FROM books ${w} ORDER BY id`)
}
export async function getBook(slugOrId: string | number): Promise<BookRow | null> {
  const key = String(slugOrId)
  const rows = await query<BookRow>('SELECT * FROM books WHERE (slug = ? OR CAST(id AS TEXT) = ?) AND deleted_at IS NULL LIMIT 1', [key, key])
  return rows[0] ?? null
}

export async function listPosts(opts: { categoryId?: number; page?: number; pageSize?: number; includeDrafts?: boolean } = {}) {
  const { categoryId, page = 1, pageSize = 12, includeDrafts } = opts
  const where: string[] = includeDrafts ? [] : ["status = 'published'", 'deleted_at IS NULL']
  const args: any[] = []
  if (categoryId) { where.push('category_id = ?'); args.push(categoryId) }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const total = Number((await query<{ c: number }>(`SELECT COUNT(*) c FROM blog_posts ${w}`, args))[0]?.c ?? 0)
  const rows = await query<PostRow>(`SELECT * FROM blog_posts ${w} ORDER BY id DESC LIMIT ? OFFSET ?`, [...args, pageSize, (page - 1) * pageSize])
  return { posts: rows, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) }
}
export async function getPost(slug: string): Promise<PostRow | null> {
  const rows = await query<PostRow>('SELECT * FROM blog_posts WHERE slug = ? AND deleted_at IS NULL LIMIT 1', [slug])
  return rows[0] ?? null
}
export async function listCategories() {
  return query<{ id: number; slug: string; name: string; description: string }>('SELECT * FROM blog_categories ORDER BY id')
}
export async function getCategory(slugOrId: string | number) {
  const key = String(slugOrId)
  const rows = await query<{ id: number; slug: string; name: string; description: string }>(
    'SELECT * FROM blog_categories WHERE slug = ? OR CAST(id AS TEXT) = ? LIMIT 1', [key, key])
  return rows[0] ?? null
}

export async function getPage(slug: string): Promise<PageRow | null> {
  const rows = await query<PageRow>('SELECT * FROM pages WHERE slug = ? AND deleted_at IS NULL LIMIT 1', [slug])
  return rows[0] ?? null
}
export async function listPages(includeDrafts = false) {
  const w = includeDrafts ? '' : "WHERE status = 'published' AND deleted_at IS NULL"
  return query<PageRow>(`SELECT id, slug, title, template, status, seo_title, seo_description, no_index FROM pages ${w} ORDER BY slug`)
}

export async function listSpaces() {
  return query<any>("SELECT * FROM community_spaces WHERE status = 'published' ORDER BY id")
}
export async function getSpace(id: string | number) {
  const rows = await query<any>('SELECT * FROM community_spaces WHERE CAST(id AS TEXT) = ? LIMIT 1', [String(id)])
  return rows[0] ?? null
}

export async function listTiers() {
  return query<any>("SELECT * FROM membership_tiers WHERE status = 'published' ORDER BY position")
}
export async function getSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  const rows = await query<{ value: string }>('SELECT value FROM site_settings WHERE key = ? LIMIT 1', [key])
  return rows[0] ? parse<T>(rows[0].value, fallback) : fallback
}
export async function getNav(menu = 'primary') {
  return query<{ id: number; label: string; href: string; position: number; parent_id: number | null; open_new_tab: number }>(
    'SELECT id, label, href, position, parent_id, open_new_tab FROM navigation_items WHERE menu = ? ORDER BY position', [menu])
}
export async function listTestimonials() {
  return query<any>("SELECT * FROM testimonials WHERE status = 'published' ORDER BY position")
}
export async function getWebinar(slug: string) {
  const rows = await query<any>('SELECT * FROM webinars WHERE slug = ? LIMIT 1', [slug])
  return rows[0] ?? null
}
export async function getService(slug: string) {
  const rows = await query<any>('SELECT * FROM appointment_services WHERE slug = ? LIMIT 1', [slug])
  return rows[0] ?? null
}
export async function getLeadMagnet(slug: string) {
  const rows = await query<any>('SELECT * FROM lead_magnets WHERE slug = ? LIMIT 1', [slug])
  return rows[0] ?? null
}
export async function getProgram(slug: string) {
  const rows = await query<any>('SELECT * FROM programs WHERE slug = ? LIMIT 1', [slug])
  return rows[0] ?? null
}

export { parse as parseJson }
