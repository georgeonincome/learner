import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('win-a-book')
}

export default function Page() {
  return (<>
    <BlockPage slug="win-a-book" />
    <LeadMagnetSection slug="win-a-book" title="Enter the book draw" />
  </>)
}
