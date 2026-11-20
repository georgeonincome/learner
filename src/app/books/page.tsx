import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams
  if (ref === 'stripe-payment') {
    return buildMetadata({
      title: 'Books — secure payment',
      description: 'Complete your book purchase securely on Lena and unlock your library instantly.',
      path: '/books?ref=stripe-payment',
    })
  }
  return blockPageMetadata('books')
}

export default function Page() {
  return <BlockPage slug="books" />
}
