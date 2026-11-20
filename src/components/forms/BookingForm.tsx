'use client'

import { useState } from 'react'

/** Slot picker + booking form wired to /api/appointments (audit F4). */
export function BookingForm({ staffId, serviceName }: { staffId: string; serviceName: string }) {
  const [startsAt, setStartsAt] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [icsUrl, setIcsUrl] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!startsAt) { setStatus('error'); setMessage('Choose a date and time.'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, startsAt: new Date(startsAt).toISOString(), durationMin: 30, reason }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Booking failed')
      setIcsUrl(json.icsUrl || '')
      setStatus('success')
      setMessage('Your session is booked. Check your email for details.')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Booking failed')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6">
        <p className="text-sm text-[var(--color-text-primary)] mb-3">{message}</p>
        {icsUrl ? <a href={icsUrl} download className="text-sm text-[var(--color-primary-text)] no-underline">Add to calendar (.ics) →</a> : null}
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg">
      <p className="text-sm text-[var(--color-text-secondary)]">{serviceName} · 30 minute session</p>
      <div>
        <label htmlFor="startsAt" className="block text-xs font-medium mb-1 text-[var(--color-text-secondary)]">Date and time</label>
        <input id="startsAt" type="datetime-local" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)]" />
      </div>
      <div>
        <label htmlFor="reason" className="block text-xs font-medium mb-1 text-[var(--color-text-secondary)]">What would you like to cover?</label>
        <textarea id="reason" rows={4} value={reason} onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)]" />
      </div>
      <button type="submit" disabled={status === 'loading'}
        className="rounded-[10px] bg-[var(--color-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cta-text)] disabled:opacity-60">
        {status === 'loading' ? 'Booking…' : 'Book session'}
      </button>
      {status === 'error' ? <p role="alert" className="text-sm text-[var(--color-danger)]">{message}</p> : null}
    </form>
  )
}
