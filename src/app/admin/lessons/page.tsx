import { CurriculumEditor } from '@/components/admin/CurriculumEditor'

export const dynamic = 'force-dynamic'

export default function AdminLessonsPage() {
  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-[var(--color-text-primary)] mb-2">Lessons</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">Manage chapters and lessons per course. Changes persist to the database and revalidate the public course pages.</p>
      <CurriculumEditor />
    </div>
  )
}
