import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('inner-circle')
}

export default function Page() {
  return <TemplatePage slug="inner-circle" />
}
