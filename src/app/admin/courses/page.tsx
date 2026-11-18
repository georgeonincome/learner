'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface Course {
  id: string | number
  title: string
  slug: string
  category: string
  price: number
  isPublished: boolean
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('0')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/courses', { cache: 'no-store' })
    if (res.ok) setCourses((await res.json()).courses)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, category, price: Number(price) || 0 }),
    })
    if (res.ok) {
      setTitle('')
      setSlug('')
      setCategory('')
      setPrice('0')
      load()
    }
  }

  async function remove(id: string | number) {
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    load()
  }

  async function toggle(course: Course) {
    await fetch(`/api/admin/courses/${course.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !course.isPublished }),
    })
    load()
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">Courses</h2>
      <Card className="p-5 mb-6">
        <h3 className="font-heading font-bold text-text-primary mb-4">Add a course</h3>
        <form onSubmit={create} className="grid gap-3 sm:grid-cols-2">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <Input label="Price (USD)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" size="sm">Create course</Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="font-heading font-bold text-text-primary mb-4">All courses ({courses.length})</h3>
        <div className="space-y-2">
          {courses.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border-card">
              <div className="min-w-0">
                <p className="text-text-primary font-medium truncate">{c.title}</p>
                <p className="text-text-muted text-xs truncate">{c.slug} · {c.category} · ${c.price}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => toggle(c)}>
                  {c.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(c.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
