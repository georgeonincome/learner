import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('grow-my-business', '/grow-my-business')

export default function Page() {
  return <PublicPage specKey="grow-my-business" />
}
