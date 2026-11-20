import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('101-digital-skills-pdf-download')
}

export default function Page() {
  return (<>
    <BlockPage slug="101-digital-skills-pdf-download" />
    <LeadMagnetSection slug="101-digital-skills-pdf-download" title="Get the 101 Digital Skills guide" />
  </>)
}
