import Link from 'next/link'
import { getCurrentUserId } from '@/lib/session'
import { listEnrollments, listProgress, completionPercent } from '@/lib/learning'
import { getCourse, getCourseCurriculum, getBooks } from '@/lib/catalog'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

/**
 * Student dashboard — real enrollments and real progress from Turso (empty when
 * the database is not configured or the user has not enrolled).
 */
export default async function DashboardPage() {
  const uid = await getCurrentUserId()
  const [enrollments, progress] = await Promise.all([listEnrollments(uid), listProgress(uid)])
  const books = getBooks()

  type Card = {
    id: string
    course: NonNullable<ReturnType<typeof getCourse>>
    lessons: ReturnType<typeof getCourseCurriculum>
    percent: number
    done: number
    continueId: string | undefined
  }
  const cards: Card[] = []
  for (const e of enrollments) {
    const course = getCourse(e.course_id)
    if (!course) continue
    const lessons = getCourseCurriculum(course)
    const ids = lessons.map((l) => l.lessonId)
    const done = lessons.filter((l) =>
      progress.some((p) => p.lesson_id === l.lessonId && p.completed === 1),
    ).length
    cards.push({
      id: e.id,
      course,
      lessons,
      percent: completionPercent(progress, ids),
      done,
      continueId:
        lessons.find((l) => !progress.some((p) => p.lesson_id === l.lessonId && p.completed === 1))
          ?.lessonId ?? lessons[0]?.lessonId,
    })
  }

  return (
    <AppSurface><main>
      <div className="py-10 md:py-16 px-2 sm:px-2">
        <div className="mx-auto max-w-[1264px]">
          <div className="flex justify-between items-center mb-8">
            <h1
              className="font-heading font-bold"
              style={{ fontSize: '24px', color: 'var(--color-text-primary)' }}
            >
              My Dashboard
            </h1>
            <Link
              href="/dashboard/certificates"
              className="no-underline text-sm text-primary hover:text-primary-hover font-medium"
            >
              My Certificates →
            </Link>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted">You have not enrolled in any courses yet.</p>
              <div className="mt-4 flex gap-3 justify-center">
                <Link href="/courses" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
                  Browse courses
                </Link>
                <Link href="/books" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
                  Browse books
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((c) => (
                <div key={c.id} className="flex flex-col h-full border rounded-xl p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
                  <h3 className="font-heading font-bold mb-1" style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                    {c.course.title}
                  </h3>
                  <p className="text-text-muted text-sm mb-3">{c.course.category}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">Progress</span>
                      <span className="text-text-primary">{c.percent}%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ background: 'var(--color-bg-surface-elevated)' }}>
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${c.percent}%` }} />
                    </div>
                  </div>
                  <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border-card)' }}>
                    <Link href={`/dashboard/course/${c.course.id}`} className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
                      Resume learning
                    </Link>
                    <span className="text-xs text-text-muted">
                      {c.done} / {c.lessons.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <section className="mt-12">
            <h2
              className="font-heading font-bold mb-4"
              style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}
            >
              My books
            </h2>
            {books.length === 0 ? (
              <p className="text-text-muted text-sm">No books yet.</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {books.map((b) => (
                  <div key={b.id} className="border rounded-xl p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
                    <h3 className="font-heading font-bold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      {b.title}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                      {b.format} · {b.pages} pages
                    </p>
                    <Link href={`/read/${b.slug}`} className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
                      Read
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main></AppSurface>
  )
}
