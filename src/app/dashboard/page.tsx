import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/session'
import { listEnrollments, listProgress } from '@/lib/learning'
import { query } from '@/lib/turso'
import { getCourse, getCurriculum, listBooks } from '@/lib/content'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

/** Student dashboard — only this user's enrollments, progress and owned books. */
export default async function DashboardPage() {
  const uid = await getCurrentUserId()
  if (!uid) redirect('/signin?callbackUrl=/dashboard')
  const [enrollments, progress] = await Promise.all([listEnrollments(uid), listProgress(uid)])

  const cards = []
  for (const e of enrollments) {
    const course = await getCourse(e.course_id)
    if (!course) continue
    const curriculum = await getCurriculum(course.id)
    const lessons = curriculum.flatMap((c) => c.lessons)
    const ids = lessons.map((l) => String(l.id))
    const isDone = (id: string) => progress.some((p) => p.lesson_id === id && p.completed === 1)
    const done = ids.filter(isDone).length
    cards.push({
      id: e.id,
      course,
      total: ids.length,
      done,
      percent: ids.length ? Math.round((done / ids.length) * 100) : 0,
      continueId: lessons.find((l) => !isDone(String(l.id)))?.id ?? lessons[0]?.id,
    })
  }

  const [books, grants] = await Promise.all([
    listBooks(),
    query<{ entity_id: number }>("SELECT entity_id FROM access_grants WHERE auth_user_id = ? AND entity_type = 'book'", [uid]),
  ])
  const ownedIds = new Set(grants.map((g) => Number(g.entity_id)))
  const ownedBooks = []
  for (const book of books) {
    if (ownedIds.has(book.id) || book.access === 'free') ownedBooks.push(book)
  }

  const links = [
    { href: '/dashboard/certificates', label: 'Certificates' },
    { href: '/dashboard/orders', label: 'Orders' },
    { href: '/dashboard/memberships', label: 'Memberships' },
    { href: '/dashboard/library', label: 'My library' },
    { href: '/dashboard/community', label: 'Community' },
    { href: '/dashboard/ai', label: 'AI assistant' },
    { href: '/dashboard/appointments', label: 'Book a session' },
    { href: '/dashboard/webinars', label: 'Webinars' },
  ]

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-[1264px]">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
            <h1 className="font-heading font-bold text-2xl text-[var(--color-text-primary)]">My Dashboard</h1>
            <nav className="flex flex-wrap gap-3" aria-label="Account areas">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="no-underline text-sm text-[var(--color-primary-text)] hover:underline">{l.label}</Link>
              ))}
            </nav>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)]">
              <p className="text-sm text-[var(--color-text-secondary)]">You have not enrolled in any courses yet.</p>
              <div className="mt-4 flex gap-3 justify-center">
                <Link href="/courses" className="no-underline text-sm text-[var(--color-primary-text)]">Browse courses</Link>
                <Link href="/books" className="no-underline text-sm text-[var(--color-primary-text)]">Browse books</Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((c) => (
                <div key={c.id} className="flex flex-col h-full border rounded-xl p-4 border-[var(--color-border-card)] bg-[var(--color-bg-surface)]">
                  <h3 className="font-heading font-bold mb-1 text-base text-[var(--color-text-primary)]">{c.course.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-3">{c.course.category}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--color-text-secondary)]">Progress</span>
                      <span className="text-[var(--color-text-primary)]">{c.percent}%</span>
                    </div>
                    <div className="w-full rounded-full h-2 bg-[var(--color-bg-surface-elevated)]">
                      <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: `${c.percent}%` }} />
                    </div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-[var(--color-border-card)] flex items-center justify-between">
                    <Link href={c.continueId ? `/dashboard/course/${c.course.id}/lesson/${c.continueId}` : `/dashboard/course/${c.course.id}`}
                      className="no-underline text-sm text-[var(--color-primary-text)] font-medium">
                      {c.percent > 0 ? 'Resume learning' : 'Start learning'}
                    </Link>
                    <span className="text-xs text-[var(--color-text-muted)]">{c.done} / {c.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <section className="mt-12">
            <h2 className="font-heading font-bold mb-4 text-lg text-[var(--color-text-primary)]">My books</h2>
            {ownedBooks.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No books yet. Claim a free one from the <Link href="/books" className="text-[var(--color-primary-text)] no-underline">books page</Link>.</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {ownedBooks.map((b) => (
                  <div key={b.id} className="border rounded-xl p-4 border-[var(--color-border-card)] bg-[var(--color-bg-surface)]">
                    <h3 className="font-heading font-bold text-sm mb-1 text-[var(--color-text-primary)]">{b.title}</h3>
                    <p className="text-xs mb-3 text-[var(--color-text-muted)]">{b.format} · {b.pages} pages</p>
                    <Link href={`/read/${b.slug}`} className="no-underline text-sm text-[var(--color-primary-text)]">Read →</Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </AppSurface>
  )
}
