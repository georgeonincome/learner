import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Business Solutions — SavvyPro',
  description: 'Sharpen the tools, digital know-how and the team capacity to run and grow the business.',
}

const path = homeContent.paths.find((p) => p.id === 5)

export default function BusinessSolutionsPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
