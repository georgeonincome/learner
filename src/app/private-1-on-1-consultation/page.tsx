import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('private-1-on-1-consultation')
}

export default function Page() {
  return <BlockPage slug="private-1-on-1-consultation" />
}
