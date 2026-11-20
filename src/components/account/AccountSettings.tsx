'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { changeEmail, changePassword, signOut } from '@/lib/auth-client'

interface Profile {
  full_name?: string; first_name?: string; last_name?: string; email?: string
  phone?: string; timezone?: string; role?: string
}

function Field({ label, type = 'text', value, onChange, placeholder, autoComplete }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm text-[var(--color-text-secondary)] mb-1.5">{label}</span>
      <input type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[8px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]" />
    </label>
  )
}

function Status({ msg }: { msg: { kind: 'ok' | 'err'; text: string } | null }) {
  if (!msg) return null
  return <p role="status" className={`text-sm mt-2 ${msg.kind === 'ok' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{msg.text}</p>
}

export function AccountSettings({ profile, email, emailVerified }: { profile: Profile | null; email: string; emailVerified: boolean }) {
  const router = useRouter()
  const [curPw, setCurPw] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [pwCur, setPwCur] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function doChangeEmail(e: React.FormEvent) {
    e.preventDefault(); setEmailMsg(null); setBusy(true)
    try {
      await changeEmail(curPw, newEmail)
      setEmailMsg({ kind: 'ok', text: 'Verification sent to the new address. Confirm it to finish the change.' })
      setNewEmail(''); setCurPw('')
    } catch (err) {
      setEmailMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Could not change email.' })
    } finally { setBusy(false) }
  }

  async function doChangePassword(e: React.FormEvent) {
    e.preventDefault(); setPwMsg(null)
    if (pwNew.length < 6) { setPwMsg({ kind: 'err', text: 'Password must be at least 6 characters.' }); return }
    if (pwNew !== pwConfirm) { setPwMsg({ kind: 'err', text: 'Passwords do not match.' }); return }
    setBusy(true)
    try {
      await changePassword(pwCur, pwNew)
      setPwMsg({ kind: 'ok', text: 'Password updated.' })
      setPwCur(''); setPwNew(''); setPwConfirm('')
    } catch (err) {
      setPwMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Could not change password.' })
    } finally { setBusy(false) }
  }

  async function doLogout() {
    await signOut()
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    router.push('/'); router.refresh()
  }

  const name = profile?.full_name || `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim() || email
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <section className="rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6">
        <h2 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-4">Profile</h2>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between gap-4"><dt className="text-[var(--color-text-muted)]">Name</dt><dd className="text-[var(--color-text-primary)]">{name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[var(--color-text-muted)]">Email</dt><dd className="text-[var(--color-text-primary)]">{email}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[var(--color-text-muted)]">Email verified</dt><dd className={emailVerified ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}>{emailVerified ? 'Yes' : 'Pending'}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[var(--color-text-muted)]">Role</dt><dd className="text-[var(--color-text-primary)] capitalize">{profile?.role ?? 'student'}</dd></div>
          {profile?.phone ? <div className="flex justify-between gap-4"><dt className="text-[var(--color-text-muted)]">Phone</dt><dd className="text-[var(--color-text-primary)]">{profile.phone}</dd></div> : null}
        </dl>
        <button onClick={doLogout} className="mt-6 rounded-[8px] border border-[var(--color-border-card)] text-[var(--color-text-primary)] text-sm font-medium px-5 py-2.5 hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] cursor-pointer">Log out</button>
      </section>

      <section className="rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6">
        <h2 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-4">Change email</h2>
        <form onSubmit={doChangeEmail}>
          <Field label="Current password" type="password" value={curPw} onChange={setCurPw} autoComplete="current-password" />
          <Field label="New email" type="email" value={newEmail} onChange={setNewEmail} autoComplete="email" />
          <button disabled={busy} type="submit" className="rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 cursor-pointer">Update email</button>
          <Status msg={emailMsg} />
        </form>
      </section>

      <section className="rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6 lg:col-span-2">
        <h2 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-4">Change password</h2>
        <form onSubmit={doChangePassword} className="grid gap-x-6 grid-cols-1 md:grid-cols-3">
          <Field label="Current password" type="password" value={pwCur} onChange={setPwCur} autoComplete="current-password" />
          <Field label="New password" type="password" value={pwNew} onChange={setPwNew} autoComplete="new-password" />
          <Field label="Confirm new password" type="password" value={pwConfirm} onChange={setPwConfirm} autoComplete="new-password" />
          <div className="md:col-span-3">
            <button disabled={busy} type="submit" className="rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 cursor-pointer">Update password</button>
            <Status msg={pwMsg} />
          </div>
        </form>
      </section>
    </div>
  )
}
