import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/session'
import { listProgress, completionPercent, isEnrolled } from '@/lib/learning'
import { getCourse, getCourseCurriculum } from '@/lib/catalog'
import { CheckoutButton, EnrollFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

/** Course dashboard — real curriculum, real progress, gated on enrollment. */
export default async function DashboardCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = getCourse(courseId)

  if (!course) {
    return (
      <AppSurface><main className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading font-bold text-2xl mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Course not found
          </h1>
          <Link href="/dashboard" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
            ← Back to dashboard
          </Link>
        </div>
      </main></AppSurface>
    )
  }

  const uid = await getCurrentUserId()
  if (!uid) redirect('/signin?callbackUrl=/dashboard')
  const enrolled = await isEnrolled(uid, String(course.id))
  const lessons = getCourseCurriculum(course)
  const [progress] = await Promise.all([listProgress(uid)])
  const ids = lessons.map((l) => l.lessonId)
  const percent = completionPercent(progress, ids)

  // Group lessons by chapter, preserving order.
  const chapters: { index: number; title: string; lessons: typeof lessons }[] = []
  for (const lesson of lessons) {
    let group = chapters.find((c) => c.index === lesson.chapterIndex)
    if (!group) {
      group = { index: lesson.chapterIndex, title: lesson.title, lessons: [] }
      chapters.push(group)
    }
    group.lessons.push(lesson)
  }

  return (
    <AppSurface><main>
      <div className="py-10 md:py-16 px-2 sm:px-2">
        <div className="mx-auto max-w-[1264px]">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/dashboard" className="no-underline text-sm text-text-secondary hover:text-primary">
              ← Back to dashboard
            </Link>
            <span className="text-xs text-text-muted">/</span>
            <span className="text-sm font-medium text-text-primary">{course.category}</span>
          </div>

          <h1 className="font-heading font-bold mb-2" style={{ fontSize: '24px', color: 'var(--color-text-primary)' }}>
            {course.title}
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            {course.description}
          </p>

          {!enrolled ? (
            <div className="rounded-xl border p-6 text-center" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
              <h2 className="font-heading font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {course.is_free ? 'Enrol to start learning' : 'This course is not in your library yet'}
              </h2>
              <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
                {course.is_free
                  ? 'It is free — enrol and start the first lesson now.'
                  : `${course.currency} ${course.price.toFixed(2)} · ${lessons.length} lessons · ${course.chapters_count} chapters`}
              </p>
              {course.is_free ? (
                <EnrollFreeButton courseId={String(course.id)} label="Enrol free" className="max-w-xs mx-auto" />
              ) : (
                <CheckoutButton
                  className="max-w-xs mx-auto"
                  label={`Buy ${course.currency} ${course.price.toFixed(2)}`}
                  lineItems={[
                    {
                      price_data: {
                        currency: course.currency.toLowerCase(),
                        unit_amount: Math.round(course.price * 100),
                        product_data: { name: course.title },
                      },
                      quantity: 1,
                    },
                  ]}
                />
              )}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-4">
                {chapters.map((chapter) => (
                  <div key={chapter.index} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
                    <h2 className="font-heading font-bold mb-3" style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                      Chapter {chapter.index + 1}: {chapter.title}
                    </h2>
                    <div className="space-y-2">
                      {chapter.lessons.map((lesson, i) => {
                        const done = progress.some((p) => p.lesson_id === lesson.lessonId && p.completed === 1)
                        return (
                          <div
                            key={lesson.lessonId}
                            className="flex items-center justify-between p-2 rounded-lg border"
                            style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface-elevated)' }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-medium"
                                style={{ background: done ? 'var(--color-primary)' : 'var(--color-bg-surface)', color: done ? '#fff' : 'var(--color-text-primary)' }}
                              >
                                {done ? '✓' : i + 1}
                              </span>
                              <span className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>
                                {lesson.title}
                              </span>
                            </div>
                            <Link
                              href={`/dashboard/course/${course.id}/lesson/${encodeURIComponent(lesson.lessonId)}`}
                              className="no-underline text-sm text-primary hover:text-primary-hover font-medium shrink-0"
                            >
                              {done ? 'Review' : 'Open'}
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
                  <h3 className="font-heading font-bold mb-3" style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                    Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">Overall</span>
                        <span className="text-text-primary">{percent}%</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: 'var(--color-bg-surface-elevated)' }}>
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-secondary">Lessons completed</span>
                      <span className="text-text-primary">
                        {lessons.filter((l) => progress.some((p) => p.lesson_id === l.lessonId && p.completed === 1)).length} / {lessons.length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface-elevated)' }}>
                  <h3 className="font-heading font-bold mb-2" style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                    Certificate
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
                    {percent === 100
                      ? 'Course complete — your certificate is ready.'
                      : 'Complete every lesson to earn your certificate.'}
                  </p>
                  <Link
                    href={percent === 100 ? `/dashboard/certificates?course=${course.id}` : '/dashboard/certificates'}
                    className="no-underline text-sm text-primary hover:text-primary-hover font-medium"
                  >
                    {percent === 100 ? 'View certificate' : 'View certificates'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main></AppSurface>
  )
}
