import { PublicPage, specMetadataForSpec } from '@/components/layout/PublicPage'
import { getSpecByKey, listSpecKeys } from '@/lib/page-spec'

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return listSpecKeys().filter((k) => k.startsWith('blog__') && !k.startsWith('blog__category__')).map((k) => ({ slug: k.slice(6) }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const n = await params
  return specMetadataForSpec(getSpecByKey(`blog__${n.slug}`), 'Blog')
}

export default async function Page({ params }: { params: Params }) {
  const n = await params
  return <PublicPage specKey={String(`blog__${n.slug}`)} />
}
