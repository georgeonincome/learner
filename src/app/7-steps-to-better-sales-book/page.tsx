import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('7-steps-to-better-sales-book')
}

export default function Page() {
  return (<>
    <BlockPage slug="7-steps-to-better-sales-book" />
    <LeadMagnetSection slug="7-steps-to-better-sales-book" title="Get the 7 Steps to Better Sales book" />
  </>)
}
