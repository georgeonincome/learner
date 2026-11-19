import Link from 'next/link'
import { getCourse, getCourseCurriculum, getIndexedCourse, toMinorUnits } from '@/lib/catalog'
import { CheckoutButton, EnrollFreeButton } from '@/components/commerce/CheckoutButton'
import { AppSurface } from '@/components/layout/AppSurface'

/**
 * Data-driven course detail. Used when a course-detail URL has no captured
 * reference spec — the reference's own pages link to 54 course-detail routes and
 * the sitemap only covers 32, so without this those links render blank.
 */
export async function CourseDetail({ slug, id }: { slug: string; id: string }) {
  const curated = getCourse(slug) || getCourse(id)
  const indexed = getIndexedCourse(slug) || getIndexedCourse(id)

  if (!curated && !indexed) {
    return (
      <AppSurface><main className="py-16 px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-heading font-bold text-2xl mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Course not found
          </h1>
          <Link href="/courses" className="no-underline text-sm text-primary hover:text-primary-hover font-medium">
            ← Browse courses
          </Link>
        </div>
      </main></AppSurface>
    )
  }

  const title = curated?.title || indexed!.title
  const category = curated?.category || indexed!.category
  const description = curated?.description || `${title} — a SavvyPro course.`
  const price = curated?.price ?? indexed!.price
  const currency = curated?.currency || indexed!.currency
  const free = curated ? curated.is_free : indexed!.free
  const courseId = curated ? String(curated.id) : String(indexed!.id)
  const lessons = curated ? getCourseCurriculum(curated) : []
  const chapters = curated?.chapters_count || indexed!.chapters

  return (
    <AppSurface><main className="py-10 md:py-16 px-2 sm:px-4">
      <div className="mx-auto max-w-[1264px]">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/courses" className="no-underline text-sm text-text-secondary hover:text-primary">
            ← All courses
          </Link>
          <span className="text-xs text-text-muted">/</span>
          <span className="text-sm font-medium text-text-primary">{category}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-muted)' }}>
              {category}
            </p>
            <h1 className="font-heading font-bold mb-4" style={{ fontSize: '28px', color: 'var(--color-text-primary)' }}>
              {title}
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              {description}
            </p>

            <h2 className="font-heading font-bold text-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>
              What you will learn
            </h2>
            {lessons.length > 0 ? (
              <div className="space-y-3">
                {Array.from({ length: chapters }).map((_, c) => (
                  <div key={c} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
                    <h3 className="font-heading font-bold mb-2" style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}>
                      Chapter {c + 1}
                    </h3>
                    <ul className="space-y-1.5">
                      {lessons
                        .filter((l) => l.chapterIndex === c)
                        .slice(0, 6)
                        .map((l) => (
                          <li key={l.lessonId} className="text-sm flex gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                            {l.title}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)' }}>
                {indexed!.lessons} lessons across {chapters} chapters. The full curriculum is unlocked on enrolment.
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-xl border p-5 lg:sticky lg:top-24" style={{ borderColor: 'var(--color-border-card)', background: 'var(--color-bg-surface)' }}>
              <p className="font-heading font-bold text-2xl mb-1" style={{ color: 'var(--color-text-primary)' }}>
                {free ? 'Free' : `${currency} ${price.toFixed(2)}`}
              </p>
              {curated?.strike_through_price ? (
                <p className="text-sm line-through mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  {currency} {curated.strike_through_price.toFixed(2)}
                </p>
              ) : (
                <div className="mb-4" />
              )}
              <div className="text-xs mb-5" style={{ color: 'var(--color-text-secondary)' }}>
                {indexed!.lessons} lessons · {chapters} chapters · lifetime access
              </div>
              {free ? (
                <EnrollFreeButton courseId={courseId} label="Enrol now — free" />
              ) : (
                <CheckoutButton
                  label={`Enrol — ${currency} ${price.toFixed(2)}`}
                  lineItems={[
                    {
                      price_data: {
                        currency: currency.toLowerCase(),
                        unit_amount: toMinorUnits(price, currency),
                        product_data: { name: title },
                      },
                      quantity: 1,
                    },
                  ]}
                />
              )}
              <p className="mt-3 text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                Secure payment by Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main></AppSurface>
  )
}
