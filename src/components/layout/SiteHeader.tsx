'use client'

import { useEffect, useState } from 'react'
import { Header } from './Header'

/**
 * The reference header is a client component on the source site (it reacts to the
 * session and the mobile menu). This wrapper resolves the session from our own
 * /api/auth/me endpoint and hands it to the reproduced header.
 */
export function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive) return
        setUser(data ? { name: data.name, email: data.email } : null)
      })
      .catch(() => {})
      .finally(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])

  return <Header user={ready ? user : null} cartCount={cartCount} />
}
