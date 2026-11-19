import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('contest', '/contest')

export default function Page() {
  return <PublicPage specKey="contest" />
}
