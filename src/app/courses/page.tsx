import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('courses', '/courses')

export default function Page() {
  return <PublicPage specKey="courses" />
}
