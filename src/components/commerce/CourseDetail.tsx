import Link from 'next/link'
import { getCourse, getCurriculum, getPrices, parseJson } from '@/lib/content'
import { CheckoutButton, EnrollFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'
import { notFound } from 'next/navigation'

const TYPE_LABEL: Record<string, string> = {
  video: 'Video', text: 'Reading', audio: 'Audio', pdf: 'PDF',
  download: 'Download', asgmt: 'Assignment', quiz: 'Quiz',
}

function fmtDuration(sec: number): string {
  if (!sec) return ''
  const m = Math.round(sec / 60)
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`
}

/**
 * DB-driven course detail (M5). Renders the real curriculum (chapters + lessons
 * with types and free previews) from Turso, multi-currency server-resolved
 * pricing, and the reference course-detail anatomy with original Lena branding.
 */
export async function CourseDetail({ slug, id }: { slug: string; id: string }) {
  const course = (await getCourse(slug)) ?? (await getCourse(id))
  if (!course || course.status !== 'published') notFound()

  const curriculum = await getCurriculum(course.id)
  const prices = await getPrices('course', course.id)
  const learning = parseJson<string[]>(course.learning_list, [])
  const includes = parseJson<string[]>(course.includes_list, [])
  const faq = parseJson<{ q: string; a: string }[]>(course.faq, [])
  const totalLessons = curriculum.reduce((n, c) => n + c.lessons.length, 0)
  const defaultPrice = prices.find((p) => p.is_default) ?? prices[0]
  const isFree = !defaultPrice || Number(defaultPrice.price) <= 0 || defaultPrice.price_type === 'FREE'

  return (
    <AppSurface>
      <main className="py-10 md:py-16 px-2 sm:px-4">
        <div className="mx-auto max-w-[1264px]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/courses" className="no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-primary-text)]">All courses</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="font-medium text-[var(--color-text-primary)]">{course.category}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="text-xs uppercase tracking-wide mb-2 text-[var(--color-text-muted)]">{course.category}{course.course_level ? ` · ${course.course_level}` : ''}</p>
              <h1 className="font-heading font-bold mb-4 text-[28px] md:text-[34px] leading-tight text-[var(--color-text-primary)]">{course.title}</h1>
              {course.short_description ? <p className="text-base leading-relaxed mb-4 text-[var(--color-text-secondary)]">{course.short_description}</p> : null}
              <p className="text-sm leading-relaxed mb-8 text-[var(--color-text-secondary)]">{course.description}</p>

              {learning.length ? (
                <section className="mb-8 rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5">
                  <h2 className="font-heading font-bold text-lg mb-4 text-[var(--color-text-primary)]">What you will learn</h2>
                  <ul className="grid gap-2 sm:grid-cols-2 list-none p-0 m-0">
                    {learning.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2 text-[var(--color-text-secondary)]"><span className="text-[var(--color-primary-text)]">✓</span>{item}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="mb-8">
                <h2 className="font-heading font-bold text-lg mb-4 text-[var(--color-text-primary)]">Curriculum</h2>
                <p className="text-sm mb-4 text-[var(--color-text-muted)]">{curriculum.length} chapters · {totalLessons} lessons</p>
                <div className="space-y-3">
                  {curriculum.map(({ chapter, lessons }, ci) => (
                    <div key={chapter.id} className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4">
                      <h3 className="font-heading font-bold mb-2 text-[15px] text-[var(--color-text-primary)]">{ci + 1}. {chapter.title}</h3>
                      <ul className="space-y-1.5 list-none p-0 m-0">
                        {lessons.map((l) => (
                          <li key={l.id} className="text-sm flex items-center gap-2 text-[var(--color-text-secondary)]">
                            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-muted)] shrink-0">{TYPE_LABEL[l.lesson_type] ?? l.lesson_type}</span>
                            <span className="flex-1">{l.title}</span>
                            {l.is_free ? <span className="text-[10px] font-medium text-[var(--color-primary-text)] shrink-0">Preview</span> : null}
                            {l.duration_sec ? <span className="text-xs text-[var(--color-text-muted)] shrink-0">{fmtDuration(l.duration_sec)}</span> : null}
                          </li>
                        ))}
                        {!lessons.length ? <li className="text-sm text-[var(--color-text-muted)]">Lessons coming soon.</li> : null}
                      </ul>
                    </div>
                  ))}
                  {!curriculum.length ? <p className="text-sm text-[var(--color-text-muted)]">The full curriculum is unlocked on enrolment.</p> : null}
                </div>
              </section>

              {includes.length ? (
                <section className="mb-8">
                  <h2 className="font-heading font-bold text-lg mb-3 text-[var(--color-text-primary)]">This course includes</h2>
                  <ul className="grid gap-2 sm:grid-cols-2 list-none p-0 m-0">
                    {includes.map((item, i) => <li key={i} className="text-sm flex gap-2 text-[var(--color-text-secondary)]"><span className="text-[var(--color-primary-text)]">•</span>{item}</li>)}
                  </ul>
                </section>
              ) : null}

              {faq.length ? (
                <section className="mb-8">
                  <h2 className="font-heading font-bold text-lg mb-3 text-[var(--color-text-primary)]">Frequently asked questions</h2>
                  <div className="space-y-3">
                    {faq.map((f, i) => (
                      <details key={i} className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4">
                        <summary className="cursor-pointer text-sm font-medium text-[var(--color-text-primary)]">{f.q}</summary>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="lg:col-span-4">
              <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 lg:sticky lg:top-24">
                {isFree ? (
                  <p className="font-heading font-bold text-2xl mb-4 text-[var(--color-text-primary)]">Free</p>
                ) : (
                  <div className="mb-4">
                    <p className="font-heading font-bold text-2xl text-[var(--color-text-primary)]">{defaultPrice!.currency} {Number(defaultPrice!.price).toFixed(2)}</p>
                    {defaultPrice!.strike_through ? <p className="text-sm line-through text-[var(--color-text-muted)]">{defaultPrice!.currency} {Number(defaultPrice!.strike_through).toFixed(2)}</p> : null}
                    {prices.length > 1 ? (
                      <p className="text-xs mt-1 text-[var(--color-text-muted)]">Also available: {prices.filter((p) => p.id !== defaultPrice!.id).map((p) => `${p.currency} ${Number(p.price).toFixed(2)}`).join(' · ')}</p>
                    ) : null}
                  </div>
                )}
                <p className="text-xs mb-5 text-[var(--color-text-secondary)]">{totalLessons} lessons · {curriculum.length} chapters · lifetime access</p>
                {isFree ? (
                  <EnrollFreeButton courseId={String(course.id)} label="Enrol now — free" />
                ) : (
                  <CheckoutButton entityType="course" entityId={course.id} currency={defaultPrice!.currency} label={`Enrol — ${defaultPrice!.currency} ${Number(defaultPrice!.price).toFixed(2)}`} />
                )}
                {course.guarantee_text ? <p className="mt-3 text-xs text-center text-[var(--color-text-muted)]">{course.guarantee_text}</p> : <p className="mt-3 text-xs text-center text-[var(--color-text-muted)]">Secure payment by Stripe.</p>}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AppSurface>
  )
}
