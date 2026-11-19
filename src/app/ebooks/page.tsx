import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('ebooks', '/ebooks')

export default function Page() {
  return <PublicPage specKey="ebooks" />
}
