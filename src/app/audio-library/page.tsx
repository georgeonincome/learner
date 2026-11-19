import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('audio-library', '/audio-library')

export default function Page() {
  return <PublicPage specKey="audio-library" />
}
