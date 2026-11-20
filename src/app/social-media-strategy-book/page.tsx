import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('social-media-strategy-book')
}

export default function Page() {
  return <BlockPage slug="social-media-strategy-book" />
}
