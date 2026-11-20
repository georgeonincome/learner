import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('signup-for-free-email-tips')
}

export default function Page() {
  return <TemplatePage slug="signup-for-free-email-tips" />
}
