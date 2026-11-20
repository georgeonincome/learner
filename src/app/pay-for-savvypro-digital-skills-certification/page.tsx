import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('pay-for-savvypro-digital-skills-certification')
}

export default function Page() {
  return <BlockPage slug="pay-for-savvypro-digital-skills-certification" />
}
