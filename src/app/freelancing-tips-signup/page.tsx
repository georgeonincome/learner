import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('freelancing-tips-signup')
}

export default function Page() {
  return <BlockPage slug="freelancing-tips-signup" />
}
