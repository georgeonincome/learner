import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('social-media-content-creation-book')
}

export default function Page() {
  return <BlockPage slug="social-media-content-creation-book" />
}
