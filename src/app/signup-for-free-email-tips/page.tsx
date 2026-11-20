import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('signup-for-free-email-tips')
}

export default function Page() {
  return <BlockPage slug="signup-for-free-email-tips" />
}
