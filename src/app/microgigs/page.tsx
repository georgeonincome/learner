import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('microgigs', '/microgigs')

export default function Page() {
  return <PublicPage specKey="microgigs" />
}
