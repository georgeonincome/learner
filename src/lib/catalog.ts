import coursesData from '@/content/courses.json'
import booksData from '@/content/books.json'
import courseIndex from '@/content/course-index.json'

/**
 * Catalog data layer.
 *
 * `src/content/courses.json` and `src/content/books.json` are the product records
 * (ids, slugs, prices, curriculum/chapter copy). Everything the learning and
 * commerce engines render is derived here so there is one source of truth.
 */

export type Course = {
  id: number
  slug: string
  title: string
  category: string
  description: string
  thumbnail: string
  price: number
  currency: string
  strike_through_price: number | null
  price_type: string
  is_default: boolean
  is_free: boolean
  chapters_count: number
  lessons_count: number
  curriculum_sample: string[]
}

export type BookChapter = { title: string; body: string }

export type Book = {
  id: number
  slug: string
  title: string
  category: string
  description: string
  author: string
  format: string
  price: number
  currency: string
  is_free: boolean
  pages: number
  cover_image: string
  preview_chapters: number
  chapters: BookChapter[]
}

export type Lesson = {
  id: string
  lessonId: string
  chapterIndex: number
  title: string
  durationSec: number
  free: boolean
}

const courses = (coursesData as { courses: Course[] }).courses
const books = (booksData as { books: Book[] }).books

export function getCourses(): Course[] {
  return courses
}

export function getCourse(idOrSlug: string | number): Course | null {
  const key = String(idOrSlug)
  return courses.find((c) => String(c.id) === key || c.slug === key) || null
}

/** Course-detail slugs the reference links to but the sitemap does not cover. */
export type IndexedCourse = {
  slug: string
  id: number
  title: string
  price: number
  currency: string
  category: string
  free: boolean
  chapters: number
  lessons: number
  curated: boolean
}

const indexed = (courseIndex as { courses: IndexedCourse[] }).courses

export function getIndexedCourses(): IndexedCourse[] {
  return indexed
}

export function getIndexedCourse(slugOrId: string | number): IndexedCourse | null {
  const key = String(slugOrId)
  return indexed.find((c) => String(c.id) === key || c.slug === key) || null
}

export function getBooks(): Book[] {
  return books
}

export function getBook(idOrSlug: string | number): Book | null {
  const key = String(idOrSlug)
  return books.find((b) => String(b.id) === key || b.slug === key) || null
}

/**
 * Expand a course's `curriculum_sample` into a chapter/lesson tree sized to
 * `chapters_count` x `lessons_count`, so the dashboard renders real, stable
 * curriculum instead of placeholder rows.
 */
export function getCourseCurriculum(course: Course): Lesson[] {
  const sample = course.curriculum_sample?.length
    ? course.curriculum_sample
    : [course.title]
  const chapters = Math.max(1, course.chapters_count || sample.length)
  const perChapter = Math.max(1, Math.round((course.lessons_count || chapters) / chapters))
  const out: Lesson[] = []
  for (let c = 0; c < chapters; c++) {
    const chapterTitle = sample[c % sample.length] ?? course.title
    for (let l = 0; l < perChapter; l++) {
      const n = out.length + 1
      out.push({
        id: `${course.slug}-${n}`,
        lessonId: `${course.id}/${n}`,
        chapterIndex: c,
        title: l === 0 ? chapterTitle : `${chapterTitle} — part ${l + 1}`,
        durationSec: 600 + ((n * 37) % 420),
        free: course.is_free,
      })
    }
  }
  return out
}

export function getCourseLesson(course: Course, lessonId: string): Lesson | null {
  return getCourseCurriculum(course).find((l) => l.lessonId === lessonId) || null
}

/** Price in minor units, for Stripe. */
export function toMinorUnits(amount: number, currency: string): number {
  const zeroDecimal = new Set(['JPY', 'KRW', 'VND', 'CLP'])
  return zeroDecimal.has(currency.toUpperCase()) ? Math.round(amount) : Math.round(amount * 100)
}

export function formatPrice(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`
}
