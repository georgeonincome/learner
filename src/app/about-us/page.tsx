import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('about-us', '/about-us')

export default function Page() {
  return <PublicPage specKey="about-us" />
}
