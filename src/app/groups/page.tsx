import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('groups', '/groups')

export default function Page() {
  return <PublicPage specKey="groups" />
}
