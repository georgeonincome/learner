import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('3keys-to-getting-more-customers')
}

export default function Page() {
  return <TemplatePage slug="3keys-to-getting-more-customers" />
}
