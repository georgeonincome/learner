import Link from 'next/link'
import { listPosts, listCategories } from '@/lib/content'

/** AllBlogs equivalent: dynamic blog card grid fed by the CMS (M2). */
export async function BlogGrid({ limit = 6 }: { limit?: number }) {
  const { posts } = await listPosts({ pageSize: limit })
  const cats = await listCategories()
  const catName = (id: number | null) => cats.find((c) => c.id === id)?.name ?? 'Blog'
  if (!posts.length) {
    return <p className="text-[var(--color-text-muted)] text-sm py-8 text-center">No posts published yet.</p>
  }
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <Link
          key={p.id}
          href={`/blog/${p.slug}`}
          className="no-underline rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 flex flex-col gap-3 hover:border-[var(--color-primary)] transition-colors"
        >
          <span className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">{catName(p.category_id)}</span>
          <span className="font-heading font-bold text-lg text-[var(--color-text-primary)] leading-snug">{p.title}</span>
          <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{p.excerpt}</span>
          <span className="text-sm font-medium text-[var(--color-primary-text)] mt-auto">Read article →</span>
        </Link>
      ))}
    </div>
  )
}
