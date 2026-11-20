import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('grow-my-business')
}

export default function Page() {
  return <BlockPage slug="grow-my-business" />
}
