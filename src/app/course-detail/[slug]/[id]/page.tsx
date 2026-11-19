import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import coursesData from '@/content/courses.json'
import courseDetailSlugs from '@/content/course-detail-slugs.json'

type CourseView = {
  id: string
  slug: string
  title: string
  category: string
  description: string
  price: number
  currency: string
  strike_through_price?: number
  is_free: boolean
  chapters_count: number
  lessons_count: number
}

function titleFromSlug(slug: string) {
  return slug
    .replace(/-\d{10,}$/, '')
    .split('-')
    .filter((w) => w && !/^\d+$/.test(w))
    .map((w) => (w === 'copy' ? '' : w.charAt(0).toUpperCase() + w.slice(1)))
    .filter(Boolean)
    .join(' ')
}

function getCourse(slug: string, id: string): CourseView {
  const found = (coursesData.courses ?? []).find(
    (c) => String(c.id) === id || c.slug === slug,
  )
  if (found) {
    return {
      id: String(found.id),
      slug: found.slug,
      title: found.title,
      category: found.category,
      description: found.description,
      price: found.price,
      currency: found.currency || 'USD',
      strike_through_price: found.strike_through_price ?? 0,
      is_free: found.is_free ?? false,
      chapters_count: found.chapters_count ?? 0,
      lessons_count: found.lessons_count ?? 0,
    }
  }
  // Sitemap URLs without a matching content entry: derive an original title.
  return {
    id,
    slug,
    title: `${titleFromSlug(slug) || 'Course'} (${id})`,
    category: 'Course',
    description: `Explore ${titleFromSlug(slug) || 'this course'} (${id}) on SavvyPro — practical digital skills and training.`,
    price: 0,
    currency: 'USD',
    is_free: true,
    chapters_count: 0,
    lessons_count: 0,
  }
}

const REF = {
  primary: '#00a3ff',
  primaryHover: '#008ed6',
  magenta: '#df1488',
  bgSurface: '#101b2f',
  bgSurfaceElevated: '#16243e',
  textPrimary: '#f8f7f7',
  textSecondary: '#f7f3f3',
  textMuted: '#5b6475',
  borderCard: '#64748b',
}

const chapters = [
  {
    index: 0,
    title: 'Content Strategy Fundamentals',
    lessons: [
      { id: 1, title: 'Defining your content goals', is_free: true, duration_minutes: 12 },
      { id: 2, title: 'Understanding your audience', is_free: false, duration_minutes: 18 },
      { id: 3, title: 'Content pillars and themes', is_free: false, duration_minutes: 15 },
    ],
  },
  {
    index: 1,
    title: 'Video Production Basics',
    lessons: [
      { id: 4, title: 'Equipment setup', is_free: false, duration_minutes: 20 },
      { id: 5, title: 'Lighting and sound', is_free: false, duration_minutes: 15 },
      { id: 6, title: 'Basic editing workflow', is_free: false, duration_minutes: 25 },
    ],
  },
  {
    index: 2,
    title: 'Copywriting for Social Media',
    lessons: [
      { id: 7, title: 'Writing hooks that convert', is_free: false, duration_minutes: 14 },
      { id: 8, title: 'Storytelling frameworks', is_free: false, duration_minutes: 18 },
      { id: 9, title: 'Call-to-action best practices', is_free: false, duration_minutes: 12 },
    ],
  },
]

export const dynamicParams = true

export async function generateStaticParams() {
  return courseDetailSlugs
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  const c = getCourse(slug, id)
  return {
    title: `${c.title} — SavvyPro`,
    description: c.description,
    alternates: { canonical: `/course-detail/${c.slug}/${c.id}` },
    openGraph: { title: c.title, description: c.description, type: 'website' },
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  const course = getCourse(slug, id)
  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="border-b border-border-card pb-3 mb-6">
          <div className="flex items-center gap-2 text-text-muted">
            <Link href="/courses" className="no-underline text-primary hover:text-primary-hover">Courses</Link>
            <span className="text-text-primary">{course.title}</span>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap lg:nowrap">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-bold" style={{
              fontSize: '36px',
              marginBottom: '16px',
              color: REF.textPrimary,
            }}>
              {course.title}
            </h1>
            <p className="mb-4" style={{ color: REF.textSecondary }}>
              {course.description}
            </p>
            <div className="flex gap-2 flex-wrap mb-4">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
                {course.category}
              </span>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{
                backgroundColor: course.is_free ? REF.primary : REF.magenta,
                color: '#151515',
              }}>
                {course.is_free ? 'Free' : `$${course.currency} ${course.price}`}
              </span>
            </div>

            <h2 className="font-heading font-bold" style={{
              fontSize: '20px',
              marginTop: '24px',
              marginBottom: '8px',
              color: REF.textPrimary,
            }}>
              Course Content
            </h2>
            <p className="mb-3" style={{ color: REF.textSecondary }}>
              {course.chapters_count} chapters • {course.lessons_count} lessons
            </p>

            <div className="mt-4">
              {chapters.map((chapter) => (
                <div key={chapter.index} className="p-3 bg-surface-elevated border border-border-card rounded-lg mb-2">
                  <h3 className="font-heading font-bold" style={{ fontSize: '16px', marginBottom: '4px', color: REF.textPrimary }}>
                    Chapter {chapter.index + 1}
                  </h3>
                  <ul className="list-disc pl-4 m-0 text-text-muted text-sm">
                    {chapter.lessons.map((lesson) => (
                      <li key={lesson.id} className="mb-1">
                        <span>{lesson.title}</span>
                        {lesson.is_free && <span className="text-primary ml-1">· free preview</span>}
                        {lesson.duration_minutes > 0 && <span className="text-muted ml-1">· {lesson.duration_minutes} min</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="w-96 shrink-0 sticky top-4">
            <div className="p-4 bg-surface border border-border-card rounded-lg">
              <h2 className="font-heading font-bold" style={{
                fontSize: '20px',
                marginBottom: '8px',
                color: REF.textPrimary,
              }}>
                {course.is_free ? 'Free' : `$${course.currency} ${course.price}`}
              </h2>
              {(course.strike_through_price ?? 0) > 0 && (
                <p className="mb-4" style={{ color: REF.textSecondary, textDecoration: 'line-through' }}>
                  {course.currency} {course.strike_through_price}
                </p>
              )}
              <p className="mb-4" style={{ color: REF.textSecondary }}>
                {course.is_free ? 'No payment required' : 'One-time payment'}
              </p>
              <Link href="/checkout" className="no-underline w-full">
                <Button variant={course.is_free ? 'primary' : 'secondary'} size="md" className="w-full">
                  {course.is_free ? 'Enroll Free' : 'Enroll Now'}
                </Button>
              </Link>
              <Link href="/course-detail/content-creation-school-2026/36467/learn" className="no-underline w-full mt-2 block">
                <Button variant="outline" size="md" className="w-full">
                  Open lessons
                </Button>
              </Link>
              <p className="mt-2 text-text-muted text-sm">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
