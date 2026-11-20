import { BlockPage } from '@/components/layout/BlockPage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata() {
  return buildMetadata({ title: 'Content Creation School — Introduction', description: 'See how the Content Creation School works and what you will build.', path: '/ccs-vsl1' })
}

export default function Page() {
  return <BlockPage slug="ccs-vsl1" />
}
