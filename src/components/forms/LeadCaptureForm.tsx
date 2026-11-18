'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export function LeadCaptureForm({
  endpoint,
  formType = 'mailing-list',
  slug,
  buttonLabel = 'Submit',
  showName = true,
  successMessage = 'Thanks! Your request has been received.',
}: {
  endpoint: '/api/forms/submit' | '/api/leads/claim'
  formType?: string
  slug?: string
  buttonLabel?: string
  showName?: boolean
  successMessage?: string
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const payload =
        endpoint === '/api/leads/claim'
          ? { email, slug }
          : { formType, name, email, message: '' }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
      setMessage(successMessage)
      setEmail('')
      setName('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return <Alert variant="success">{message}</Alert>
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      {showName && (
        <Input
          label="Name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {status === 'error' && <Alert variant="error">{message}</Alert>}
      <Button type="submit" variant="primary" size="md" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting…' : buttonLabel}
      </Button>
    </form>
  )
}
