'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { signIn, getIdToken } from '@/lib/auth-client'

export default function Form() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const callbackUrl = typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('callbackUrl') || '/' : '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      // Exchange ID token for httpOnly session cookie
      const idToken = await getIdToken()
      if (idToken) {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
      }
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero px-4 py-10">
      <Card className="w-full max-w-sm bg-surface border border-card rounded-xl shadow-sm p-6">
        <h1 className="font-heading font-bold text-2xl mb-1 text-text-primary">Welcome back</h1>
        <p className="text-sm text-gray-text mb-6">Sign in to your account</p>

        {error && <Alert variant="error" title="Error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center text-text-secondary">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-primary-hover font-medium">
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-sm text-center text-text-secondary">
          <Link href="/reset-password" className="text-primary hover:text-primary-hover font-medium">
            Forgot your password?
          </Link>
        </p>
      </Card>
    </div>
  )
}
