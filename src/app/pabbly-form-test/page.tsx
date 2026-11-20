import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('pabbly-form-test')
}

export default function Page() {
  return <BlockPage slug="pabbly-form-test" />
}
