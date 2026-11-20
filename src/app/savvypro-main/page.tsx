import { BlockPage } from '@/components/layout/BlockPage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata() {
  return buildMetadata({ title: 'Lena main site', description: 'The main Lena digital skills site — courses, books and coaching.', path: '/savvypro-main' })
}

export default function Page() {
  return <BlockPage slug="savvypro-main" />
}
