import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('7-step-whatspp-automation-system-setup')
}

export default function Page() {
  return <BlockPage slug="7-step-whatspp-automation-system-setup" />
}
