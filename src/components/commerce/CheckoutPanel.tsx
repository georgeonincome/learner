'use client'

import { useState } from 'react'

interface PriceOption { currency: string; price: number; priceType: string; interval: string | null }

/** Reference-shaped checkout controls: currency selector, coupon, secure pay. */
export function CheckoutPanel({ entityType, entityId, prices, title }: {
  entityType: 'course' | 'book' | 'program' | 'membership' | 'product'
  entityId: number
  prices: PriceOption[]
  title: string
}) {
  const [currency, setCurrency] = useState(prices.find((p) => p.price > 0)?.currency ?? 'USD')
  const [coupon, setCoupon] = useState('')
  const [couponState, setCouponState] = useState<{ valid: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const selected = prices.find((p) => p.currency === currency) ?? prices[0]

  async function checkCoupon() {
    if (!coupon.trim()) return
    const res = await fetch('/api/coupons/validate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: coupon }),
    })
    const json = await res.json().catch(() => ({}))
    setCouponState({ valid: res.ok, message: res.ok ? `Coupon ${json.code} applied` : json.error || 'Invalid coupon' })
  }

  async function pay() {
    if (loading) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId, currency, couponCode: coupon.trim() || undefined }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.url) { setError(json.error || 'Could not start checkout'); setLoading(false); return }
      window.location.assign(json.url)
    } catch { setError('Network error. Please try again.'); setLoading(false) }
  }

  return (
    <div className="space-y-5">
      {prices.length > 1 ? (
        <div>
          <label htmlFor="currency" className="block text-xs font-medium mb-1 text-[var(--color-text-secondary)]">Currency</label>
          <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)]">
            {prices.map((p) => <option key={p.currency} value={p.currency}>{p.currency} — {p.price.toFixed(2)}</option>)}
          </select>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code"
          className="flex-1 rounded-lg border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)]" />
        <button type="button" onClick={checkCoupon} className="rounded-lg border border-[var(--color-border-card)] px-3 py-2 text-sm text-[var(--color-text-primary)]">Apply</button>
      </div>
      {couponState ? <p role="status" className={`text-xs ${couponState.valid ? 'text-[var(--color-primary-text)]' : 'text-[var(--color-danger)]'}`}>{couponState.message}</p> : null}

      <button type="button" onClick={pay} disabled={loading}
        className="w-full rounded-[10px] bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-[var(--color-cta-text)] font-semibold px-5 py-3 text-sm disabled:opacity-60">
        {loading ? 'Redirecting…' : `Pay ${selected?.currency ?? currency} ${Number(selected?.price ?? 0).toFixed(2)} — ${title}`}
      </button>
      {error ? <p role="alert" className="text-sm text-[var(--color-danger)]">{error}</p> : null}
      <p className="text-xs text-center text-[var(--color-text-muted)]">Secure payment by Stripe. Access is granted automatically.</p>
    </div>
  )
}
