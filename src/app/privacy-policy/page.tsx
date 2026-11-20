import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const metadata = pageMeta('privacy-policy', 'Privacy Policy')

export default function Page() {
  return <TemplatePage slug="privacy-policy" />
}
