import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('signup', '/signup')

export default function Page() {
  return <PublicPage specKey="signup" />
}
