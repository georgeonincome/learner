import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('getting-started-page')
}

export default function Page() {
  return <BlockPage slug="getting-started-page" />
}
