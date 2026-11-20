import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('ccs-program-outline-download')
}

export default function Page() {
  return <BlockPage slug="ccs-program-outline-download" />
}
