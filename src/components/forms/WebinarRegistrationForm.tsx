'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export function WebinarRegistrationForm({ webinarId }: { webinarId: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')
  const [icsUrl, setIcsUrl] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/webinars/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webinarId, name, email }),
      })
      const data = (await res.json()) as { error?: string; icsUrl?: string }
      if (!res.ok) throw new Error(data.error ?? 'Registration failed')
      setIcsUrl(data.icsUrl ?? '')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <Alert variant="success" title="You're registered!">
        <p>Check your inbox for details. Add the event to your calendar:</p>
        {icsUrl && (
          <a href={icsUrl} download className="inline-block mt-2 text-primary font-medium no-underline">
            Download calendar (.ics) →
          </a>
        )}
      </Alert>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <Input
        label="Full name"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
        {status === 'loading' ? 'Registering…' : 'Register for the webinar'}
      </Button>
    </form>
  )
}
