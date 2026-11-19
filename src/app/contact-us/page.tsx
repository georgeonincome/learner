import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('contact-us', '/contact-us')

export default function Page() {
  return <PublicPage specKey="contact-us" />
}
