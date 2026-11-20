import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('ccs-program-outline-download')
}

export default function Page() {
  return (<>
    <TemplatePage slug="ccs-program-outline-download" />
    <LeadMagnetSection slug="ccs-program-outline-download" title="Download the program outline" />
  </>)
}
