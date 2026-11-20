import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('coaching-program-detail')
}

export default function Page() {
  return <BlockPage slug="coaching-program-detail" />
}
