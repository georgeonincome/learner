import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
// Interim: real captured membership content (removes the ReferenceLanding stub).
// M7 replaces this with the CMS-driven tiers + purchase flow.
export const metadata = pageMeta('membership', 'Membership')

export default function Page() {
  return <TemplatePage slug="membership" />
}
