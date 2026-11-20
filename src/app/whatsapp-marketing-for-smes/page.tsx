import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('whatsapp-marketing-for-smes')
}

export default function Page() {
  return <BlockPage slug="whatsapp-marketing-for-smes" />
}
