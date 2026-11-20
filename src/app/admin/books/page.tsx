import { CmsManager } from '@/components/admin/CmsManager'
import { MediaLibrary } from '@/components/admin/MediaLibrary'

export const dynamic = 'force-dynamic'

export default function AdminBooksPage() {
  return (
    <div>
      <CmsManager entity="books" title="Books &amp; ebooks" />
      <MediaLibrary />
    </div>
  )
}
