import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('freebies', '/freebies')

export default function Page() {
  return <PublicPage specKey="freebies" />
}
