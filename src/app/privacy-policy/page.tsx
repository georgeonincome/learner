import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('privacy-policy', 'Privacy Policy')

export default function Page() {
  return <PublicPage specKey="privacy-policy" />
}
