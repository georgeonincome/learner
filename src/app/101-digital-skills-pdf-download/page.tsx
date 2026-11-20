import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('101-digital-skills-pdf-download')
}

export default function Page() {
  return <BlockPage slug="101-digital-skills-pdf-download" />
}
