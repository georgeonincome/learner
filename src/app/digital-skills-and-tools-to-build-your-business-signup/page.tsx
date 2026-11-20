import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('digital-skills-and-tools-to-build-your-business-signup')
}

export default function Page() {
  return <BlockPage slug="digital-skills-and-tools-to-build-your-business-signup" />
}
