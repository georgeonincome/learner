import type { Metadata } from 'next'
import { listCourses, getCourse } from '@/lib/content'
import { CourseDetail } from '@/components/commerce/CourseDetail'
import { buildMetadata, courseLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import courseIndex from '@/content/course-index.json'

type Params = Promise<{ slug: string; id: string }>
export const revalidate = 3600

/**
 * Course detail (M5). DB-driven real template (not a DOM replay). Params cover
 * every published course plus the legacy slugs the reference links to.
 */
export async function generateStaticParams() {
  const { courses } = await listCourses({ pageSize: 500 })
  const seen = new Set<string>()
  const out: { slug: string; id: string }[] = []
  const push = (slug: string, id: string | number) => {
    const key = `${slug}/${id}`
    if (!slug || seen.has(key)) return
    seen.add(key)
    out.push({ slug, id: String(id) })
  }
  for (const c of courses) push(c.slug, c.id)
  for (const c of (courseIndex as { courses: { slug: string; id: number }[] }).courses) push(c.slug, c.id)
  return out
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const n = await params
  const course = (await getCourse(n.slug)) ?? (await getCourse(n.id))
  if (!course) return { title: 'Course not found' }
  return buildMetadata({
    title: course.seo_title || course.title,
    description: course.seo_description || course.short_description || course.description.slice(0, 155),
    path: `/course-detail/${course.slug}/${course.id}`,
    ogImage: course.og_image ?? undefined,
    canonical: course.canonical ?? undefined,
    noIndex: !!course.no_index,
  })
}

export default async function Page({ params }: { params: Params }) {
  const n = await params
  const course = (await getCourse(n.slug)) ?? (await getCourse(n.id))
  return (
    <>
      {course ? <JsonLd data={courseLd(course)} /> : null}
      <CourseDetail slug={n.slug} id={n.id} />
    </>
  )
}
