import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import blogData from '@/content/blog.json'

export const dynamicParams = true

export async function generateStaticParams() {
  return blogData.categories.map((c) => ({ cat: c.slug, id: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string; id: string }> }) {
  const { cat } = await params
  const category = blogData.categories.find((c) => c.slug === cat)
  if (!category) return { title: 'Category not found' }
  return {
    title: `${category.name} — Category — SavvyPro Blog`,
    description: `Articles in the ${category.name} category.`,
    openGraph: { title: category.name, type: 'website' },
  }
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ cat: string; id: string }> }) {
  const { cat } = await params
  const category = blogData.categories.find((c) => c.slug === cat)
  if (!category) notFound()

  const posts = blogData.posts.filter((p) => p.category === category.name)

  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold mb-2" style={{
          fontSize: '24px',
          color: 'var(--color-text-primary)',
        }}>
          {category.name}
        </h1>
        <p className="text-text-muted text-sm mb-8">
          {posts.length} articles in the {category.name} category.
        </p>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="flex flex-col h-full">
              <div className="h-48 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3 relative overflow-hidden">
                {post.title}
              </div>
              <div className="flex-1">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-badge text-text-primary mb-2">
                  {post.category}
                </span>
                <Link href={`/blog/${post.slug}`} className="no-underline">
                  <h3 className="font-heading font-bold text-text-primary mb-1" style={{ fontSize: '18px', lineHeight: '1.3' }}>{post.title}</h3>
                </Link>
                <p className="text-text-muted text-sm mb-3" style={{ lineHeight: '1.5' }}>{post.excerpt}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-gray-text text-xs">{post.publishedAt}</span>
                  <Link href={`/blog/${post.slug}`} className="no-underline text-primary text-sm font-medium hover:text-primary-hover">
                    Read →
                  </Link>
                </div>
              </div>
            </Card>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-text-muted">No articles in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
