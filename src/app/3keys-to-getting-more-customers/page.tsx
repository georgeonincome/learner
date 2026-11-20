import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('3keys-to-getting-more-customers')
}

export default function Page() {
  return <BlockPage slug="3keys-to-getting-more-customers" />
}
