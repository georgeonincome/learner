import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('pdf-file-101-digital-skills')
}

export default function Page() {
  return (<>
    <TemplatePage slug="pdf-file-101-digital-skills" />
    <LeadMagnetSection slug="pdf-file-101-digital-skills" title="Get your PDF copy" />
  </>)
}
