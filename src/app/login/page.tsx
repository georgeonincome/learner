import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('login', '/login')

export default function Page() {
  return <PublicPage specKey="login" />
}
