import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('pdf-download-file-7-step-whatsapp-automation')
}

export default function Page() {
  return (<>
    <TemplatePage slug="pdf-download-file-7-step-whatsapp-automation" />
    <LeadMagnetSection slug="pdf-download-file-7-step-whatsapp-automation" title="Download the WhatsApp automation PDF" />
  </>)
}
