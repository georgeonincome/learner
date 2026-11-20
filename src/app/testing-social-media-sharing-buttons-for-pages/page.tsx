import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('testing-social-media-sharing-buttons-for-pages')
}

export default function Page() {
  return <BlockPage slug="testing-social-media-sharing-buttons-for-pages" />
}
