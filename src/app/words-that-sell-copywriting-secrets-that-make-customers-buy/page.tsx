import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
export const revalidate = 3600

export async function generateMetadata() {
  return pageMeta('words-that-sell-copywriting-secrets-that-make-customers-buy')
}

export default function Page() {
  return <TemplatePage slug="words-that-sell-copywriting-secrets-that-make-customers-buy" />
}
