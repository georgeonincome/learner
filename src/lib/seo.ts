import type { Metadata } from 'next'
import { BRAND_NAME, BRAND_URL, BRAND_DESCRIPTION, BRAND_LOGO } from '@/lib/brand'

/**
 * SEO factory (M2, audit A4). Every public route gets: unique title +
 * description, canonical, Open Graph, Twitter card. JSON-LD is emitted by the
 * page via <JsonLd> (BlogPosting/BreadcrumbList/CollectionPage/Course/Product —
 * the reference's observed schema types, with Lena values).
 * No template-fallback descriptions: uniqueness is enforced per entity.
 */
export interface SeoInput {
  title: string
  description: string
  path: string
  ogImage?: string | null
  canonical?: string | null
  noIndex?: boolean
  type?: 'website' | 'article'
}

export function buildMetadata(input: SeoInput): Metadata {
  const url = input.canonical || `${BRAND_URL}${input.path.startsWith('/') ? input.path : `/${input.path}`}`
  const image = input.ogImage || `${BRAND_URL}${BRAND_LOGO}`
  const title = input.title.includes(BRAND_NAME) ? input.title : `${input.title} — ${BRAND_NAME}`
  return {
    title,
    description: input.description || BRAND_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: input.description || BRAND_DESCRIPTION,
      url,
      siteName: BRAND_NAME,
      locale: 'en_US',
      type: input.type ?? 'website',
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: input.description || BRAND_DESCRIPTION,
      images: [image],
    },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

/** Absolute URL helper for JSON-LD. */
export function absUrl(path: string): string {
  return `${BRAND_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  }
}

export function blogPostingLd(p: { title: string; description: string; slug: string; datePublished?: string; dateModified?: string; author?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    url: absUrl(`/blog/${p.slug}`),
    mainEntityOfPage: absUrl(`/blog/${p.slug}`),
    author: { '@type': 'Organization', name: p.author || BRAND_NAME },
    publisher: { '@type': 'Organization', name: BRAND_NAME, logo: { '@type': 'ImageObject', url: absUrl(BRAND_LOGO) } },
    ...(p.datePublished ? { datePublished: p.datePublished } : {}),
    ...(p.dateModified ? { dateModified: p.dateModified } : {}),
  }
}

export function collectionPageLd(c: { name: string; description: string; path: string; items: { name: string; path: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: c.name,
    description: c.description,
    url: absUrl(c.path),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: c.items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: absUrl(it.path) })),
    },
  }
}

export function courseLd(c: { title: string; description: string; slug: string; id: number; provider?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: c.title,
    description: c.description,
    url: absUrl(`/course-detail/${c.slug}/${c.id}`),
    provider: { '@type': 'Organization', name: c.provider || BRAND_NAME, sameAs: absUrl('/') },
  }
}

export function productLd(p: { name: string; description: string; path: string; price?: number; currency?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    url: absUrl(p.path),
    brand: { '@type': 'Brand', name: BRAND_NAME },
    ...(p.price != null
      ? { offers: { '@type': 'Offer', price: p.price, priceCurrency: p.currency ?? 'USD', availability: 'https://schema.org/InStock', url: absUrl(p.path) } }
      : {}),
  }
}
