import type { MetadataRoute } from 'next'
import registry from '@/content/sitemap-registry.json'
import { listCourses, listBooks, listPosts, listCategories, listSpaces, listPages } from '@/lib/content'
import { BRAND_URL } from '@/lib/brand'

/**
 * Sitemap (M2, audit A5): the 181-URL reference registry (route parity) unioned
 * with live CMS content. The 3 URLs that are 404 on the live reference are
 * excluded from lena's sitemap (they still resolve as true 404s, decision D1).
 */
const LIVE_404 = new Set(['/video-details', '/learning-hub', '/learn-with-expert-guidance'])

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = new Map<string, MetadataRoute.Sitemap[number]>()
  const add = (path: string, priority = 0.7) => {
    if (LIVE_404.has(path)) return
    const p = path === '/' ? '/' : path.replace(/\/$/, '')
    if (!urls.has(p)) urls.set(p, { url: `${BRAND_URL}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: path === '/' ? 1 : priority })
  }
  for (const p of registry as string[]) add(p)
  try {
    const { courses } = await listCourses({ pageSize: 500 })
    for (const c of courses) add(`/course-detail/${c.slug}/${c.id}`, 0.8)
    for (const b of await listBooks()) add(`/course-detail/${b.slug}/${b.id}`, 0.6)
    const { posts } = await listPosts({ pageSize: 500 })
    for (const p of posts) add(`/blog/${p.slug}`, 0.6)
    for (const c of await listCategories()) add(`/blog/category/${c.slug}/${c.id}`, 0.5)
    for (const s of await listSpaces()) add(`/community/${s.id}`, 0.5)
    for (const p of await listPages()) add(p.slug === 'home' ? '/' : `/${p.slug}`)
  } catch {
    // DB unavailable at build: registry-only sitemap still covers the route map.
  }
  return [...urls.values()]
}
