'use client'

import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Starting a Business', href: '/getting-started-page' },
  { label: 'Learn Digital Skills', href: '/learn-digital-skills' },
  { label: 'Grow My Business', href: '/grow-my-business' },
  { label: 'Build Your Expert Business', href: '/build-your-expert-business' },
  { label: 'Business Solutions', href: '/business-solutions' },
  { label: 'Books', href: '/books' },
  { label: 'Contact Us', href: '/contact-us' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header
      className="fixed left-0 top-0 z-20 w-full border-b border-border-light shadow-sm backdrop-blur-sm backdrop-saturate-150 transition-all duration-300"
      style={{
        backgroundColor: 'rgba(9, 14, 33, 0.9)',
        height: '75px',
      }}
    >
      <div className="mx-auto px-2.5 sm:px-5 flex items-center justify-between gap-1.5 w-full" style={{ height: '75px' }}>
        <Link href="/" className="flex h-full max-w-24 sm:max-w-40 items-center justify-center flex-col min-[440px]:max-w-32 no-underline">
          <img src="/logo.png" alt="Logo" className="img-fluid" style={{ width: 'auto', height: '100%', objectFit: 'contain' }} />
        </Link>

        <nav className="flex-1 flex justify-center">
          <ul className="flex gap-4 list-none m-0 p-0 items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className={clsx(
                      'cursor-pointer text-base font-heading',
                      isActive
                        ? 'font-semibold text-primary'
                        : 'font-medium text-muted hover:text-primary',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/signup" className="no-underline">
            <Button variant="secondary" size="md">Sign up</Button>
          </Link>
          <Link href="/login" className="no-underline">
            <Button variant="outline" size="md">Login</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
