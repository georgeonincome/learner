import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPage, parseJson } from '@/lib/content'
import type { CompiledBlock } from '@/lib/blocks/compile'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Footer } from '@/components/layout/Footer'
import { buildMetadata } from '@/lib/seo'
import { debrand } from '@/lib/brand'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo'

/**
 * BlockPage (M2): the CMS-driven public page template. Replaces the DOM-replay
 * PublicPage — structure comes from compiled Tailwind blocks in Turso, colors
 * from Lena tokens, copy from the original-copy policy. ISR + on-demand
 * revalidation (M4) keep it fresh after admin edits.
 */
export const revalidate = 3600

export async function blockPageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug)
  if (!page) return buildMetadata({ title: 'Page not found', description: 'This page does not exist.', path: `/${slug}`, noIndex: true })
  return buildMetadata({
    title: debrand(page.seo_title || page.title),
    description: debrand(page.seo_description || `${page.title} — courses, books and training from Lena.`),
    path: slug === 'home' ? '/' : `/${slug}`,
    ogImage: page.og_image,
    noIndex: !!page.no_index,
  })
}

export async function BlockPage({ slug }: { slug: string }) {
  const page = await getPage(slug)
  if (!page || page.status !== 'published') notFound()
  const blocks = parseJson<CompiledBlock[]>(page.blocks, [])
  return (
    <>
      <SiteHeader />
      <main id="__next-content">
        <BlockRenderer blocks={blocks} />
      </main>
      <Footer />
      {slug !== 'home' ? (
        <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: page.title, path: `/${slug}` }])} />
      ) : null}
    </>
  )
}
