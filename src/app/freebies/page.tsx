import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'
import { LeadMagnetSection } from '@/components/forms/LeadMagnetSection'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('freebies')
}

export default function Page() {
  return (<>
    <BlockPage slug="freebies" />
    <LeadMagnetSection slug="freebies" title="Claim your freebie" />
  </>)
}
