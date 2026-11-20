import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('pdf-download-file-7-step-whatsapp-automation')
}

export default function Page() {
  return (<>
    <BlockPage slug="pdf-download-file-7-step-whatsapp-automation" />
    <LeadMagnetSection slug="pdf-download-file-7-step-whatsapp-automation" title="Download the WhatsApp automation PDF" />
  </>)
}
