import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Build Your Expert Business — SavvyPro',
  description: 'Convert your knowledge into a stronger brand, an offer, or a service.',
}

const path = homeContent.paths.find((p) => p.id === 4)

export default function BuildYourExpertBusinessPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
