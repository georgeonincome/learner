import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('launch-your-expert-business-bootcamp')
}

export default function Page() {
  return <BlockPage slug="launch-your-expert-business-bootcamp" />
}
