import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('start-where-you-are-book')
}

export default function Page() {
  return <BlockPage slug="start-where-you-are-book" />
}
