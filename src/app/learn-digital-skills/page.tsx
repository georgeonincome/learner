import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('learn-digital-skills')
}

export default function Page() {
  return <TemplatePage slug="learn-digital-skills" />
}
