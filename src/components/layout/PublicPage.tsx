import React from 'react'
import { SiteHeader } from './SiteHeader'
import { Footer } from './Footer'
import { RefBlocks } from '@/components/ref/RefNode'
import { getSpecByKey, type PageSpec } from '@/lib/page-spec'
import { buildMetadata } from '@/lib/seo'
import { debrand } from '@/lib/brand'
import { JsonLd } from '@/components/seo/JsonLd'

/**
 * PublicPage — INTERIM spec renderer for the few routes not yet migrated to
 * DB-driven templates (course-detail until M5, community until M8). SEO is
 * fully wired from the captured spec meta (canonical/OG/JSON-LD). The DOM-replay
 * layer itself is retired in M9 (Tailwind-only rebuild).
 */
export function PublicPage({ specKey }: { specKey: string }) {
  const spec: PageSpec | null = getSpecByKey(specKey)
  if (!spec) return null
  const jsonLd = Array.isArray(spec.meta?.jsonLd) ? spec.meta.jsonLd : []
  return (
    <>
      <SiteHeader />
      <main id="__next-content">
        <RefBlocks blocks={spec.blocks} route={spec.route} />
      </main>
      <Footer />
      {jsonLd.length ? <JsonLd data={jsonLd as object[]} /> : null}
    </>
  )
}

/** Metadata for a spec-driven route (static routes). */
export function specMetadata(specKey: string, fallback: string) {
  return specMetadataForSpec(getSpecByKey(specKey), fallback)
}

/** Metadata for a spec already resolved by a dynamic route. */
export function specMetadataForSpec(spec: PageSpec | null, fallback: string) {
  const title = debrand(spec?.meta?.title || spec?.title || fallback)
  const rawDesc = spec?.meta?.description
  const cleanDesc = rawDesc && !/^(null|undefined)$/i.test(String(rawDesc).trim()) ? debrand(String(rawDesc)) : ''
  const description =
    cleanDesc ||
    `${title} — courses, books and digital skills training from Lena.`
  const path = spec?.route || `/${fallback.toLowerCase().replace(/\s+/g, '-')}`
  return buildMetadata({
    title,
    description,
    path,
    ogImage: spec?.meta?.og?.['og:image'] ?? spec?.meta?.og?.image ?? null,
    type: spec?.template === 'blog-post' ? 'article' : 'website',
  })
}
