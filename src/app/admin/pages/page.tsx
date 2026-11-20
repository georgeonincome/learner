import { CmsManager } from '@/components/admin/CmsManager'

export const dynamic = 'force-dynamic'

export default function AdminPagesPage() {
  return <CmsManager entity="pages" title="Pages" />
}
