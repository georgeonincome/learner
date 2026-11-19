import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('free', '/free')

export default function Page() {
  return <PublicPage specKey="free" />
}
