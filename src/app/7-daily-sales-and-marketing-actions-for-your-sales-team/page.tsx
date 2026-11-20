import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('7-daily-sales-and-marketing-actions-for-your-sales-team')
}

export default function Page() {
  return <TemplatePage slug="7-daily-sales-and-marketing-actions-for-your-sales-team" />
}
