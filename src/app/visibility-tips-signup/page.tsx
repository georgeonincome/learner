import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('visibility-tips-signup')
}

export default function Page() {
  return <BlockPage slug="visibility-tips-signup" />
}
