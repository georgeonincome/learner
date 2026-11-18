import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Business Solutions — SavvyPro',
  description: 'Strengthen the systems, digital capability and team capacity your business needs to operate and grow at the next level.',
}

const path = homeContent.paths.find((p) => p.id === 5)

export default function BusinessSolutionsPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
