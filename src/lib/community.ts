import { query } from '@/lib/turso'
import { parseJson } from '@/lib/content'

export interface SpaceRow {
  id: number; slug: string; name: string; tagline: string; description: string
  access: string; member_count: number; channels: string
}

export interface FeedPost {
  id: string; channel: string; authorName: string; title: string; body: string
  createdAt: string; likes: string[]; comments: { id: string; authorName: string; body: string; createdAt: string }[]
}

export async function listSpaces(): Promise<SpaceRow[]> {
  return query<SpaceRow>("SELECT id, slug, name, tagline, description, access, member_count, channels FROM community_spaces WHERE status = 'published' ORDER BY id")
}

export async function getSpaceById(id: string | number): Promise<SpaceRow | null> {
  const rows = await query<SpaceRow>(
    'SELECT id, slug, name, tagline, description, access, member_count, channels FROM community_spaces WHERE CAST(id AS TEXT) = ? OR slug = ? LIMIT 1',
    [String(id), String(id)],
  )
  return rows[0] ?? null
}

export async function listPosts(spaceId: number): Promise<FeedPost[]> {
  const posts = await query<{
    id: string; channel: string; author_name: string; title: string; body: string
    likes: string; created_at: string
  }>(
    `SELECT id, channel, author_name, title, body, likes, created_at FROM community_posts
       WHERE space_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 200`, [spaceId],
  )
  const comments = await query<{
    id: string; post_id: string; author_name: string; body: string; created_at: string
  }>(
    `SELECT c.id, c.post_id, c.author_name, c.body, c.created_at FROM community_comments c
       JOIN community_posts p ON p.id = c.post_id
       WHERE p.space_id = ? AND c.deleted_at IS NULL ORDER BY c.created_at`, [spaceId],
  )
  return posts.map((p) => ({
    id: p.id, channel: p.channel, authorName: p.author_name || 'Learner',
    title: p.title, body: p.body, createdAt: p.created_at,
    likes: parseJson<string[]>(p.likes, []),
    comments: comments.filter((c) => c.post_id === p.id).map((c) => ({
      id: c.id, authorName: c.author_name || 'Learner', body: c.body, createdAt: c.created_at,
    })),
  }))
}
