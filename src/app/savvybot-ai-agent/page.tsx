import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { ChatPanel } from '@/components/ai/ChatPanel'

export const metadata = pageMeta('savvybot-ai-agent', 'Lena AI assistant')

export default function Page() {
  return (
    <TemplatePage slug="savvybot-ai-agent">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="mb-2 font-heading text-2xl font-bold text-[var(--color-text-primary)]">Ask the assistant</h1>
        <p className="mb-8 text-sm text-[var(--color-text-secondary)]">Get help choosing a course or planning your next step.</p>
        <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5">
          <ChatPanel />
        </div>
      </div>
    </TemplatePage>
  )
}
