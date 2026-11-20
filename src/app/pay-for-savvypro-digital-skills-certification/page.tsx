import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('pay-for-savvypro-digital-skills-certification')
}

export default function Page() {
  return <TemplatePage slug="pay-for-savvypro-digital-skills-certification" />
}
