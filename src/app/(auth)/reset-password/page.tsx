'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { requestPasswordReset, resetPasswordConfirm } from '@/lib/auth-client'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageInner />
    </Suspense>
  )
}

function ResetPasswordPageInner() {
  const searchParams = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  const [mode, setMode] = useState<'request' | 'confirm' | 'success' | 'error'>(
    oobCode ? 'confirm' : 'request',
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setMode('success')
      setMessage('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    try {
      await resetPasswordConfirm(oobCode!, password)
      setMode('success')
      setMessage('Password reset successfully. You can now sign in.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero px-4 py-10">
      <Card className="w-full max-w-sm bg-surface border border-card rounded-xl shadow-sm p-6">
        {mode === 'request' ? (
          <>
            <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Reset your password</h1>
            <p className="text-sm text-gray-text mb-6">Enter your email and we'll send you a reset link.</p>
            {error && <Alert variant="error">{error}</Alert>}
            <form onSubmit={handleRequest} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
            <p className="mt-4 text-sm text-center text-text-secondary">
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium">Sign in</Link>
            </p>
          </>
        ) : mode === 'confirm' ? (
          <>
            <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Create new password</h1>
            <p className="text-sm text-gray-text mb-6">Enter your new password below.</p>
            {error && <Alert variant="error">{error}</Alert>}
            <form onSubmit={handleConfirm} className="space-y-4">
              <Input
                label="New password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset password'}
              </Button>
            </form>
          </>
        ) : mode === 'success' ? (
          <>
            <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Done!</h1>
            <Alert variant="success">{message}</Alert>
            <p className="mt-4 text-sm text-center">
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium">Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Error</h1>
            <Alert variant="error">{error || 'Something went wrong'}</Alert>
            <p className="mt-4 text-sm text-center">
              <Link href="/reset-password" className="text-primary hover:text-primary-hover font-medium">Try again</Link>
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
