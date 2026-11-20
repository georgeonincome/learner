import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/session'
import { listProgress } from '@/lib/learning'
import { getCourse, getCurriculum, getPrices } from '@/lib/content'
import { hasEntityAccess } from '@/lib/access'
import { CheckoutButton, EnrollFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

const TYPE_LABEL: Record<string, string> = {
  video: 'Video', text: 'Reading', audio: 'Audio', pdf: 'PDF',
  download: 'Download', asgmt: 'Assignment', quiz: 'Quiz',
}

/** Course dashboard — real DB curriculum, real progress, access-gated. */
export default async function DashboardCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = await getCourse(courseId)
  if (!course) notFound()

  const uid = await getCurrentUserId()
  if (!uid) redirect(`/signin?callbackUrl=/dashboard/course/${course.id}`)
  const [curriculum, progress, access, prices] = await Promise.all([
    getCurriculum(course.id), listProgress(uid), hasEntityAccess(uid, 'course', course.id), getPrices('course', course.id),
  ])
  const all = curriculum.flatMap((c) => c.lessons)
  const ids = all.map((l) => String(l.id))
  const done = (id: number | string) => progress.some((p) => p.lesson_id === String(id) && p.completed === 1)
  const percent = ids.length ? Math.round((ids.filter(done).length / ids.length) * 100) : 0
  const nextLesson = all.find((l) => !done(l.id)) ?? all[0]
  const defaultPrice = prices.find((p) => p.is_default) ?? prices[0]
  const isFree = !defaultPrice || Number(defaultPrice.price) <= 0 || defaultPrice.price_type === 'FREE'

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-[1264px]">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">{course.title}</span>
          </nav>

          <h1 className="font-heading font-bold mb-2 text-2xl text-[var(--color-text-primary)]">{course.title}</h1>
          <p className="text-sm mb-8 text-[var(--color-text-secondary)]">{course.short_description || course.description}</p>

          {!access.allowed ? (
            <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6 text-center">
              <h2 className="font-heading font-bold text-lg mb-2 text-[var(--color-text-primary)]">
                {isFree ? 'Enrol to start learning' : 'This course is not in your library yet'}
              </h2>
              <p className="text-sm mb-5 text-[var(--color-text-secondary)]">
                {isFree ? 'It is free — enrol and start the first lesson now.'
                  : `${defaultPrice?.currency ?? 'USD'} ${Number(defaultPrice?.price ?? 0).toFixed(2)} · ${all.length} lessons · ${curriculum.length} chapters`}
              </p>
              {isFree ? (
                <EnrollFreeButton courseId={String(course.id)} label="Enrol free" className="max-w-xs mx-auto" />
              ) : (
                <CheckoutButton entityType="course" entityId={course.id} currency={defaultPrice?.currency}
                  className="max-w-xs mx-auto" label={`Buy ${defaultPrice?.currency ?? 'USD'} ${Number(defaultPrice?.price ?? 0).toFixed(2)}`} />
              )}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-4">
                {nextLesson ? (
                  <Link href={`/dashboard/course/${course.id}/lesson/${nextLesson.id}`}
                    className="no-underline block rounded-xl bg-[var(--color-cta)] px-5 py-4 text-center text-sm font-semibold text-[var(--color-cta-text)]">
                    {percent > 0 ? 'Resume where you left off' : 'Start the first lesson'} →
                  </Link>
                ) : null}
                {curriculum.map(({ chapter, lessons }, ci) => (
                  <div key={chapter.id} className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4">
                    <h2 className="font-heading font-bold mb-3 text-base text-[var(--color-text-primary)]">{ci + 1}. {chapter.title}</h2>
                    <div className="space-y-2">
                      {lessons.map((lesson, i) => (
                        <div key={lesson.id} className="flex items-center justify-between p-2 rounded-lg border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)]">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-medium"
                              style={{ background: done(lesson.id) ? 'var(--color-primary)' : 'var(--color-bg-surface)', color: done(lesson.id) ? '#fff' : 'var(--color-text-primary)' }}>
                              {done(lesson.id) ? '✓' : i + 1}
                            </span>
                            <span className="text-sm truncate text-[var(--color-text-secondary)]">{lesson.title}</span>
                            <span className="text-[10px] uppercase text-[var(--color-text-muted)] shrink-0">{TYPE_LABEL[lesson.lesson_type] ?? lesson.lesson_type}</span>
                          </div>
                          <Link href={`/dashboard/course/${course.id}/lesson/${lesson.id}`}
                            className="no-underline text-sm text-[var(--color-primary-text)] font-medium shrink-0">{done(lesson.id) ? 'Review' : 'Open'}</Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4">
                  <h3 className="font-heading font-bold mb-3 text-base text-[var(--color-text-primary)]">Progress</h3>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--color-text-secondary)]">Overall</span>
                    <span className="text-[var(--color-text-primary)]">{percent}%</span>
                  </div>
                  <div className="w-full rounded-full h-2 bg-[var(--color-bg-surface-elevated)]">
                    <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-xs mt-3 text-[var(--color-text-muted)]">{ids.filter(done).length} / {ids.length} lessons completed</p>
                </div>
                <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] p-4">
                  <h3 className="font-heading font-bold mb-2 text-base text-[var(--color-text-primary)]">Certificate</h3>
                  <p className="text-sm mb-3 text-[var(--color-text-muted)]">
                    {percent === 100 ? 'Course complete — your certificate is ready.' : 'Complete every lesson to earn your certificate.'}
                  </p>
                  <Link href="/dashboard/certificates" className="no-underline text-sm text-[var(--color-primary-text)] font-medium">View certificates</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </AppSurface>
  )
}
