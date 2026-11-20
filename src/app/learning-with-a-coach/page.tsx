import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('learning-with-a-coach')
}

export default function Page() {
  return <BlockPage slug="learning-with-a-coach" />
}
