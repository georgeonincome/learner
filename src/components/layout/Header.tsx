'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import brand from '@/content/brand.json'

/**
 * Original Lena navigation shell. Built only from Tailwind utilities and local
 * brand tokens — no captured markup, vendor class names or remote logo.
 */
const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Learn Digital Skills', href: '/learn-digital-skills' },
  { label: 'Private Lessons', href: '/learning-with-a-coach' },
  { label: 'Books', href: '/books' },
  { label: 'CMO Services', href: '/business-solutions' },
  { label: 'Contact Us', href: '/contact-us' },
]

const LINK = 'no-underline rounded-md px-2.5 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]'
const BTN = 'no-underline inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]'

export function Header({ user = null, cartCount = 0 }: {
  user?: { name?: string; email?: string } | null
  cartCount?: number
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
  const initial = (user?.name || user?.email || 'S').trim().charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border-card)] bg-[var(--color-bg-hero)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg-hero)]/80">
      <div className="mx-auto flex h-[75px] w-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 no-underline" aria-label={`${brand.name} home`}>
          <img src={brand.logo} alt="" className="h-9 w-auto" />
          <span className="font-heading text-base font-bold text-[var(--color-text-primary)]">{brand.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`${LINK} ${
                isActive(item.href)
                  ? 'bg-[var(--color-bg-surface-elevated)] font-semibold text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-elevated)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className={`${LINK} relative hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] sm:block`} aria-label={`Cart, ${cartCount} items`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-cta)] px-1 text-[10px] font-bold text-[var(--color-cta-text)]">{cartCount}</span>
            ) : null}
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className={`${BTN} hidden border-[var(--color-border-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-elevated)] sm:inline-flex`}>Dashboard</Link>
              <Link href="/user" aria-label="Account" className={`${BTN} border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-white)] hover:bg-[var(--color-primary-hover)]`}>{initial}</Link>
            </>
          ) : (
            <>
              <Link href="/login" className={`${BTN} hidden border-[var(--color-border-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-elevated)] sm:inline-flex`}>Login</Link>
              <Link href="/signup" className={`${BTN} border-[var(--color-cta)] bg-[var(--color-cta)] text-[var(--color-cta-text)] hover:bg-[var(--color-cta-hover)]`}>Sign up</Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border-card)] text-[var(--color-text-primary)] lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="border-t border-[var(--color-border-card)] bg-[var(--color-bg-surface)] px-4 py-3 lg:hidden">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`${LINK} block ${isActive(item.href) ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li><Link href="/cart" className={`${LINK} block text-[var(--color-text-secondary)]`}>Cart ({cartCount})</Link></li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
