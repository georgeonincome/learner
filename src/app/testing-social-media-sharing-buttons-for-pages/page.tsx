import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('testing-social-media-sharing-buttons-for-pages')
}

export default function Page() {
  return <TemplatePage slug="testing-social-media-sharing-buttons-for-pages" />
}
