import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const metadata = pageMeta('freelancer-connect', 'Freelancer Connect')

export default function Page() {
  return <TemplatePage slug="freelancer-connect" />
}
