import { PublicPage, specMetadataForSpec } from '@/components/layout/PublicPage'
import { getSpecByKey, listSpecKeys } from '@/lib/page-spec'

type Params = Promise<{ id: string }>

export function generateStaticParams() {
  return listSpecKeys().filter((k) => k.startsWith('community__')).map((k) => ({ id: k.slice(11) }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const n = await params
  return specMetadataForSpec(getSpecByKey(`community__${n.id}`), 'Community')
}

export default async function Page({ params }: { params: Params }) {
  const n = await params
  return <PublicPage specKey={String(`community__${n.id}`)} />
}
