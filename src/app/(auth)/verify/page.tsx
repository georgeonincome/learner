'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { verifyEmailCode, getIdToken } from '@/lib/auth-client'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageInner />
    </Suspense>
  )
}

function VerifyPageInner() {
  const searchParams = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!oobCode) {
      setStatus('error')
      setMessage('Verification link is missing the confirmation code.')
      return
    }
    const run = async () => {
      try {
        await verifyEmailCode(oobCode!)
        setStatus('success')
        setMessage('Email verified successfully. You are now signed in.')
        const idToken = await getIdToken()
        if (idToken) {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          })
        }
      } catch (err) {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Verification failed')
      }
    }
    run()
  }, [oobCode])

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero px-4 py-10">
      <Card className="w-full max-w-sm bg-surface border border-card rounded-xl shadow-sm p-6">
        {status === 'idle' ? (
          <>
            <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Verifying email...</h1>
            <p className="text-sm text-gray-text mb-6">Please wait while we verify your email address.</p>
          </>
        ) : status === 'success' ? (
          <>
            <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Verified!</h1>
            <Alert variant="success">{message}</Alert>
            <p className="mt-4 text-sm text-center">
              <Link href="/" className="text-primary hover:text-primary-hover font-medium">Go to home</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-heading font-bold text-xl mb-1 text-text-primary">Verification failed</h1>
            <Alert variant="error">{message}</Alert>
            <p className="mt-4 text-sm text-center">
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium">Sign in</Link>
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
