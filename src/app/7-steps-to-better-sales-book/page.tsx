import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('7-steps-to-better-sales-book')
}

export default function Page() {
  return (<>
    <TemplatePage slug="7-steps-to-better-sales-book" />
    <LeadMagnetSection slug="7-steps-to-better-sales-book" title="Get the 7 Steps to Better Sales book" />
  </>)
}
