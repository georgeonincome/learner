import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('ccs-vsl1')
}

export default function Page() {
  return <BlockPage slug="ccs-vsl1" />
}
