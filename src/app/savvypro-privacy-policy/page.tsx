import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('savvypro-privacy-policy')
}

export default function Page() {
  return <TemplatePage slug="savvypro-privacy-policy" />
}
