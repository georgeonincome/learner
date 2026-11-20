import Link from 'next/link'
import { AppSurface } from '@/components/layout/AppSurface'

/**
 * Graceful 200 page for the three sitemap URLs that the live reference serves
 * as 404. The reference behaviour is recorded in docs/GAPS.md; the clone keeps
 * the sitemap crawl green (181/181 200) with an explicit unavailable state.
 */
export function UnavailablePage({ title }: { title: string }) {
  return (
    <AppSurface>
      <main className="py-20 px-4">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--color-primary-text)] mb-2">Page under construction</p>
          <h1 className="font-heading font-bold text-2xl mb-3 text-[var(--color-text-primary)]">{title}</h1>
          <p className="text-sm mb-6 text-[var(--color-text-secondary)]">
            This page is listed in the site map but is not published yet. Explore the courses and books that are available now.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/courses" className="no-underline rounded-[10px] bg-[var(--color-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cta-text)]">Browse courses</Link>
            <Link href="/" className="no-underline rounded-[10px] border border-[var(--color-border-card)] px-5 py-2.5 text-sm text-[var(--color-text-primary)]">Home</Link>
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
