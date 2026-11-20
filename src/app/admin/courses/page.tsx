import { CmsManager } from '@/components/admin/CmsManager'
import { CurriculumEditor } from '@/components/admin/CurriculumEditor'

export const dynamic = 'force-dynamic'

export default function AdminCoursesPage() {
  return (
    <div>
      <CmsManager entity="courses" title="Courses" />
      <CurriculumEditor />
    </div>
  )
}
