import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('zero-to-hero-social-media-manager-book')
}

export default function Page() {
  return <BlockPage slug="zero-to-hero-social-media-manager-book" />
}
