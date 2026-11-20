import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('savvypro-digital-skills-class')
}

export default function Page() {
  return <BlockPage slug="savvypro-digital-skills-class" />
}
