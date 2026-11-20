import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('about-us')
}

export default function Page() {
  return <BlockPage slug="about-us" />
}
