import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('101-digital-skills-pdf-download')
}

export default function Page() {
  return (<>
    <TemplatePage slug="101-digital-skills-pdf-download" />
    <LeadMagnetSection slug="101-digital-skills-pdf-download" title="Get the 101 Digital Skills guide" />
  </>)
}
