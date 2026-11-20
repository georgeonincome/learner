import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Footer } from '@/components/layout/Footer'
import { BRAND_NAME } from '@/lib/brand'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="__next-content" className="bg-[var(--color-bg-hero)] min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <p className="font-heading font-bold text-[var(--color-primary-text)] text-6xl mb-4">404</p>
          <h1 className="font-heading font-bold text-[var(--color-text-primary)] text-2xl mb-3">Page not found</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mb-8">
            The page you’re looking for doesn’t exist or has moved. Let’s get you back to learning.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="no-underline rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium px-5 py-2.5">Back to home</Link>
            <Link href="/courses" className="no-underline rounded-[8px] border border-[var(--color-border-card)] text-[var(--color-text-primary)] text-sm font-medium px-5 py-2.5 hover:border-[var(--color-primary)]">Browse courses</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
