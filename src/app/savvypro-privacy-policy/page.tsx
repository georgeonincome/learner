import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('savvypro-privacy-policy')
}

export default function Page() {
  return <BlockPage slug="savvypro-privacy-policy" />
}
