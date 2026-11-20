import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('7-sytem-whatsapp-automation-setup')
}

export default function Page() {
  return <TemplatePage slug="7-sytem-whatsapp-automation-setup" />
}
