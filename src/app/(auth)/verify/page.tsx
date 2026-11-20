'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { verifyEmailCode, getIdToken, requestEmailVerification, getClientAuth } from '@/lib/auth-client'

export const dynamic = 'force-dynamic'

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-hero)] text-[var(--color-text-muted)]">Loading…</div>}>
      <VerifyPageInner />
    </Suspense>
  )
}

function VerifyPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const oobCode = searchParams.get('oobCode')
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'pending'>('verifying')
  const [message, setMessage] = useState('')
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (!oobCode) {
      // Post-signup landing: no code yet. Show "check your email" if signed in.
      const signedIn = Boolean(getClientAuth().currentUser)
      setStatus(signedIn ? 'pending' : 'error')
      setMessage(signedIn ? '' : 'Sign in to verify your email, or open the link we sent you.')
      return
    }
    const run = async () => {
      try {
        await verifyEmailCode(oobCode)
        // Force-refresh so the new email_verified claim lands in the session cookie.
        const user = getClientAuth().currentUser
        const idToken = user ? await user.getIdToken(true) : await getIdToken()
        if (idToken) {
          await fetch('/api/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) })
        }
        setStatus('success')
        setMessage('Your email is verified. Welcome to Lena!')
      } catch (err) {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Verification failed. The link may have expired.')
      }
    }
    run()
  }, [oobCode])

  async function resend() {
    try { await requestEmailVerification(); setResent(true) } catch { setResent(false) }
  }
  async function continueAfterVerify() {
    const user = getClientAuth().currentUser
    if (user) { await user.getIdToken(true); const t = await user.getIdToken(); await fetch('/api/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: t }) }) }
    router.push('/dashboard'); router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-hero)] px-4 py-10">
      <div className="w-full max-w-md rounded-[12px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-8">
        {status === 'verifying' && (
          <>
            <h1 className="font-heading font-bold text-xl text-[var(--color-text-primary)] mb-2">Verifying email…</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Please wait while we confirm your email address.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1 className="font-heading font-bold text-xl text-[var(--color-text-primary)] mb-2">Verified!</h1>
            <p className="text-sm text-[var(--color-success)] mb-6">{message}</p>
            <Link href="/dashboard" className="inline-block rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium px-5 py-2.5 no-underline">Go to dashboard</Link>
          </>
        )}
        {status === 'pending' && (
          <>
            <h1 className="font-heading font-bold text-xl text-[var(--color-text-primary)] mb-2">Check your email</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">We sent a verification link to your inbox. Click it to activate your account, then continue below.</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={continueAfterVerify} className="rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium px-5 py-2.5 cursor-pointer">I’ve verified — continue</button>
              <button onClick={resend} className="rounded-[8px] border border-[var(--color-border-card)] text-[var(--color-text-primary)] text-sm font-medium px-5 py-2.5 hover:border-[var(--color-primary)] cursor-pointer">{resent ? 'Sent ✓' : 'Resend email'}</button>
            </div>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="font-heading font-bold text-xl text-[var(--color-text-primary)] mb-2">Verification</h1>
            <p className="text-sm text-[var(--color-danger)] mb-6">{message}</p>
            <Link href="/login" className="inline-block rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium px-5 py-2.5 no-underline">Sign in</Link>
          </>
        )}
      </div>
    </div>
  )
}
