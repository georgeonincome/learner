import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { ChatPanel } from '@/components/ai/ChatPanel'

export const metadata = {
  title: 'Chatbot Test Page — SavvyPro',
  description: 'Test the SavvyPro AI assistant.',
}

export default function ChatbotTestPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[900px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary">
            Chatbot Test Page
          </h1>
          <Link href="/savvybot-ai-agent" className="no-underline text-primary text-sm font-medium">
            About the assistant →
          </Link>
        </div>
        <Card className="p-6">
          <ChatPanel />
        </Card>
      </div>
    </div>
  )
}
