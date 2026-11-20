import type { Metadata } from 'next'
import brand from '@/content/brand.json'
import { buildMetadata } from '@/lib/seo'

/**
 * Deterministic, original per-route metadata. No captured reference spec, no
 * marketing copy from the source site. The slug itself guarantees uniqueness
 * for the sitemap crawl.
 */
export function pageMeta(slug: string, fallback?: string): Metadata {
  const human = (fallback && !fallback.startsWith('/') ? fallback : slug)
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const title = human.charAt(0).toUpperCase() + human.slice(1)
  return buildMetadata({
    title,
    description: `${title} — courses, books and learning resources from ${brand.name}.`,
    path: `/${slug}`,
  })
}
