import Link from 'next/link'
import { query } from '@/lib/turso'
import { WebinarRegistrationForm } from '@/components/forms/WebinarRegistrationForm'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Webinars — Lena Learning' }

export default async function WebinarsPage() {
  const webinars = await query<{ id: number; title: string; description: string; slug: string }>(
    "SELECT id, title, description, slug FROM webinars WHERE status = 'published' ORDER BY id LIMIT 10",
  ).catch(() => [])

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">Webinars</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl mb-6 text-[var(--color-text-primary)]">Upcoming webinars</h1>
          <div className="space-y-6">
            {webinars.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No webinars are scheduled right now.</p>
            ) : webinars.map((w) => (
              <div key={w.id} className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6">
                <h2 className="font-heading font-bold text-lg mb-1 text-[var(--color-text-primary)]">{w.title}</h2>
                <p className="text-sm mb-4 text-[var(--color-text-secondary)]">{w.description}</p>
                <WebinarRegistrationForm webinarId={String(w.id)} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
