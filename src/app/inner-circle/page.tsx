import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('inner-circle', '/inner-circle')

export default function Page() {
  return <PublicPage specKey="inner-circle" />
}
