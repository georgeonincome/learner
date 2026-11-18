import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Starting a Business — SavvyPro',
  description: 'Not sure where to begin? Discover the skills, resources and a clear path to make your idea real.',
}

const path = homeContent.paths.find((p) => p.id === 1)

export default function GettingStartedPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
