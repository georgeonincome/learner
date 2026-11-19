import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('chatbot-test-page', '/chatbot-test-page')

export default function Page() {
  return <PublicPage specKey="chatbot-test-page" />
}
