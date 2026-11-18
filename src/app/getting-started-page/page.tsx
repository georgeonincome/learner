import { PathLanding } from '@/components/home'
import homeContent from '@/content/home.json'

export const metadata = {
  title: 'Starting a Business — SavvyPro',
  description: 'Getting started? Find the practical skills, resources and next steps to turn your idea into something real.',
}

const path = homeContent.paths.find((p) => p.id === 1)

export default function GettingStartedPage() {
  if (!path) return null
  return <PathLanding path={path} />
}
