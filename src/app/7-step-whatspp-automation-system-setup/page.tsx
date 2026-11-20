import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('7-step-whatspp-automation-system-setup')
}

export default function Page() {
  return <TemplatePage slug="7-step-whatspp-automation-system-setup" />
}
