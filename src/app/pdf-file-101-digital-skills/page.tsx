import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('pdf-file-101-digital-skills')
}

export default function Page() {
  return (<>
    <BlockPage slug="pdf-file-101-digital-skills" />
    <LeadMagnetSection slug="pdf-file-101-digital-skills" title="Get your PDF copy" />
  </>)
}
