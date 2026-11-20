import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('whatsapp-automation-toolkit')
}

export default function Page() {
  return <TemplatePage slug="whatsapp-automation-toolkit" />
}
