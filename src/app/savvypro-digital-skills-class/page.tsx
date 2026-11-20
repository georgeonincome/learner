import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('savvypro-digital-skills-class')
}

export default function Page() {
  return <TemplatePage slug="savvypro-digital-skills-class" />
}
