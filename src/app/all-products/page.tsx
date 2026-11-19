import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('all-products', '/all-products')

export default function Page() {
  return <PublicPage specKey="all-products" />
}
