import { PublicPage, specMetadataForSpec } from '@/components/layout/PublicPage'
import { getSpecByKey, listSpecKeys } from '@/lib/page-spec'

type Params = Promise<{ cat: string; id: string }>

export function generateStaticParams() {
  return listSpecKeys().filter((k) => k.startsWith('blog__category__')).map((k) => ({ cat: k.split('__')[2], id: k.split('__')[3] }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const n = await params
  return specMetadataForSpec(getSpecByKey(`blog__category__${n.cat}__${n.id}`), 'Blog category')
}

export default async function Page({ params }: { params: Params }) {
  const n = await params
  return <PublicPage specKey={String(`blog__category__${n.cat}__${n.id}`)} />
}
