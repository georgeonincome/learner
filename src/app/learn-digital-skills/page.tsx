import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Learn Digital Skills — SavvyPro',
  description: 'Build useful, hands-on digital skills for work, creating, growing and marketing what you offer.',
}

const path = homeContent.paths.find((p) => p.id === 2)

export default function LearnDigitalSkillsPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
