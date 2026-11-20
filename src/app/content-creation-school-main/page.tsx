import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('content-creation-school-main')
}

export default function Page() {
  return <BlockPage slug="content-creation-school-main" />
}
