import type { MetadataRoute } from 'next'
import { BRAND_URL } from '@/lib/brand'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api', '/checkout', '/user', '/read/'],
      },
    ],
    sitemap: `${BRAND_URL}/sitemap.xml`,
  }
}
