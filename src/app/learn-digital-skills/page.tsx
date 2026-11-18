import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Learn Digital Skills — SavvyPro',
  description: 'Get practical, hands-on training to build the digital skills you need to work, create, grow, and market.',
}

const path = homeContent.paths.find((p) => p.id === 2)

export default function LearnDigitalSkillsPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
