import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('appointment', 'Book an Appointment – Schedule Your Session Online')

export default function Page() {
  return <PublicPage specKey="appointment" />
}
