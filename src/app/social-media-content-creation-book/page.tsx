import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('social-media-content-creation-book')
}

export default function Page() {
  return <TemplatePage slug="social-media-content-creation-book" />
}
