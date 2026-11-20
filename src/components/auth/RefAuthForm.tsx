'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getIdToken, signIn, signUp } from '@/lib/auth-client'

/**
 * Auth forms — markup reproduced from the reference site's hydrated login and
 * signup pages (`captured-browser/login.html`, `captured-browser/signup.html`),
 * including the antd form classes and the `_login_page_form*` theme classes.
 * The reference renders these client-side, so the wiring below is our own.
 */

const COL = 'col-xl-12 col-lg-12 col-md-12 col-sm-12'

function Field({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
}: {
  id: string
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div className="_login_page_form_top">
      <label htmlFor={id} className="sc-a0aea947-0 dOqGpd _login_page_form_top_label">
        {label}
      </label>
      <div className="ant-form-item">
        <div className="ant-row ant-form-item-row">
          <div className="ant-col ant-form-item-control">
            <div className="ant-form-item-control-input">
              <div className="ant-form-item-control-input-content">
                <input
                  id={id}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  aria-required="true"
                  type={type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className={`ant-input _login_page_form_top_input${
                    type === 'password' ? ' ant-input-password' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {error ? (
        <p style={{ color: 'red' }} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function RefLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const callbackUrl =
    typeof window !== 'undefined'
      ? new URL(window.location.href).searchParams.get('callbackUrl') || '/'
      : '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
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
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="ant-form ant-form-horizontal _login_page_form" onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className={COL}>
          <Field id="email" label="Email" type="text" placeholder="Email" autoComplete="email" value={email} onChange={setEmail} />
        </div>
        <div className={COL}>
          <Field id="password" label="Password" type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={setPassword} />
          <div className="_login_page_form_top">
            <Link href="/reset-password" className="sc-a0aea947-0 dOqGpd">
              Forgot password ?
            </Link>
          </div>
        </div>
      </div>
      <div className="row">
        <div className={COL}>
          <div className="_login_page_form_top">
            <button
              type="submit"
              disabled={loading}
              className="sc-a0aea947-0 dOqGpd _login_page_form_top_btn_link _sign_btn"
            >
              {loading ? 'Signing in…' : 'Signin'}
            </button>
          </div>
        </div>
      </div>
      {error ? (
        <div className="row">
          <div className={COL}>
            <div className="_login_page_form_top">
              <span role="alert" className="_login_page_form_error">
                {error}
              </span>
            </div>
          </div>
        </div>
      ) : null}
      <div className="row">
        <div className={COL}>
          <div className="_login_page_form_top text-center">
            <Link href="/signup" className="sc-a0aea947-0 dOqGpd">
              You don&apos;t have an account?
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}

export function RefSignupForm() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password)
      const idToken = await getIdToken()
      if (idToken) {
        // Persist the captured names (audit B1) + sync displayName, then session.
        await fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, firstName: firstName.trim(), lastName: lastName.trim() }),
        }).catch(() => {})
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
      }
      // Reference requires a verified email before access (is_auth_require_verified_email=1).
      router.push('/verify')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="ant-form ant-form-horizontal _login_page_form" onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <Field id="first_name" label="First Name" placeholder="First Name" autoComplete="given-name" value={firstName} onChange={setFirstName} />
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <Field id="last_name" label="Last Name" placeholder="Last Name" autoComplete="family-name" value={lastName} onChange={setLastName} />
        </div>
        <div className={COL}>
          <Field id="email" label="Email" type="email" placeholder="Email" autoComplete="email" value={email} onChange={setEmail} />
        </div>
        <div className="col-md-12 col-sm-12">
          <Field id="password" label="Password" type="password" placeholder="Password" autoComplete="new-password" value={password} onChange={setPassword} error={error} />
        </div>
      </div>
      <div className="row">
        <div className={`${COL} _mar_b20`} />
      </div>
      <div className="row">
        <div className={COL}>
          <div className="_login_page_form_top">
            <button
              type="submit"
              disabled={loading}
              className="sc-a0aea947-0 dOqGpd _login_page_form_top_btn_link _sign_btn"
            >
              {loading ? 'Signing up…' : 'Signup'}
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className={COL}>
          <div className="_login_page_form_top text-center">
            <Link href="/login" className="sc-a0aea947-0 dOqGpd">
              Already have an account ?
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
