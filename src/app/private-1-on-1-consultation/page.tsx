import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('private-1-on-1-consultation')
}

export default function Page() {
  return <TemplatePage slug="private-1-on-1-consultation" />
}
