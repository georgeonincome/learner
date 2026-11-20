import { pageMeta } from '@/lib/page-metadata'
import { TemplatePage } from '@/components/templates/TemplatePage'
import { listSpaces } from '@/lib/community'

type Params = Promise<{ id: string }>

export async function generateStaticParams() {
  const spaces = await listSpaces()
  return spaces.map((s) => ({ id: String(s.id) }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const n = await params
  const meta = pageMeta(String(n.id), 'Community')
  // Duplicate group names exist in the reference (two "Digital Skills Bundle Forum"
  // spaces). Disambiguate by id so every URL has a unique title/description.
  const suffix = ` · Group ${n.id}`
  return {
    ...meta,
    title: `${meta.title ?? 'Community'}${suffix}`,
    description: `${meta.description ?? ''} Group ${n.id}.`,
  }
}

export default async function Page({ params }: { params: Params }) {
  const n = await params
  return <TemplatePage slug={String(n.id)} hint="community" />
}
