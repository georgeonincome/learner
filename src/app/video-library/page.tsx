import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('video-library', '/video-library')

export default function Page() {
  return <PublicPage specKey="video-library" />
}
