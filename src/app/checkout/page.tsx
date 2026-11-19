import Link from 'next/link'
import { getBook, getCourse, toMinorUnits } from '@/lib/catalog'
import { CheckoutButton, EnrollFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

/**
 * Checkout — resolves the product from ?course=<id|slug> or ?book=<id|slug> and
 * hands the user to Stripe (or enrols immediately for free products).
 */
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; book?: string; session_id?: string }>
}) {
  const { course, book } = await searchParams

  const courseItem = course ? getCourse(course) : null
  const bookItem = book ? getBook(book) : null
  const item = courseItem ?? bookItem

  if (!item) {
    return (
      <AppSurface><main className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading font-bold text-2xl mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Nothing to check out
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Use an enrol or buy button on a course or book page.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/courses" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
              Browse courses
            </Link>
            <Link href="/books" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
              Browse books
            </Link>
          </div>
        </div>
      </main></AppSurface>
    )
  }

  const isCourse = Boolean(courseItem)
  const price = item.price
  const currency = item.currency
  const name = item.title
  const free = price === 0

  return (
    <AppSurface><main className="py-10 md:py-16 px-2 sm:px-4">
      <div className="mx-auto max-w-2xl">
        <Link
          href={isCourse ? `/course-detail/${courseItem!.slug}/${courseItem!.id}` : `/books`}
          className="no-underline text-sm text-text-secondary hover:text-primary"
        >
          ← Back
        </Link>

        <h1
          className="font-heading font-bold mt-4 mb-6"
          style={{ fontSize: '24px', color: 'var(--color-text-primary)' }}
        >
          Checkout
        </h1>

        <div className="rounded-xl border p-5 mb-6" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>
                {isCourse ? 'Course' : 'Book'}
              </p>
              <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                {name}
              </h2>
              {'category' in item ? (
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.category}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-xl" style={{ color: 'var(--color-text-primary)' }}>
                {free ? 'Free' : `${currency} ${(price).toFixed(2)}`}
              </p>
              {'strike_through_price' in item && item.strike_through_price ? (
                <p className="text-xs line-through" style={{ color: 'var(--color-text-muted)' }}>
                  {currency} {item.strike_through_price.toFixed(2)}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {free ? (
          <EnrollFreeButton courseId={String('id' in item ? item.id : '')} label="Enrol now — free" />
        ) : (
          <CheckoutButton
            label={`Pay ${currency} ${price.toFixed(2)}`}
            lineItems={[
              {
                price_data: {
                  currency: currency.toLowerCase(),
                  unit_amount: toMinorUnits(price, currency),
                  product_data: { name },
                },
                quantity: 1,
              },
            ]}
          />
        )}

        <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Payment is processed by Stripe in test mode. You will be returned here after paying.
        </p>
      </div>
    </main></AppSurface>
  )
}
