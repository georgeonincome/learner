import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('mini-courses', '/mini-courses')

export default function Page() {
  return <PublicPage specKey="mini-courses" />
}
