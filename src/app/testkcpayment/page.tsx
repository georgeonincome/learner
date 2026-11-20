import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('testkcpayment')
}

export default function Page() {
  return <BlockPage slug="testkcpayment" />
}
