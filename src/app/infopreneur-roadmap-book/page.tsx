import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('infopreneur-roadmap-book')
}

export default function Page() {
  return <BlockPage slug="infopreneur-roadmap-book" />
}
