import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('build-your-expert-business')
}

export default function Page() {
  return <TemplatePage slug="build-your-expert-business" />
}
