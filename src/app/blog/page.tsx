import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import blogData from '@/content/blog.json'

export const metadata = {
  title: 'Blog — SavvyPro',
  description: 'Articles on digital skills, marketing, content creation, and growing your business online.',
}

const posts = blogData.posts
const categories = blogData.categories

export default function BlogPage() {
  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold" style={{
              fontSize: '24px',
              color: 'var(--color-text-primary)',
            }}>
              Blog
            </h1>
            <p className="text-text-muted text-sm">Articles on digital skills, marketing, and growing your business.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search articles…"
              className="w-full sm:w-64"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <Link href="/blog" className="no-underline px-4 py-1.5 rounded-full border border-card bg-surface text-text-primary text-sm font-medium hover:bg-surface-elevated">
            All
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/blog/category/${c.slug}/${c.id}`} className="no-underline px-4 py-1.5 rounded-full border border-card bg-surface text-gray-text text-sm font-medium hover:text-primary hover:border-primary">
              {c.name}
            </Link>
          ))}
        </div>

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
        </div>
      </div>
    </div>
  )
}
