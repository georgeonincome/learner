import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('ccs-program-outline-download')
}

export default function Page() {
  return (<>
    <BlockPage slug="ccs-program-outline-download" />
    <LeadMagnetSection slug="ccs-program-outline-download" title="Download the program outline" />
  </>)
}
