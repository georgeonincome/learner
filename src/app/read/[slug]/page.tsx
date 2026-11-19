import Link from 'next/link'
import { getBook } from '@/lib/catalog'
import { CheckoutButton, EnrollFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

/** Book reader — renders the book's real chapters from src/content/books.json. */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = getBook(slug)
  return {
    title: book ? `${book.title} — ${book.author}` : 'Book',
    description: book?.description || 'Read online.',
  }
}

/**
 * Book reader — renders the book's real chapters from src/content/books.json.
 * The first `preview_chapters` are readable; the rest sit behind purchase.
 */
export default async function ReadBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = getBook(slug)

  if (!book) {
    return (
      <AppSurface><main className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading font-bold text-2xl mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Book not found
          </h1>
          <Link href="/books" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
            ← Browse books
          </Link>
        </div>
      </main></AppSurface>
    )
  }

  const preview = Math.max(0, Math.min(book.preview_chapters, book.chapters.length))
  const readable = book.is_free ? book.chapters : book.chapters.slice(0, preview)
  const locked = book.chapters.length - readable.length
  const free = book.is_free || book.price === 0

  return (
    <AppSurface><main className="py-10 md:py-16 px-2 sm:px-4">
      <div className="mx-auto max-w-3xl">
        <Link href="/books" className="no-underline text-sm text-text-secondary hover:text-primary">
          ← All books
        </Link>

        <header className="mt-4 mb-8">
          <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>
            {book.format} · {book.author}
          </p>
          <h1 className="font-heading font-bold mb-2" style={{ fontSize: '26px', color: 'var(--color-text-primary)' }}>
            {book.title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {book.description}
          </p>
        </header>

        {readable.length === 0 ? (
          <div className="rounded-xl border p-6 text-center" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
              This book is available for {book.currency} {book.price.toFixed(2)}.
            </p>
            <CheckoutButton
              label={`Get the book — ${book.currency} ${book.price.toFixed(2)}`}
              lineItems={[
                {
                  price_data: {
                    currency: book.currency.toLowerCase(),
                    unit_amount: Math.round(book.price * 100),
                    product_data: { name: book.title },
                  },
                  quantity: 1,
                },
              ]}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {readable.map((chapter, i) => (
              <section
                key={chapter.title}
                className="rounded-xl border p-5"
                style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}
              >
                <h2 className="font-heading font-bold mb-3" style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
                  Chapter {i + 1}: {chapter.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {chapter.body}
                </p>
              </section>
            ))}

            {locked > 0 ? (
              <section
                className="rounded-xl border p-6 text-center"
                style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface-elevated)' }}
              >
                <h2 className="font-heading font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {locked} more chapter{locked === 1 ? '' : 's'} in the full book
                </h2>
                <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
                  {book.currency} {book.price.toFixed(2)} · {book.pages} pages · {book.format}
                </p>
                <CheckoutButton
                  className="max-w-xs mx-auto"
                  label={`Buy the full book — ${book.currency} ${book.price.toFixed(2)}`}
                  lineItems={[
                    {
                      price_data: {
                        currency: book.currency.toLowerCase(),
                        unit_amount: Math.round(book.price * 100),
                        product_data: { name: book.title },
                      },
                      quantity: 1,
                    },
                  ]}
                />
              </section>
            ) : null}
          </div>
        )}
      </div>
    </main></AppSurface>
  )
}
