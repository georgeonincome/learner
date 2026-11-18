'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface Course {
  id: string | number
  title: string
}

export default function AdminLessonsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selected, setSelected] = useState('')
  const [lessons, setLessons] = useState<string[]>([])
  const [newLesson, setNewLesson] = useState('')

  useEffect(() => {
    fetch('/api/admin/courses', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { courses: [] }))
      .then((data: { courses: Course[] }) => {
        setCourses(data.courses)
        if (data.courses[0]) setSelected(String(data.courses[0].id))
      })
      .catch(() => setCourses([]))
  }, [])

  useEffect(() => {
    const course = courses.find((c) => String(c.id) === selected)
    setLessons(course ? [`${course.title} — Introduction`, `${course.title} — Deep dive`] : [])
  }, [selected, courses])

  function addLesson(e: React.FormEvent) {
    e.preventDefault()
    if (!newLesson.trim()) return
    setLessons([...lessons, newLesson.trim()])
    setNewLesson('')
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">Lessons</h2>
      <Card className="p-5 mb-6">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Select a course
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary"
        >
          {courses.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.title}</option>
          ))}
        </select>
      </Card>

      <Card className="p-5 mb-6">
        <h3 className="font-heading font-bold text-text-primary mb-4">Add a lesson</h3>
        <form onSubmit={addLesson} className="flex gap-2">
          <Input
            label="Lesson title"
            value={newLesson}
            onChange={(e) => setNewLesson(e.target.value)}
            className="flex-1"
            required
          />
          <div className="self-end pb-0.5">
            <Button type="submit" variant="primary" size="sm">Add</Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="font-heading font-bold text-text-primary mb-4">Lessons ({lessons.length})</h3>
        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border-card">
              <span className="text-text-secondary text-sm">{i + 1}. {lesson}</span>
              <Button size="sm" variant="outline" onClick={() => setLessons(lessons.filter((_, idx) => idx !== i))}>
                Remove
              </Button>
            </div>
          ))}
          {lessons.length === 0 && <p className="text-text-muted text-sm">No lessons yet.</p>}
        </div>
      </Card>
    </div>
  )
}
