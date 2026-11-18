'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface Post {
  slug: string
  title: string
  category: string
  excerpt: string
  publishedAt: string
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [excerpt, setExcerpt] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/posts', { cache: 'no-store' })
    if (res.ok) setPosts((await res.json()).posts)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, category, excerpt }),
    })
    if (res.ok) {
      setTitle('')
      setSlug('')
      setCategory('')
      setExcerpt('')
      load()
    }
  }

  async function remove(slug: string) {
    await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">Blog posts</h2>
      <Card className="p-5 mb-6">
        <h3 className="font-heading font-bold text-text-primary mb-4">New article</h3>
        <form onSubmit={create} className="grid gap-3 sm:grid-cols-2">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <Input label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" size="sm">Create post</Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="font-heading font-bold text-text-primary mb-4">All posts ({posts.length})</h3>
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.slug} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border-card">
              <div className="min-w-0">
                <p className="text-text-primary font-medium truncate">{p.title}</p>
                <p className="text-text-muted text-xs truncate">{p.category} · {p.publishedAt}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a href={`/blog/${p.slug}`} className="no-underline">
                  <Button size="sm" variant="outline">View</Button>
                </a>
                <Button size="sm" variant="danger" onClick={() => remove(p.slug)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
