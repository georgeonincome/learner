import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const metadata = pageMeta('terms-and-conditions', 'Terms & Conditions')

export default function Page() {
  return <TemplatePage slug="terms-and-conditions" />
}
