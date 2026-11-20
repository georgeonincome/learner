import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('join-our-mailing-list')
}

export default function Page() {
  return <BlockPage slug="join-our-mailing-list" />
}
