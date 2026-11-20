import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('5-types-of-expert-businesses-you-can-launch')
}

export default function Page() {
  return <TemplatePage slug="5-types-of-expert-businesses-you-can-launch" />
}
