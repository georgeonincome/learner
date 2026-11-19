import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('blog', '/blog')

export default function Page() {
  return <PublicPage specKey="blog" />
}
