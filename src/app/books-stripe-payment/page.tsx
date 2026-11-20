import { BlockPage } from '@/components/layout/BlockPage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata() {
  return buildMetadata({ title: 'Books payment page', description: 'Complete your book purchase securely.', path: '/books-stripe-payment' })
}

export default function Page() {
  return <BlockPage slug="books-stripe-payment" />
}
