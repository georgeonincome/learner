'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface Comment {
  id: string
  authorName: string
  body: string
  createdAt: string
}
interface Post {
  id: string
  channel: string
  authorName: string
  title: string
  body: string
  createdAt: string
  likes: string[]
  comments: Comment[]
}
interface Group {
  id: string
  name: string
  tagline: string
  memberCount: number
  channelCount: number
  postCount: number
  channels: string[]
}

function channelInitial(name: string) {
  if (name.startsWith('Ask')) return 'Aa'
  if (name.startsWith('Affiliates')) return 'A'
  return 'G'
}

export function GroupFeed({ group }: { group: Group }) {
  const [tab, setTab] = useState<'feed' | 'channels'>('feed')
  const [activeChannel, setActiveChannel] = useState(group.channels[0] ?? 'General')
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [commentFor, setCommentFor] = useState<string | null>(null)
  const [commentBody, setCommentBody] = useState('')
  const [loading, setLoading] = useState(true)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/community/groups/${group.id}/posts`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = (await res.json()) as { posts: Post[] }
        setPosts(data.posts ?? [])
      }
    } catch {
      // keep empty
    } finally {
      setLoading(false)
    }
  }, [group.id])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  async function createPost(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    const res = await fetch(`/api/community/groups/${group.id}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, channel: activeChannel }),
    })
    if (res.ok) {
      setTitle('')
      setBody('')
      loadPosts()
    }
  }

  async function toggleLike(postId: string) {
    const res = await fetch(`/api/community/posts/${postId}/like`, {
      method: 'POST',
    })
    if (res.ok) loadPosts()
  }

  async function addComment(postId: string) {
    if (!commentBody.trim()) return
    const res = await fetch(`/api/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: commentBody }),
    })
    if (res.ok) {
      setCommentBody('')
      setCommentFor(null)
      loadPosts()
    }
  }

  const visiblePosts = posts.filter((p) => p.channel === activeChannel)

  return (
    <div className="py-10 md:py-14 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
            {group.name}
          </h1>
          <p className="text-text-secondary mb-3">{group.tagline}</p>
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            <span>{group.memberCount} Members</span>
            <span>{group.channelCount} Channels</span>
            <span>{group.postCount} Posts</span>
          </div>
        </div>

        <div className="flex gap-1 border-b border-border mb-6">
          <button
            onClick={() => setTab('feed')}
            className={`px-4 py-2 font-heading font-medium text-sm ${
              tab === 'feed'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setTab('channels')}
            className={`px-4 py-2 font-heading font-medium text-sm ${
              tab === 'channels'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Channels &amp; group
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <Card className="p-4">
              <h2 className="font-heading font-bold text-text-primary mb-3">
                Channels
              </h2>
              <div className="space-y-1">
                {group.channels.map((channel) => (
                  <button
                    key={channel}
                    onClick={() => {
                      setActiveChannel(channel)
                      setTab('feed')
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-2 rounded text-left text-sm ${
                      activeChannel === channel
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-text-secondary hover:bg-surface-elevated'
                    }`}
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded bg-surface-elevated text-xs font-bold">
                      {channelInitial(channel)}
                    </span>
                    {channel}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          <div className="lg:col-span-9 space-y-4">
            <div className="text-sm text-text-muted">
              You&apos;re now in <span className="text-primary font-medium"># {activeChannel}</span>
            </div>

            {tab === 'feed' && (
              <Card className="p-4">
                <form onSubmit={createPost} className="space-y-3">
                  <Input
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Share something with the group…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={3}
                    required
                    className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    Post
                  </Button>
                </form>
              </Card>
            )}

            {tab === 'feed' && (
              <div className="space-y-4">
                {loading ? (
                  <p className="text-text-muted text-sm">Loading…</p>
                ) : visiblePosts.length === 0 ? (
                  <Card className="p-8 text-center text-text-muted text-sm">
                    No posts available
                  </Card>
                ) : (
                  visiblePosts.map((post) => (
                    <Card key={post.id} className="p-4">
                      <h3 className="font-heading font-bold text-text-primary mb-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-text-muted mb-3">
                        {post.authorName} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-text-secondary text-sm mb-3 whitespace-pre-wrap">
                        {post.body}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="text-text-muted hover:text-primary"
                        >
                          ♥ {post.likes.length}
                        </button>
                        <button
                          onClick={() => setCommentFor(commentFor === post.id ? null : post.id)}
                          className="text-text-muted hover:text-primary"
                        >
                          💬 {post.comments.length}
                        </button>
                      </div>
                      {post.comments.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-border pt-3">
                          {post.comments.map((c) => (
                            <p key={c.id} className="text-sm text-text-secondary">
                              <span className="font-medium text-text-primary">{c.authorName}:</span>{' '}
                              {c.body}
                            </p>
                          ))}
                        </div>
                      )}
                      {commentFor === post.id && (
                        <div className="mt-3 flex gap-2">
                          <Input
                            placeholder="Write a comment…"
                            value={commentBody}
                            onChange={(e) => setCommentBody(e.target.value)}
                          />
                          <Button size="sm" variant="primary" onClick={() => addComment(post.id)}>
                            Send
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            )}

            {tab === 'channels' && (
              <Card className="p-6">
                <h3 className="font-heading font-bold text-text-primary mb-4">
                  Channels &amp; group
                </h3>
                <div className="space-y-3">
                  {group.channels.map((channel) => (
                    <button
                      key={channel}
                      onClick={() => {
                        setActiveChannel(channel)
                        setTab('feed')
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border-card hover:border-primary text-left"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded bg-surface-elevated text-sm font-bold text-primary">
                        {channelInitial(channel)}
                      </span>
                      <span className="text-text-primary font-medium">{channel}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            <p className="text-sm text-text-muted">Members : {group.memberCount}</p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/community" className="no-underline text-primary text-sm font-medium">
            ← All communities
          </Link>
        </div>
      </div>
    </div>
  )
}
