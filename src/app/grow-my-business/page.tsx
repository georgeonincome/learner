import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Grow My Business — SavvyPro',
  description: 'Build the marketing, sales and business systems you need to strengthen your operations and grow revenue.',
}

const path = homeContent.paths.find((p) => p.id === 3)

export default function GrowMyBusinessPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
