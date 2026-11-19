import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('home', 'Savvypro')

export default function Page() {
  return <PublicPage specKey="home" />
}
