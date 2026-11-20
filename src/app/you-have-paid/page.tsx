import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams
  if (!ref) return { title: 'Payment complete — Lena Learning', description: 'Your order has been received.' }
  const label = ref.replace(/[-_]/g, ' ')
  return {
    title: `Payment complete — ${label}`,
    description: `Your ${label} payment has been received. View your Lena order summary.`,
    robots: { index: false },
  }
}

interface Order {
  id: string; status: string; total: number; currency: string
  entity_type: string | null; entity_id: number | null; created_at: string
}

/** Real post-payment summary: never trusts query params for ownership. */
export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ session_id?: string; ref?: string }> }) {
  const sp = await searchParams
  const { session_id } = sp
  const uid = await getCurrentUserId()
  if (!uid) {
    const suffix = sp.ref ? `?ref=${encodeURIComponent(sp.ref)}` : ''
    redirect(`/signin?callbackUrl=/you-have-paid${encodeURIComponent(suffix)}`)
  }

  let order: Order | null = null
  if (session_id) {
    const rows = await query<Order>(
      `SELECT id, status, total, currency, entity_type, entity_id, created_at
         FROM orders WHERE stripe_session_id = ? AND auth_user_id = ? LIMIT 1`, [session_id, uid],
    )
    order = rows[0] ?? null
  }
  if (!order) {
    const rows = await query<Order>(
      `SELECT id, status, total, currency, entity_type, entity_id, created_at
         FROM orders WHERE auth_user_id = ? ORDER BY created_at DESC LIMIT 1`, [uid],
    )
    order = rows[0] ?? null
  }

  return (
    <AppSurface>
      <main className="py-16 px-4">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-text)] mb-2">
              {order?.status === 'paid' ? 'Payment confirmed' : 'Order received'}
            </p>
            <h1 className="font-heading font-bold text-2xl mb-4 text-[var(--color-text-primary)]">Thank you</h1>
            {order ? (
              <div className="text-sm text-left rounded-xl bg-[var(--color-bg-surface-elevated)] p-4 mb-6 space-y-1">
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Order</span><span className="text-[var(--color-text-primary)] font-medium">{order.id}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Item</span><span className="text-[var(--color-text-primary)]">{order.entity_type} #{order.entity_id}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Amount</span><span className="text-[var(--color-text-primary)] font-semibold">{order.currency.toUpperCase()} {(order.total / 100).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Status</span><span className="text-[var(--color-text-primary)] capitalize">{order.status}</span></div>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">We could not find an order for this session. If you just paid, refresh in a moment.</p>
            )}
            <p className="text-xs text-[var(--color-text-muted)] mb-6">A receipt has been sent to your email address.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard" className="no-underline rounded-[10px] bg-[var(--color-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cta-text)]">Go to dashboard</Link>
              <Link href="/dashboard/orders" className="no-underline rounded-[10px] border border-[var(--color-border-card)] px-5 py-2.5 text-sm text-[var(--color-text-primary)]">View orders</Link>
            </div>
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
