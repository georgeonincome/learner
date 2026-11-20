import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPost, listPosts, listCategories } from '@/lib/content'
import { buildMetadata, blogPostingLd, breadcrumbLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Footer } from '@/components/layout/Footer'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const { posts } = await listPosts({ pageSize: 500 })
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return buildMetadata({ title: 'Post not found', description: 'This article does not exist.', path: `/blog/${slug}`, noIndex: true })
  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    path: `/blog/${slug}`,
    ogImage: post.og_image,
    noIndex: !!post.no_index,
    type: 'article',
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post || post.status !== 'published') notFound()
  const cats = await listCategories()
  const cat = cats.find((c) => c.id === post.category_id)
  const { posts: recent } = await listPosts({ pageSize: 4 })
  const related = recent.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <SiteHeader />
      <main id="__next-content" className="bg-[var(--color-bg-hero)]">
        <article className="mx-auto max-w-[760px] px-4 py-12 md:py-16">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex gap-2 flex-wrap">
            <Link href="/" className="no-underline hover:text-[var(--color-primary-text)]">Home</Link><span>/</span>
            <Link href="/blog" className="no-underline hover:text-[var(--color-primary-text)]">Blog</Link>
            {cat ? <><span>/</span><Link href={`/blog/category/${cat.slug}/${cat.id}`} className="no-underline hover:text-[var(--color-primary-text)]">{cat.name}</Link></> : null}
          </nav>
          {cat ? <p className="text-xs uppercase tracking-wide text-[var(--color-primary-text)] mb-3">{cat.name}</p> : null}
          <h1 className="font-heading font-bold text-[var(--color-text-primary)] text-3xl md:text-4xl leading-tight mb-4">{post.title}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">By {post.author} · {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="lena-prose text-[var(--color-text-secondary)] leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: post.body }} />
        </article>
        {related.length ? (
          <section className="mx-auto max-w-[1000px] px-4 pb-16">
            <h2 className="font-heading font-bold text-xl text-[var(--color-text-primary)] mb-6">Keep reading</h2>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="no-underline rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 hover:border-[var(--color-primary)] transition-colors">
                  <span className="font-heading font-bold text-[var(--color-text-primary)] leading-snug block mb-2">{p.title}</span>
                  <span className="text-sm text-[var(--color-text-muted)]">{p.excerpt}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <JsonLd data={[
        blogPostingLd({ title: post.title, description: post.excerpt, slug: post.slug, author: post.author, datePublished: post.created_at, dateModified: post.updated_at }),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]),
      ]} />
    </>
  )
}
