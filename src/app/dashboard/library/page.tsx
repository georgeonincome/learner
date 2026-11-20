import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/session'
import { query } from '@/lib/turso'
import { listBooks, parseJson } from '@/lib/content'
import { hasBookAccess } from '@/lib/access'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My Library — Lena Learning', description: 'Books and digital products you own.' }

/** Library: owned books (purchased, claimed or membership-accessible). */
export default async function LibraryPage() {
  const uid = await getCurrentUserId()
  if (!uid) redirect('/signin?callbackUrl=/dashboard/library')
  const [books, grants] = await Promise.all([
    listBooks(),
    query<{ entity_id: number }>("SELECT entity_id FROM access_grants WHERE auth_user_id = ? AND entity_type = 'book'", [uid]),
  ])
  const ownedIds = new Set(grants.map((g) => Number(g.entity_id)))
  const owned = []
  for (const book of books) {
    const access = await hasBookAccess(uid, book)
    if (access.allowed && (ownedIds.has(book.id) || book.access === 'free' || access.reason === 'membership')) {
      owned.push(book)
    }
  }

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-[1264px]">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">My library</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl mb-2 text-[var(--color-text-primary)]">My Library</h1>
          <p className="text-sm mb-8 text-[var(--color-text-secondary)]">Every book and digital product you have access to.</p>

          {owned.length === 0 ? (
            <div className="text-center py-20 rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)]">
              <p className="text-sm text-[var(--color-text-muted)] mb-4">Your library is empty. Claim a free book to get started.</p>
              <Link href="/books" className="no-underline inline-block rounded-[10px] bg-[var(--color-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cta-text)]">Browse books</Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {owned.map((book) => {
                const chapters = parseJson<{ title: string }[]>(book.chapters, [])
                return (
                  <Link key={book.id} href={`/read/${book.slug}`} className="no-underline block rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 hover:border-[var(--color-primary)] transition-colors">
                    <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1">{book.format}</p>
                    <h2 className="font-heading font-bold text-base mb-1 text-[var(--color-text-primary)]">{book.title}</h2>
                    <p className="text-xs text-[var(--color-text-secondary)]">{book.author} · {chapters.length} chapters</p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </AppSurface>
  )
}
