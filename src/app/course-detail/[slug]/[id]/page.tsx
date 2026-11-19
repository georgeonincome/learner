import { PublicPage, specMetadataForSpec } from '@/components/layout/PublicPage'
import { getSpecByKey, listSpecKeys } from '@/lib/page-spec'
import { CourseDetail } from '@/components/commerce/CourseDetail'
import { getIndexedCourse, getIndexedCourses } from '@/lib/catalog'

type Params = Promise<{ slug: string; id: string }>

/** Every course-detail route the reference links to, not just the sitemap subset. */
function allCourseDetailPaths(): { slug: string; id: string }[] {
  const fromSpecs = listSpecKeys()
    .filter((k) => k.startsWith('course-detail__'))
    .map((k) => ({ slug: k.split('__')[1] ?? '', id: k.split('__')[2] ?? '' }))
    .filter((p) => p.slug && p.id)
  const fromIndex = getIndexedCourses().map((c) => ({ slug: c.slug, id: String(c.id) }))
  const seen = new Set<string>()
  const out: { slug: string; id: string }[] = []
  for (const p of [...fromSpecs, ...fromIndex]) {
    const key = `${p.slug}/${p.id}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(p)
  }
  return out
}

export function generateStaticParams() {
  return allCourseDetailPaths()
}

export async function generateMetadata({ params }: { params: Params }) {
  const n = await params
  const key = `course-detail__${n.slug}__${n.id}`
  const spec = getSpecByKey(key)
  if (spec) return specMetadataForSpec(spec, 'Course')
  const indexed = getIndexedCourse(n.slug) || getIndexedCourse(n.id)
  return { title: indexed?.title || 'Course', description: indexed ? `${indexed.title} — ${indexed.category}.` : 'Course details and enrolment.' }
}

export default async function Page({ params }: { params: Params }) {
  const n = await params
  const key = `course-detail__${n.slug}__${n.id}`
  const spec = getSpecByKey(key)
  // Captured reference page where we have one; otherwise the catalog-driven page.
  if (spec) return <PublicPage specKey={key} />
  return <CourseDetail slug={n.slug} id={n.id} />
}
