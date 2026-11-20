import Link from 'next/link'
import { getCourse, getBook, getPrices } from '@/lib/content'
import { CheckoutButton, EnrollFreeButton, ClaimFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

/**
 * Checkout (M5/M7) — resolves ?course=<id|slug> or ?book=<id|slug> from Turso.
 * The amount is displayed from the DB `prices` row; the actual charge is always
 * resolved server-side by /api/checkout/session (the client never sends a price).
 */
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; book?: string }>
}) {
  const { course, book } = await searchParams
  const courseItem = course ? await getCourse(course) : null
  const bookItem = book ? await getBook(book) : null
  const kind = courseItem ? 'course' : bookItem ? 'book' : null
  const item = courseItem ?? bookItem
  const id = courseItem?.id ?? bookItem?.id
  const entityType = courseItem ? 'course' : 'book'
  const prices = id ? await getPrices(entityType, id) : []
  const defaultPrice = prices.find((p) => p.is_default) ?? prices[0]
  const price = defaultPrice ? Number(defaultPrice.price) : 0
  const currency = defaultPrice?.currency ?? 'USD'
  const free = !defaultPrice || price <= 0 || defaultPrice.price_type === 'FREE'

  if (!item || !kind || !id) {
    return (
      <AppSurface><main className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading font-bold text-2xl mb-3 text-[var(--color-text-primary)]">Nothing to check out</h1>
          <p className="text-sm mb-6 text-[var(--color-text-secondary)]">Use an enrol or buy button on a course or book page.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/courses" className="no-underline text-sm text-[var(--color-primary-text)] font-medium">Browse courses</Link>
            <Link href="/books" className="no-underline text-sm text-[var(--color-primary-text)] font-medium">Browse books</Link>
          </div>
        </div>
      </main></AppSurface>
    )
  }

  const title = item.title
  const category = 'category' in item ? item.category : ''

  return (
    <AppSurface><main className="py-10 md:py-16 px-2 sm:px-4">
      <div className="mx-auto max-w-2xl">
        <Link href={courseItem ? `/course-detail/${courseItem.slug}/${courseItem.id}` : '/books'} className="no-underline text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]">← Back</Link>
        <h1 className="font-heading font-bold mt-4 mb-6 text-[24px] text-[var(--color-text-primary)]">Checkout</h1>
        <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide mb-1 text-[var(--color-text-muted)]">{kind === 'course' ? 'Course' : 'Book'}</p>
              <h2 className="font-heading font-bold text-lg text-[var(--color-text-primary)]">{title}</h2>
              {category ? <p className="text-sm mt-1 text-[var(--color-text-secondary)]">{category}</p> : null}
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-xl text-[var(--color-text-primary)]">{free ? 'Free' : `${currency} ${price.toFixed(2)}`}</p>
              {defaultPrice?.strike_through ? <p className="text-xs line-through text-[var(--color-text-muted)]">{currency} {Number(defaultPrice.strike_through).toFixed(2)}</p> : null}
            </div>
          </div>
        </div>
        {free ? (
          kind === 'course'
            ? <EnrollFreeButton courseId={String(id)} label="Enrol now — free" />
            : <ClaimFreeButton entityType="book" entityId={id} label="Get this book — free" />
        ) : (
          <CheckoutButton entityType={entityType} entityId={id} currency={currency} label={`Pay ${currency} ${price.toFixed(2)}`} />
        )}
        <p className="mt-4 text-xs text-[var(--color-text-muted)]">Payment is processed by Stripe in test mode. Access is granted automatically after payment.</p>
      </div>
    </main></AppSurface>
  )
}
