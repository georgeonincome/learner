import { TemplatePage } from '@/components/templates/TemplatePage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata() {
  return buildMetadata({ title: 'Digital skills classes', description: 'Join a live digital skills class and learn by doing.', path: '/digital-skills-classes' })
}

export default function Page() {
  return <TemplatePage slug="digital-skills-classes" />
}
