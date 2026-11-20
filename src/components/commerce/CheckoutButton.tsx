'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const btnCls = 'w-full rounded-[10px] bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] disabled:opacity-60 text-[var(--color-cta-text)] font-semibold text-sm px-5 py-3 transition-colors cursor-pointer'

/**
 * Server-priced checkout button (M7). Sends only the item identity; the server
 * resolves the amount from the prices table and creates the Stripe session.
 */
export function CheckoutButton({
  entityType,
  entityId,
  currency,
  label = 'Pay now',
  className = '',
}: {
  entityType: 'course' | 'book' | 'program' | 'membership' | 'product'
  entityId: number
  currency?: string
  label?: string
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function pay() {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId, currency }),
      })
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !json.url) {
        setError(json.error || 'Could not start checkout. Please sign in and try again.')
        setLoading(false)
        return
      }
      window.location.assign(json.url)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <button type="button" onClick={pay} disabled={loading} className={btnCls}>
        {loading ? 'Redirecting…' : label}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm text-[var(--color-danger)]">{error}</p> : null}
    </div>
  )
}

/** Free products skip payment and enrol immediately (verified session required). */
export function EnrollFreeButton({ courseId, label = 'Enrol free', className = '' }: { courseId: string; label?: string; className?: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function enroll() {
    if (state === 'sending') return
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setState('error')
        setError(json.error || 'Could not enrol. Please sign in and verify your email.')
        return
      }
      setState('done')
      router.push('/dashboard')
    } catch {
      setState('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className={className}>
      <button type="button" onClick={enroll} disabled={state === 'sending'} className={btnCls}>
        {state === 'sending' ? 'Enrolling…' : label}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm text-[var(--color-danger)]">{error}</p> : null}
    </div>
  )
}

/** Claim a free book/product (no Stripe step). */
export function ClaimFreeButton({ entityType, entityId, label = 'Get it — free', className = '' }: { entityType: 'book' | 'product'; entityId: number; label?: string; className?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function claim() {
    if (loading) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/access/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) { setError(json.error || 'Could not claim. Sign in and verify your email.'); setLoading(false); return }
      router.push('/dashboard')
    } catch { setError('Network error. Please try again.'); setLoading(false) }
  }
  return (
    <div className={className}>
      <button type="button" onClick={claim} disabled={loading} className={btnCls}>{loading ? 'Adding…' : label}</button>
      {error ? <p role="alert" className="mt-2 text-sm text-[var(--color-danger)]">{error}</p> : null}
    </div>
  )
}
