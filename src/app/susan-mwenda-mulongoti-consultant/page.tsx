import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('susan-mwenda-mulongoti-consultant')
}

export default function Page() {
  return <BlockPage slug="susan-mwenda-mulongoti-consultant" />
}
