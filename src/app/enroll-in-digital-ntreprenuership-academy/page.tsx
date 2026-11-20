import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('enroll-in-digital-ntreprenuership-academy')
}

export default function Page() {
  return <TemplatePage slug="enroll-in-digital-ntreprenuership-academy" />
}
