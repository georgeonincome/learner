/**
 * In-memory admin content store seeded from src/content/*.json.
 * In production, courses/lessons/books/posts are written to Firestore and
 * orders/memberships/users are read from Turso/Firebase Admin.
 */
import coursesData from '@/content/courses.json'
import blogData from '@/content/blog.json'

export interface AdminCourse {
  id: string | number
  slug: string
  title: string
  category: string
  description: string
  price: number
  isPublished: boolean
}

export interface AdminPost {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  content: string
}

export interface SiteSettings {
  siteName: string
  tagline: string
  supportEmail: string
  whatsapp: string
  maintenanceMode: boolean
}

interface AdminStore {
  courses: AdminCourse[]
  posts: AdminPost[]
  settings: SiteSettings
}

const initialCourses: AdminCourse[] = (coursesData.courses ?? []).map((c) => ({
  id: c.id,
  slug: c.slug,
  title: c.title,
  category: c.category,
  description: c.description,
  price: c.price,
  isPublished: true,
}))

const initialPosts: AdminPost[] = (blogData.posts ?? []).map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  category: p.category,
  publishedAt: p.publishedAt,
  content: p.content,
}))

const globalStore = globalThis as unknown as { __adminStore?: AdminStore }

export const adminStore: AdminStore =
  globalStore.__adminStore ??
  (globalStore.__adminStore = {
    courses: initialCourses,
    posts: initialPosts,
    settings: {
      siteName: 'Lena Learning',
      tagline: 'Practical tools, skills, training and hands-on support.',
      supportEmail: 'hello@lena.local',
      whatsapp: '+260 777 22 88 27',
      maintenanceMode: false,
    },
  })
