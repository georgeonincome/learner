import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('enroll-in-digital-ntreprenuership-academy')
}

export default function Page() {
  return <BlockPage slug="enroll-in-digital-ntreprenuership-academy" />
}
