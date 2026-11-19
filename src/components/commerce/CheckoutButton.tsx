'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Checkout submit button. Creates a Stripe checkout session for the resolved
 * line items and hands the user to the hosted payment page.
 */
export function CheckoutButton({
  lineItems,
  mode = 'payment',
  label = 'Pay now',
  className = '',
}: {
  lineItems: Array<Record<string, unknown>>
  mode?: 'payment' | 'subscription'
  label?: string
  className?: string
}) {
  const router = useRouter()
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
        body: JSON.stringify({ lineItems, mode }),
      })
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !json.url) {
        setError(json.error || 'Could not start checkout. Please try again.')
        setLoading(false)
        return
      }
      // Stripe hosts the payment page; the webhook completes the order.
      window.location.assign(json.url)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className="sc-a0aea947-0 dOqGpd _login_page_form_top_btn_link _sign_btn w-full"
      >
        {loading ? 'Redirecting…' : label}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm" style={{ color: '#dc3545' }}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** Free products skip the payment step and enroll immediately. */
export function EnrollFreeButton({ courseId, label = 'Enrol free', className = '' }: { courseId: string; label?: string; className?: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function enroll() {
    if (state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setState('error')
        setError(json.error || 'Could not enrol. Please sign in and try again.')
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
      <button
        type="button"
        onClick={enroll}
        disabled={state === 'sending'}
        className="sc-a0aea947-0 dOqGpd _login_page_form_top_btn_link _sign_btn w-full"
      >
        {state === 'sending' ? 'Enrolling…' : label}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm" style={{ color: '#dc3545' }}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
