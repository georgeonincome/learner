import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My memberships — Lena Learning' }

export default async function MembershipsPage() {
  const uid = await getCurrentUserId()
  if (!uid) redirect('/signin?callbackUrl=/dashboard/memberships')
  const memberships = await query<{
    id: string; tier: string; status: string; starts_at: string; ends_at: string; auto_renew: number
  }>(
    `SELECT id, tier, status, starts_at, ends_at, auto_renew FROM memberships
       WHERE auth_user_id = ? ORDER BY starts_at DESC`, [uid],
  )

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">Memberships</span>
          </nav>
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading font-bold text-2xl text-[var(--color-text-primary)]">My memberships</h1>
            <Link href="/membership" className="no-underline text-sm text-[var(--color-primary-text)]">View tiers</Link>
          </div>
          {memberships.length === 0 ? (
            <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-10 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">You do not have an active membership.</p>
              <Link href="/membership" className="no-underline inline-block mt-4 text-sm text-[var(--color-primary-text)]">Explore membership</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {memberships.map((m) => (
                <div key={m.id} className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{m.tier}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Valid until {new Date(m.ends_at).toLocaleDateString()} · {m.auto_renew ? 'Auto-renewing' : 'No auto-renew'}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-bg-surface-elevated)] text-[var(--color-primary-text)] capitalize">{m.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AppSurface>
  )
}
