import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('5-types-of-expert-businesses-you-can-launch')
}

export default function Page() {
  return <BlockPage slug="5-types-of-expert-businesses-you-can-launch" />
}
