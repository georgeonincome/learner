import Link from 'next/link'
import { getCourse, getBook, getProgram, getPrices } from '@/lib/content'
import { CheckoutPanel } from '@/components/commerce/CheckoutPanel'
import { EnrollFreeButton, ClaimFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

type Query = { product_id?: string; product_type?: string; course?: string; book?: string }

/**
 * Checkout (M7). Accepts the reference shape (?product_id=&product_type=) as
 * well as short aliases. The displayed amount is read from the DB `prices`
 * table; the charge is always resolved again server-side at /api/checkout/session.
 */
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Query> }) {
  const q = await searchParams
  const productType = q.product_type ?? (q.course ? 'course' : q.book ? 'book' : '')
  const ref = q.product_id ?? q.course ?? q.book ?? ''

  let item: { id: number; title: string; slug?: string; description?: string } | null = null
  if (ref) {
    if (productType === 'course') {
      const c = await getCourse(ref)
      if (c) item = { id: c.id, title: c.title, slug: c.slug, description: c.short_description }
    } else if (productType === 'book') {
      const b = await getBook(ref)
      if (b) item = { id: b.id, title: b.title, slug: b.slug, description: b.description }
    } else if (productType === 'program') {
      const p = await getProgram(ref)
      if (p) item = { id: Number(p.id), title: p.title, slug: p.slug }
    }
  }

  if (!item) {
    return (
      <AppSurface><main className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading font-bold text-2xl mb-3 text-[var(--color-text-primary)]">Nothing to check out</h1>
          <p className="text-sm mb-6 text-[var(--color-text-secondary)]">Choose a course or book to continue.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/courses" className="no-underline text-sm text-[var(--color-primary-text)]">Browse courses</Link>
            <Link href="/books" className="no-underline text-sm text-[var(--color-primary-text)]">Browse books</Link>
          </div>
        </div>
      </main></AppSurface>
    )
  }

  const entityType = productType as 'course' | 'book' | 'program'
  const prices = (await getPrices(entityType, item.id)).map((p) => ({
    currency: p.currency, price: Number(p.price), priceType: p.price_type, interval: p.interval,
  }))
  const defaultPrice = prices.find((p) => p.price > 0) ?? prices[0]
  const amount = Number(defaultPrice?.price ?? 0)
  const free = !defaultPrice || amount <= 0 || defaultPrice.priceType === 'FREE'
  const back = entityType === 'course' ? `/course-detail/${item.slug}/${item.id}` : '/books'

  return (
    <AppSurface><main className="py-10 md:py-16 px-2 sm:px-4">
      <div className="mx-auto max-w-2xl">
        <Link href={back} className="no-underline text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]">← Back to {entityType}</Link>
        <h1 className="font-heading font-bold mt-4 mb-6 text-2xl text-[var(--color-text-primary)]">Checkout</h1>
        <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 mb-6">
          <p className="text-xs uppercase tracking-wide mb-1 text-[var(--color-text-muted)]">{entityType}</p>
          <h2 className="font-heading font-bold text-lg text-[var(--color-text-primary)]">{item.title}</h2>
          {item.description ? <p className="text-sm mt-1 text-[var(--color-text-secondary)]">{item.description}</p> : null}
          <p className="font-heading font-bold text-xl mt-3 text-[var(--color-text-primary)]">
            {free ? 'Free' : `${defaultPrice?.currency ?? 'USD'} ${amount.toFixed(2)}`}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5">
          {free ? (
            entityType === 'course'
              ? <EnrollFreeButton courseId={String(item.id)} label="Enrol now — free" />
              : <ClaimFreeButton entityType="book" entityId={item.id} label="Add to library — free" />
          ) : (
            <CheckoutPanel entityType={entityType} entityId={item.id} prices={prices} title={item.title} />
          )}
        </div>
      </div>
    </main></AppSurface>
  )
}
