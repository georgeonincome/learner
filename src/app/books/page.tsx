import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('books', '/books')

export default function Page() {
  return <PublicPage specKey="books" />
}
