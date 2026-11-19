import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('signin', '/signin')

export default function Page() {
  return <PublicPage specKey="signin" />
}
