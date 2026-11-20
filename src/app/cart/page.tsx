import Link from 'next/link'
import { CartPanel } from '@/components/commerce/CartPanel'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Your cart — Lena Learning', description: 'Review the items in your cart.' }

export default function CartPage() {
  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="no-underline text-[var(--color-text-secondary)]">Home</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">Cart</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl mb-6 text-[var(--color-text-primary)]">Your cart</h1>
          <CartPanel />
        </div>
      </main>
    </AppSurface>
  )
}
