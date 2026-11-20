import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('words-that-sell-copywriting-secrets-that-make-customers-buy')
}

export default function Page() {
  return <BlockPage slug="words-that-sell-copywriting-secrets-that-make-customers-buy" />
}
