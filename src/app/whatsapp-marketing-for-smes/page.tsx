import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('whatsapp-marketing-for-smes')
}

export default function Page() {
  return <TemplatePage slug="whatsapp-marketing-for-smes" />
}
