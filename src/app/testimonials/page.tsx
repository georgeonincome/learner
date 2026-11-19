import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('testimonials', '/testimonials')

export default function Page() {
  return <PublicPage specKey="testimonials" />
}
