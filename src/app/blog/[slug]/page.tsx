import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import blogData from '@/content/blog.json'

export const dynamicParams = true

export async function generateStaticParams() {
  return blogData.posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogData.posts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: `${post.title} — SavvyPro Blog`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogData.posts.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-badge text-text-primary">
            {post.category}
          </span>
          <span className="text-gray-text text-sm">{post.publishedAt}</span>
        </div>
        <h1 className="font-heading font-bold mt-2 mb-4" style={{
          fontSize: '34px',
          lineHeight: '1.2',
          color: 'var(--color-text-primary)',
        }}>
          {post.title}
        </h1>
        <div className="h-64 flex items-center justify-center rounded-xl bg-surface text-text-muted mb-6">
          {post.title}
        </div>
        <Card className="prose prose-invert max-w-none text-text-secondary leading-relaxed">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </Card>
        <div className="mt-8 pt-8 border-t border-border flex justify-between">
          <div />
          <div className="text-right">
            <a href="/blog" className="no-underline text-primary hover:text-primary-hover font-medium">
              ← Back to blog
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
