import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('kinsumo-test', '/kinsumo-test')

export default function Page() {
  return <PublicPage specKey="kinsumo-test" />
}
