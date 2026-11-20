import Link from 'next/link'
import { listSpaces } from '@/lib/community'
import { parseJson } from '@/lib/content'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Community — Lena Learning' }

export default async function CommunityIndexPage() {
  const spaces = await listSpaces()
  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-[1264px]">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">Community</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl mb-6 text-[var(--color-text-primary)]">Community spaces</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((s) => (
              <Link key={s.id} href={`/dashboard/community/${s.id}`} className="no-underline block rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 hover:border-[var(--color-primary)] transition-colors">
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1 capitalize">{s.access} group</p>
                <h2 className="font-heading font-bold text-base mb-1 text-[var(--color-text-primary)]">{s.name}</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">{s.tagline}</p>
                <p className="text-xs mt-3 text-[var(--color-text-muted)]">
                  {s.member_count} members · {parseJson<string[]>(s.channels, ['General']).length} channels
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
