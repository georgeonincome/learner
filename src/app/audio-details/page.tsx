import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const metadata = pageMeta('audio-details', '/audio-details')

export default function Page() {
  return <TemplatePage slug="audio-details" />
}
