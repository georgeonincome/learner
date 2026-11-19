import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('freelancers', '/freelancers')

export default function Page() {
  return <PublicPage specKey="freelancers" />
}
