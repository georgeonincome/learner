import Link from 'next/link'
import type { Metadata } from 'next'
import { listPosts, listCategories } from '@/lib/content'
import { buildMetadata, collectionPageLd, breadcrumbLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Footer } from '@/components/layout/Footer'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Blog — tips & strategies for digital business',
  description: 'Practical articles on freelancing, content creation, digital marketing and growing an online business from Lena.',
  path: '/blog',
})

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; category?: string }> }) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const cats = await listCategories()
  const catId = sp.category ? cats.find((c) => c.slug === sp.category)?.id : undefined
  const { posts, total, pages } = await listPosts({ page, pageSize: 12, categoryId: catId })
  const q = (sp.q ?? '').toLowerCase()
  const filtered = q ? posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)) : posts

  return (
    <>
      <SiteHeader />
      <main id="__next-content" className="bg-[var(--color-bg-hero)]">
        <div className="mx-auto max-w-[1100px] px-4 py-12 md:py-16">
          <h1 className="font-heading font-bold text-[var(--color-text-primary)] text-3xl md:text-4xl mb-3">Digital Growth, Simplified.</h1>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-2xl">Tips, strategies and stories on freelancing, content creation, marketing and building an online business.</p>
          <form action="/blog" method="get" className="flex gap-2 flex-wrap mb-8">
            <input name="q" defaultValue={sp.q ?? ''} placeholder="Search articles…" className="flex-1 min-w-[220px] rounded-[8px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]" />
            <button type="submit" className="rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium px-5 py-2.5 cursor-pointer">Search</button>
          </form>
          <div className="flex gap-2 flex-wrap mb-10">
            <Link href="/blog" className={`no-underline text-sm px-4 py-1.5 rounded-full border ${!catId ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'border-[var(--color-border-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'}`}>All</Link>
            {cats.map((c) => (
              <Link key={c.id} href={`/blog/category/${c.slug}/${c.id}`} className={`no-underline text-sm px-4 py-1.5 rounded-full border ${catId === c.id ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'border-[var(--color-border-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'}`}>{c.name}</Link>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="text-[var(--color-text-muted)] py-12 text-center">No articles found{q ? ` for “${sp.q}”` : ''}.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="no-underline rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5 flex flex-col gap-3 hover:border-[var(--color-primary)] transition-colors">
                  <span className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">{cats.find((c) => c.id === p.category_id)?.name ?? 'Blog'}</span>
                  <span className="font-heading font-bold text-lg text-[var(--color-text-primary)] leading-snug">{p.title}</span>
                  <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{p.excerpt}</span>
                  <span className="text-sm font-medium text-[var(--color-primary-text)] mt-auto">Read article →</span>
                </Link>
              ))}
            </div>
          )}
          {pages > 1 ? (
            <div className="flex gap-2 justify-center mt-12">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={`/blog?page=${n}${q ? `&q=${encodeURIComponent(sp.q!)}` : ''}`} className={`no-underline w-9 h-9 flex items-center justify-center rounded-[8px] border text-sm ${n === page ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'border-[var(--color-border-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'}`}>{n}</Link>
              ))}
            </div>
          ) : null}
          <p className="text-xs text-[var(--color-text-muted)] text-center mt-6">{total} article{total === 1 ? '' : 's'}</p>
        </div>
      </main>
      <Footer />
      <JsonLd data={[
        collectionPageLd({ name: 'Lena Blog', description: 'Tips and strategies for digital business.', path: '/blog', items: posts.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })) }),
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]),
      ]} />
    </>
  )
}
