import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('digital-skills-and-tools-to-build-your-business-signup')
}

export default function Page() {
  return <TemplatePage slug="digital-skills-and-tools-to-build-your-business-signup" />
}
