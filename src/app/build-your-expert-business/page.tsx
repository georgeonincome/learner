import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('build-your-expert-business')
}

export default function Page() {
  return <BlockPage slug="build-your-expert-business" />
}
