import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('pdf-file-101-digital-skills')
}

export default function Page() {
  return <BlockPage slug="pdf-file-101-digital-skills" />
}
