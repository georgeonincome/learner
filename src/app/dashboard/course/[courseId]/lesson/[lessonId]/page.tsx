import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserId } from '@/lib/session'
import { listProgress, isEnrolled, completionPercent } from '@/lib/learning'
import { getCourse, getCourseCurriculum, getCourseLesson } from '@/lib/catalog'
import { LessonProgress } from '@/components/learning/LessonProgress'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

/** Lesson player — real lesson from the catalog, real progress, gated on enrollment. */
export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>
}) {
  const { courseId, lessonId } = await params
  const course = getCourse(courseId)
  const lesson = course ? getCourseLesson(course, decodeURIComponent(lessonId)) : null

  if (!course || !lesson) {
    return (
      <AppSurface><main className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading font-bold text-2xl mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Lesson not found
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
  const progress = await listProgress(uid)
  const percent = completionPercent(progress, lessons.map((l) => l.lessonId))
  const done = progress.some((p) => p.lesson_id === lesson.lessonId && p.completed === 1)

  if (!enrolled) {
    return (
      <AppSurface><main className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading font-bold text-2xl mb-3" style={{ color: 'var(--color-text-primary)' }}>
            This lesson is part of a paid course
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Enrol in {course.title} to watch it.
          </p>
          <Link
            href={`/dashboard/course/${course.id}`}
            className="no-underline text-sm text-primary hover:text-primary-hover font-medium"
          >
            Go to course
          </Link>
        </div>
      </main></AppSurface>
    )
  }

  const mm = Math.floor(lesson.durationSec / 60)
  const ss = String(lesson.durationSec % 60).padStart(2, '0')

  return (
    <AppSurface><main>
      <div className="py-10 md:py-16 px-2 sm:px-2">
        <div className="mx-auto max-w-[1264px]">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href={`/dashboard/course/${course.id}`}
              className="no-underline text-sm text-text-secondary hover:text-primary"
            >
              ← Back to course
            </Link>
            <span className="text-xs text-text-muted">/</span>
            <span className="text-sm font-medium text-text-primary">
              Chapter {lesson.chapterIndex + 1} · Lesson {lessons.findIndex((l) => l.lessonId === lesson.lessonId) + 1}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
                <div
                  className="h-64 flex items-center justify-center text-sm"
                  style={{ background: 'var(--color-bg-surface-elevated)', color: 'var(--color-text-muted)' }}
                >
                  {lesson.title}
                </div>
                <div className="p-4">
                  <h1 className="font-heading font-bold mb-2" style={{ fontSize: '20px', color: 'var(--color-text-primary)' }}>
                    {lesson.title}
                  </h1>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    {course.description}
                  </p>
                  <div className="flex gap-2">
                    <span
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: 'var(--color-bg-surface-elevated)', color: 'var(--color-text-primary)' }}
                    >
                      {done ? '✓ Completed' : 'Not completed'}
                    </span>
                    <span
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: 'var(--color-bg-surface-elevated)', color: 'var(--color-text-primary)' }}
                    >
                      {mm}:{ss}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
                <h3 className="font-heading font-bold mb-3" style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                  Lesson notes
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  This lesson is part of chapter {lesson.chapterIndex + 1} of {course.title}. Work through the
                  material, then mark the lesson complete to track your progress toward the certificate.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
                <h3 className="font-heading font-bold mb-3" style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                  Course progress
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">This course</span>
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
                <LessonProgress lessonId={lesson.lessonId} />
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface-elevated)' }}>
                <h3 className="font-heading font-bold mb-2" style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                  Next lesson
                </h3>
                {(() => {
                  const idx = lessons.findIndex((l) => l.lessonId === lesson.lessonId)
                  const next = lessons[idx + 1]
                  if (!next) {
                    return (
                      <Link href="/dashboard/certificates" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
                        View certificates
                      </Link>
                    )
                  }
                  return (
                    <Link
                      href={`/dashboard/course/${course.id}/lesson/${encodeURIComponent(next.lessonId)}`}
                      className="no-underline text-sm text-primary hover:text-primary-hover font-medium"
                    >
                      {next.title}
                    </Link>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main></AppSurface>
  )
}
