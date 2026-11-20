'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

interface Item { id: string; product_type: string; product_id: number; quantity: number }

/** Guest/user cart wired to /api/cart (reference cart parity). */
export function CartPanel() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart', { cache: 'no-store' })
      const json = await res.json().catch(() => ({}))
      setItems(json.items ?? [])
    } catch { setError('Could not load your cart.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { void load() }, [load])

  async function remove(id: number) {
    await fetch(`/api/cart?productId=${id}`, { method: 'DELETE' })
    await load()
  }

  if (loading) return <p className="text-sm text-[var(--color-text-muted)]">Loading your cart…</p>
  if (error) return <p role="alert" className="text-sm text-[var(--color-danger)]">{error}</p>
  if (!items.length) {
    return (
      <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-10 text-center">
        <p className="text-sm text-[var(--color-text-muted)] mb-4">Your cart is empty.</p>
        <Link href="/courses" className="no-underline text-sm text-[var(--color-primary-text)]">Browse courses →</Link>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.id} className="flex items-center justify-between rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4">
          <div>
            <p className="text-sm font-medium capitalize text-[var(--color-text-primary)]">{i.product_type} #{i.product_id}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Quantity {i.quantity}</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/checkout?product_id=${i.product_id}&product_type=${i.product_type}`}
              className="no-underline text-sm text-[var(--color-primary-text)]">Checkout</Link>
            <button type="button" onClick={() => remove(i.product_id)} className="text-sm text-[var(--color-text-muted)] hover:underline">Remove</button>
          </div>
        </div>
      ))}
    </div>
  )
}
