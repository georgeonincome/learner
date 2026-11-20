import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

// Interim: real captured membership content (removes the ReferenceLanding stub).
// M7 replaces this with the CMS-driven tiers + purchase flow.
export const metadata = specMetadata('membership', 'Membership')

export default function Page() {
  return <PublicPage specKey="membership" />
}
