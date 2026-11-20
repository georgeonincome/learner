import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('books-stripe-payment')
}

export default function Page() {
  return <BlockPage slug="books-stripe-payment" />
}
