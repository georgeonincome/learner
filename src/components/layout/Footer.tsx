import Link from 'next/link'
import brand from '@/lib/brand'

/** Lena footer (original copy; reference footer structure: brand line + links). */
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer data-layout-section className="bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] border-t border-[var(--color-border-card)]">
      <div className="mx-auto max-w-[1264px] px-4 sm:px-5 py-10">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-heading font-bold text-lg mb-2">{brand.name}</p>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md">
              {brand.tagline} Courses, books, coaching and a community that helps you ship real work.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-3">Explore</p>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              <li><Link className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]" href="/courses">Courses</Link></li>
              <li><Link className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]" href="/books">Books</Link></li>
              <li><Link className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]" href="/blog">Blog</Link></li>
              <li><Link className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]" href="/groups">Community</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-3">Support</p>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              <li><Link className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]" href="/contact-us">Contact us</Link></li>
              <li><Link className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]" href="/terms-and-conditions">Terms</Link></li>
              <li><Link className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]" href="/privacy-policy">Privacy</Link></li>
              <li><Link className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]" href="/refund-policy">Refunds</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-5 border-t border-[var(--color-border-card)] flex flex-wrap gap-3 justify-between text-xs text-[var(--color-text-muted)]">
          <p className="m-0">© {year} {brand.legalName}. All rights reserved.</p>
          <p className="m-0">
            <Link href="/login" className="no-underline text-[var(--color-primary-text)] hover:text-[var(--color-primary)]">Log in</Link>
            {' · '}
            <Link href="/signup" className="no-underline text-[var(--color-primary-text)] hover:text-[var(--color-primary)]">Create account</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
