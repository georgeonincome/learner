import { TemplatePage } from '@/components/templates/TemplatePage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

/**
 * /signin is the canonical sign-in surface for legacy payment aliases. Each
 * referrer is reflected in the metadata so every sitemap URL has a unique
 * title/description even after redirects (audit A).
 */
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ ref?: string; callbackUrl?: string }> }) {
  const { ref, callbackUrl } = await searchParams
  const fromRef = ref || (callbackUrl
    ? new URLSearchParams(callbackUrl.split('?')[1] ?? '').get('ref') || callbackUrl.split('?')[0]?.replace(/^\//, '')
    : '')
  if (!fromRef) {
    return buildMetadata({
      title: 'Sign in to your Lena account',
      description: 'Sign in to continue to your Lena courses, books and dashboard.',
      path: '/signin',
    })
  }
  const label = fromRef.replace(/[-_]/g, ' ')
  return buildMetadata({
    title: `Sign in — ${label}`,
    description: `Sign in to continue with ${label} on Lena — courses, books and digital skills training.`,
    path: `/signin?ref=${encodeURIComponent(fromRef)}`,
    noIndex: true,
  })
}

export default function Page() {
  return <TemplatePage slug="login" />
}
