import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My orders — Lena Learning' }

export default async function OrdersPage() {
  const uid = await getCurrentUserId()
  if (!uid) redirect('/signin?callbackUrl=/dashboard/orders')
  const orders = await query<{
    id: string; status: string; total: number; currency: string
    created_at: string; entity_type: string | null; entity_id: number | null
  }>(
    `SELECT id, status, total, currency, created_at, entity_type, entity_id
       FROM orders WHERE auth_user_id = ? ORDER BY created_at DESC LIMIT 100`, [uid],
  )

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">Orders</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl mb-6 text-[var(--color-text-primary)]">My orders</h1>
          {orders.length === 0 ? (
            <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-10 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">You have no orders yet.</p>
              <Link href="/courses" className="no-underline inline-block mt-4 text-sm text-[var(--color-primary-text)]">Browse courses</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{o.entity_type} #{o.entity_id}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{new Date(o.created_at).toLocaleString()} · {o.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{o.currency.toUpperCase()} {(o.total / 100).toFixed(2)}</p>
                    <p className="text-xs capitalize text-[var(--color-text-muted)]">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AppSurface>
  )
}
