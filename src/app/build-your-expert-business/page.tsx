import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Build Your Expert Business — SavvyPro',
  description: 'Turn what you know into a stronger brand, business, product or service.',
}

const path = homeContent.paths.find((p) => p.id === 4)

export default function BuildYourExpertBusinessPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
