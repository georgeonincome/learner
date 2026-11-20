import Link from 'next/link'
import { ChatPanel } from '@/components/ai/ChatPanel'
import { AppSurface } from '@/components/layout/AppSurface'

export const metadata = { title: 'AI assistant — Lena Learning', description: 'Ask questions about your learning.' }

export default function AiPage() {
  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-2xl">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">AI assistant</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl mb-2 text-[var(--color-text-primary)]">Ask the assistant</h1>
          <p className="text-sm mb-6 text-[var(--color-text-secondary)]">
            Get help choosing a course or planning your next step. Answers stream live.
          </p>
          <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5">
            <ChatPanel />
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
