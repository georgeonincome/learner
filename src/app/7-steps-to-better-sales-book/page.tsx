import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('7-steps-to-better-sales-book')
}

export default function Page() {
  return <BlockPage slug="7-steps-to-better-sales-book" />
}
