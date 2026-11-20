import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategory, listPosts, listCategories } from '@/lib/content'
import { buildMetadata, collectionPageLd, breadcrumbLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Footer } from '@/components/layout/Footer'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const cats = await listCategories()
  return cats.map((c) => ({ cat: c.slug, id: String(c.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string; id: string }> }): Promise<Metadata> {
  const { cat, id } = await params
  const category = await getCategory(cat) ?? await getCategory(id)
  if (!category) return buildMetadata({ title: 'Category not found', description: 'This category does not exist.', path: `/blog/category/${cat}/${id}`, noIndex: true })
  return buildMetadata({
    title: `${category.name} articles`,
    description: category.description || `Articles on ${category.name.toLowerCase()} from Lena.`,
    path: `/blog/category/${category.slug}/${category.id}`,
  })
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ cat: string; id: string }> }) {
  const { cat, id } = await params
  const category = await getCategory(cat) ?? await getCategory(id)
  if (!category) notFound()
  const { posts } = await listPosts({ categoryId: category.id, pageSize: 100 })
  const cats = await listCategories()

  return (
    <>
      <SiteHeader />
      <main id="__next-content" className="bg-[var(--color-bg-hero)]">
        <div className="mx-auto max-w-[1100px] px-4 py-12 md:py-16">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex gap-2 flex-wrap">
            <Link href="/" className="no-underline hover:text-[var(--color-primary-text)]">Home</Link><span>/</span>
            <Link href="/blog" className="no-underline hover:text-[var(--color-primary-text)]">Blog</Link><span>/</span>
            <span>{category.name}</span>
          </nav>
          <h1 className="font-heading font-bold text-[var(--color-text-primary)] text-3xl md:text-4xl mb-3">{category.name}</h1>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-2xl">{category.description}</p>
          <div className="flex gap-2 flex-wrap mb-10">
            {cats.map((c) => (
              <Link key={c.id} href={`/blog/category/${c.slug}/${c.id}`}
                className={`no-underline text-sm px-4 py-1.5 rounded-full border transition-colors ${c.id === category.id ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'border-[var(--color-border-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'}`}>
                {c.name}
              </Link>
            ))}
          </div>
          {posts.length === 0 ? (
            <p className="text-[var(--color-text-muted)] py-12 text-center">No articles in this category yet.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="no-underline rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 flex flex-col gap-3 hover:border-[var(--color-primary)] transition-colors">
                  <span className="font-heading font-bold text-lg text-[var(--color-text-primary)] leading-snug">{p.title}</span>
                  <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{p.excerpt}</span>
                  <span className="text-sm font-medium text-[var(--color-primary-text)] mt-auto">Read article →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <JsonLd data={[
        collectionPageLd({ name: category.name, description: category.description, path: `/blog/category/${category.slug}/${category.id}`, items: posts.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })) }),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: category.name, path: `/blog/category/${category.slug}/${category.id}` }]),
      ]} />
    </>
  )
}
