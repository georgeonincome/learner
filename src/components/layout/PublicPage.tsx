import React from 'react'
import { SiteHeader } from './SiteHeader'
import { RefBlocks } from '@/components/ref/RefNode'
import { getSpecByKey, type PageSpec } from '@/lib/page-spec'
import { seoDescription } from '@/lib/seo'

/**
 * PublicPage — renders a captured reference route: the reproduced site header
 * followed by the reference's own section markup (from the page spec).
 */
export function PublicPage({ specKey }: { specKey: string }) {
  const spec: PageSpec | null = getSpecByKey(specKey)
  if (!spec) return null
  return (
    <>
      <SiteHeader />
      <main id="__next-content">
        <RefBlocks blocks={spec.blocks} route={spec.route} />
      </main>
    </>
  )
}

/** Metadata for a spec-driven route (static routes). */
export function specMetadata(specKey: string, fallback: string) {
  return specMetadataForSpec(getSpecByKey(specKey), fallback)
}

/** Metadata for a spec already resolved by a dynamic route. */
export function specMetadataForSpec(spec: PageSpec | null, fallback: string) {
  const template = spec?.template || 'page'
  return {
    title: spec?.title || fallback,
    description: spec?.meta?.description || seoDescription(template, spec?.route || ''),
  }
}
