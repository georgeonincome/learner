import { CmsManager } from '@/components/admin/CmsManager'

export const dynamic = 'force-dynamic'

export default function AdminPostsPage() {
  return <CmsManager entity="blog_posts" title="Blog posts" />
}
