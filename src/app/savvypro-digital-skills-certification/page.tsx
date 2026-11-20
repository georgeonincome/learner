import { TemplatePage } from '@/components/templates/TemplatePage'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata() {
  return buildMetadata({ title: 'Digital skills certification', description: 'Earn your Lena digital skills certification.', path: '/savvypro-digital-skills-certification' })
}

export default function Page() {
  return <TemplatePage slug="savvypro-digital-skills-certification" />
}
