import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBook, getPrices, parseJson, type BookChapter } from '@/lib/content'
import { getCurrentUserId } from '@/lib/session'
import { hasBookAccess } from '@/lib/access'
import { CheckoutButton, ClaimFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) return { title: 'Book not found' }
  return {
    title: book.seo_title || `${book.title} — ${book.author}`,
    description: book.seo_description || book.description,
    alternates: book.canonical ? { canonical: book.canonical } : undefined,
    robots: book.no_index ? { index: false } : undefined,
  }
}

/**
 * Book reader (M6). Preview chapters are public; full chapters + the protected
 * file download are gated by purchase (access_grants) or an active membership.
 */
export default async function ReadBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) notFound()

  const chapters = parseJson<BookChapter[]>(book.chapters, [])
  const uid = await getCurrentUserId()
  const access = await hasBookAccess(uid, book)
  const prices = await getPrices('book', book.id)
  const price = prices.find((p) => p.is_default) ?? prices[0]
  const amount = Number(price?.price ?? 0)
  const free = book.access === 'free' || amount <= 0 || price?.price_type === 'FREE'

  const preview = Math.max(0, Math.min(book.preview_chapters, chapters.length))
  const visible = access.allowed ? chapters : chapters.slice(0, preview)
  const locked = chapters.length - visible.length

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-3xl">
          <Link href="/books" className="no-underline text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]">← All books</Link>

          <header className="mt-4 mb-8">
            <p className="text-xs uppercase tracking-wide mb-1 text-[var(--color-text-muted)]">{book.format} · {book.author}</p>
            <h1 className="font-heading font-bold mb-2 text-[28px] text-[var(--color-text-primary)]">{book.title}</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">{book.description}</p>
          </header>

          {access.allowed && book.file_media_id ? (
            <div className="mb-8 rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 flex flex-wrap items-center gap-4">
              <p className="text-sm text-[var(--color-text-secondary)] flex-1">Your copy is ready — read online or download the {book.format} file.</p>
              <a href={`/api/media/file?mediaId=${encodeURIComponent(book.file_media_id)}&bookId=${book.id}&download=1`}
                className="no-underline inline-block rounded-[10px] bg-[var(--color-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cta-text)]">
                Download {book.format}
              </a>
            </div>
          ) : null}

          {!access.allowed ? (
            <div className="mb-8 rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] p-5 text-center">
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {locked > 0 ? `${locked} more chapter${locked === 1 ? '' : 's'} are in the full book.` : 'Get full access to this book.'}
              </p>
              {free ? (
                <ClaimFreeButton entityType="book" entityId={book.id} label="Add to my library — free" className="max-w-xs mx-auto" />
              ) : book.access === 'membership' ? (
                <Link href="/membership" className="no-underline inline-block rounded-[10px] bg-[var(--color-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cta-text)]">Join the membership to read</Link>
              ) : (
                <CheckoutButton entityType="book" entityId={book.id} currency={price?.currency}
                  label={`Get the book — ${price?.currency ?? 'USD'} ${amount.toFixed(2)}`} className="max-w-xs mx-auto" />
              )}
              {!uid ? <p className="text-xs text-[var(--color-text-muted)] mt-3">Sign in and verify your email to add it to your library.</p> : null}
            </div>
          ) : null}

          <div className="space-y-6">
            {visible.map((chapter, i) => (
              <section key={i} className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5">
                <h2 className="font-heading font-bold mb-3 text-lg text-[var(--color-text-primary)]">Chapter {i + 1}: {chapter.title}</h2>
                <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--color-text-secondary)]">{chapter.body}</p>
              </section>
            ))}
            {!visible.length ? <p className="text-sm text-[var(--color-text-muted)]">Preview chapters are being prepared.</p> : null}
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
