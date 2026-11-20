import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('win-a-book')
}

export default function Page() {
  return (<>
    <TemplatePage slug="win-a-book" />
    <LeadMagnetSection slug="win-a-book" title="Enter the book draw" />
  </>)
}
