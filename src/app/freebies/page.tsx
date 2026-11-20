import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('freebies')
}

export default function Page() {
  return (<>
    <TemplatePage slug="freebies" />
    <LeadMagnetSection slug="freebies" title="Claim your freebie" />
  </>)
}
