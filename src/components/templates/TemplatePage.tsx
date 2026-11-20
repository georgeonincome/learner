import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Footer } from '@/components/layout/Footer'
import brand from '@/content/brand.json'
import coursesData from '@/content/courses.json'
import booksData from '@/content/books.json'
import blogData from '@/content/blog.json'
import { debrand } from '@/lib/brand'

/**
 * Original Tailwind templates (Decision 1). No captured markup, vendor CSS or
 * reference class names — only structural measurements from docs/UI-SPEC/*.
 * Copy is debranded at render; step 5 replaces it with editable original seed.
 */

const SECTION = 'mx-auto w-full max-w-[1320px] px-4 sm:px-6'
const H1 = 'font-heading text-[28px] leading-tight font-bold text-[var(--color-text-primary)] md:text-[50px]'
const H2 = 'font-heading text-[24px] leading-tight font-bold text-[var(--color-text-primary)] md:text-[36px]'
const BODY = 'text-sm leading-7 text-[var(--color-text-secondary)] md:text-base'
const BTN = 'no-underline inline-flex items-center justify-center rounded-[10px] bg-[var(--color-cta)] px-5 py-3 text-sm font-semibold text-[var(--color-cta-text)] transition-colors hover:bg-[var(--color-cta-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]'
const BTN_ALT = 'no-underline inline-flex items-center justify-center rounded-[10px] border border-[var(--color-border-card)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-surface-elevated)]'
const CARD = 'rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5'
const EYEBROW = 'text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-text)]'

type Course = { id: number; slug: string; title: string; category: string; description: string; price: number; currency: string; is_free: boolean; thumbnail: string }
type Book = { id: number; slug: string; title: string; author: string; description: string; format: string; price: number; currency: string; is_free: boolean; cover_image: string }
type Post = { slug: string; title: string; excerpt: string; category: string; publishedAt: string; coverImage: string }

const courses = (coursesData as { courses: Course[] }).courses ?? []
const books = (booksData as { books: Book[] }).books ?? []
const posts = (blogData as { posts: Post[] }).posts ?? []

function money(amount: number, currency: string) {
  return amount <= 0 ? 'Free' : `${currency} ${amount.toFixed(2)}`
}

function Hero({ eyebrow, title, text, primary, secondary }: {
  eyebrow: string; title: string; text: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string }
}) {
  return (
    <section className="border-b border-[var(--color-border-card)] bg-[var(--color-bg-hero)] py-16 md:py-24">
      <div className={SECTION}>
        <p className={`${EYEBROW} mb-3`}>{eyebrow}</p>
        <h1 className={`${H1} max-w-3xl`}>{title}</h1>
        <p className={`${BODY} mt-5 max-w-2xl`}>{text}</p>
        {primary || secondary ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {primary ? <Link className={BTN} href={primary.href}>{primary.label}</Link> : null}
            {secondary ? <Link className={BTN_ALT} href={secondary.href}>{secondary.label}</Link> : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function CardGrid({ title, items }: { title: string; items: { title: string; text: string; meta: string; href: string; image: string; price: string }[] }) {
  return (
    <section className="py-14 md:py-20">
      <div className={SECTION}>
        <h2 className={`${H2} mb-8`}>{title}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="no-underline">
              <article className={`${CARD} h-full transition-colors hover:border-[var(--color-primary)]`}>
                <img src={item.image} alt="" className="mb-4 aspect-video w-full rounded-lg object-cover" loading="lazy" />
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-primary-text)]">{item.meta}</p>
                <h3 className="mt-1 font-heading text-base font-bold text-[var(--color-text-primary)]">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--color-text-secondary)]">{item.text}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--color-text-primary)]">{item.price}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomeTemplate() {
  const stats = [
    { value: '3,800+', label: 'Learners' },
    { value: '30+', label: 'Countries' },
    { value: '32', label: 'Courses' },
    { value: '10', label: 'Books' },
  ]
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-bg-hero)] py-20 md:py-[100px]">
        <div className={SECTION}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className={`${EYEBROW} mb-4`}>{debrand(brand.tagline)}</p>
              <h1 className={H1}>Build practical digital skills and a business that lasts.</h1>
              <p className={`${BODY} mt-6 max-w-2xl`}>
                Learn the tools, follow a clear path and get the support you need to turn
                what you know into real income.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link className={BTN} href="/courses">Explore courses</Link>
                <Link className={BTN_ALT} href="/choose-your-path">Find your path</Link>
              </div>
              <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-heading text-2xl font-bold text-[var(--color-text-primary)] md:text-[30px]">{s.value}</dt>
                    <dd className="mt-1 text-xs uppercase tracking-wide text-[var(--color-text-muted)]">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className={SECTION}>
          <h2 className={`${H2} mb-4`}>Choose where to begin</h2>
          <p className={`${BODY} mb-8 max-w-2xl`}>Pick a path that matches where you are today.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Start where you are', href: '/path-landing-getting-started', text: 'New to online work? Build the foundations first.' },
              { title: 'Build your expert business', href: '/path-landing-build-expert', text: 'Package your knowledge into an offer people want.' },
              { title: 'Grow what you have', href: '/path-landing-grow-my-business', text: 'Systems and marketing for an existing business.' },
            ].map((p) => (
              <Link key={p.href} href={p.href} className="no-underline">
                <article className={`${CARD} h-full hover:border-[var(--color-primary)]`}>
                  <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)]">{p.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{p.text}</p>
                  <p className="mt-5 text-sm font-semibold text-[var(--color-primary-text)]">Explore path →</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CardGrid
        title="Popular courses"
        items={courses.slice(0, 8).map((c) => ({
          title: debrand(c.title), text: debrand(c.description), meta: debrand(c.category),
          href: `/course-detail/${c.slug}/${c.id}`, image: c.thumbnail || '/placeholder.svg', price: money(c.price, c.currency),
        }))}
      />

      <section className="border-y border-[var(--color-border-card)] bg-[var(--color-bg-surface)] py-14 md:py-20">
        <div className={SECTION}>
          <h2 className={`${H2} mb-8`}>What learners say</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              'The steps were clear and I could follow them while working full time.',
              'I finally have a system for creating content instead of guessing every day.',
              'The community made the difference — real answers from real people.',
            ].map((quote) => (
              <blockquote key={quote} className={`${CARD} m-0`}>
                <p className="text-sm leading-7 text-[var(--color-text-secondary)]">“{quote}”</p>
                <footer className="mt-4 text-xs text-[var(--color-text-muted)]">Lena learner</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className={SECTION}>
          <div className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] p-8 text-center md:p-14">
            <h2 className={H2}>Start learning today</h2>
            <p className={`${BODY} mx-auto mt-3 max-w-xl`}>Choose a free course or book and build momentum this week.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link className={BTN} href="/free">Explore free learning</Link>
              <Link className={BTN_ALT} href="/books">Browse books</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function CatalogTemplate() {
  return (
    <>
      <Hero eyebrow="Catalog" title="Courses that build real skills" text="Browse the full library and pick the next skill you want to learn." />
      <section className="py-12 md:py-16">
        <div className={SECTION}>
          <form role="search" className="mb-8 flex flex-wrap gap-3" action="/courses">
            <label htmlFor="catalog-search" className="sr-only">Search courses</label>
            <input id="catalog-search" name="q" type="search" placeholder="Search courses"
              className="min-w-64 flex-1 rounded-lg border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)]" />
            <button type="submit" className={BTN}>Search</button>
          </form>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.slice(0, 12).map((c) => (
              <Link key={c.id} href={`/course-detail/${c.slug}/${c.id}`} className="no-underline">
                <article className={`${CARD} h-full hover:border-[var(--color-primary)]`}>
                  <img src={c.thumbnail || '/placeholder.svg'} alt="" className="mb-4 aspect-video w-full rounded-lg object-cover" loading="lazy" />
                  <p className="text-xs uppercase tracking-wide text-[var(--color-primary-text)]">{debrand(c.category)}</p>
                  <h2 className="mt-1 font-heading text-base font-bold text-[var(--color-text-primary)]">{debrand(c.title)}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]">{debrand(c.description)}</p>
                  <p className="mt-4 font-semibold text-[var(--color-text-primary)]">{money(c.price, c.currency)}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function BooksTemplate() {
  return (
    <>
      <Hero eyebrow="Library" title="Books and guides for practical work" text="Free and paid titles you can read online or download to your library." />
      <section className="py-12 md:py-16">
        <div className={SECTION}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.slice(0, 6).map((b) => (
              <Link key={b.id} href={`/read/${b.slug}`} className="no-underline">
                <article className={`${CARD} h-full hover:border-[var(--color-primary)]`}>
                  <img src={b.cover_image || '/placeholder.svg'} alt="" className="mb-4 aspect-[3/4] w-full rounded-lg object-cover" loading="lazy" />
                  <p className="text-xs uppercase tracking-wide text-[var(--color-primary-text)]">{debrand(b.format)}</p>
                  <h2 className="mt-1 font-heading text-base font-bold text-[var(--color-text-primary)]">{debrand(b.title)}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-secondary)]">{debrand(b.description)}</p>
                  <p className="mt-4 font-semibold text-[var(--color-text-primary)]">{money(b.price, b.currency)}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function BlogTemplate() {
  return (
    <>
      <Hero eyebrow="Journal" title="Notes on digital work" text="Practical writing on learning, selling and building an independent income." />
      <section className="py-12 md:py-16">
        <div className={SECTION}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 12).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="no-underline">
                <article className={`${CARD} h-full hover:border-[var(--color-primary)]`}>
                  <img src={p.coverImage || '/placeholder.svg'} alt="" className="mb-4 aspect-video w-full rounded-lg object-cover" loading="lazy" />
                  <p className="text-xs uppercase tracking-wide text-[var(--color-primary-text)]">{debrand(p.category)} · {p.publishedAt}</p>
                  <h2 className="mt-2 font-heading text-lg font-bold text-[var(--color-text-primary)]">{debrand(p.title)}</h2>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{debrand(p.excerpt)}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function LegalTemplate({ title }: { title: string }) {
  return (
    <>
      <Hero eyebrow="Information" title={title} text="Clear terms for using this site and its learning materials." />
      <section className="py-12 md:py-16">
        <div className={`${SECTION} max-w-3xl space-y-8`}>
          {['Overview', 'Your use of this site', 'Payments and refunds', 'Contact'].map((h) => (
            <div key={h}>
              <h2 className="mb-2 font-heading text-lg font-bold text-[var(--color-text-primary)]">{h}</h2>
              <p className={BODY}>
                This page is an editable placeholder. Replace it with the final {title.toLowerCase()} in the CMS before launch.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function PathTemplate({ title }: { title: string }) {
  return (
    <>
      <Hero eyebrow="Learning path" title={title} text="A clear sequence of lessons and actions so you always know what comes next." primary={{ label: 'Browse courses', href: '/courses' }} />
      <section className="py-14 md:py-20">
        <div className={SECTION}>
          <h2 className={`${H2} mb-8`}>How this path works</h2>
          <ol className="m-0 grid list-none gap-5 p-0 md:grid-cols-3">
            {['Learn the foundations', 'Practise with a real project', 'Apply it to your own work'].map((s, i) => (
              <li key={s} className={CARD}>
                <p className="font-heading text-3xl font-bold text-[var(--color-primary-text)]">0{i + 1}</p>
                <h3 className="mt-2 font-heading text-lg font-bold text-[var(--color-text-primary)]">{s}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Work at your own pace and revisit any lesson when you need to.</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

function LeadTemplate({ title }: { title: string }) {
  return (
    <>
      <Hero eyebrow="Free resource" title={title} text="Get a practical guide delivered straight to your inbox." />
      <section className="py-14 md:py-20">
        <div className={`${SECTION} max-w-xl`}>
          <form action="/api/leads/claim" method="post" className={CARD}>
            <label htmlFor="lead-email" className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">Email address</label>
            <input id="lead-email" name="email" type="email" required className="mb-4 w-full rounded-lg border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] px-4 py-3 text-sm text-[var(--color-text-primary)]" />
            <input name="slug" type="hidden" value={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} />
            <button type="submit" className={BTN}>Send me the guide</button>
          </form>
        </div>
      </section>
    </>
  )
}

function GenericTemplate({ title }: { title: string }) {
  return (
    <>
      <Hero eyebrow={brand.name} title={title} text={debrand(brand.description)} />
      <section className="py-14 md:py-20">
        <div className={`${SECTION} max-w-3xl`}>
          <p className={BODY}>
            This page is part of the Lena learning platform. Courses, books and coaching are
            built to help you learn a skill and apply it in your own work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={BTN} href="/courses">Browse courses</Link>
            <Link className={BTN_ALT} href="/dashboard">Go to dashboard</Link>
          </div>
        </div>
      </section>
    </>
  )
}

function templateFor(slug: string, hint?: string): React.ReactNode {
  const h = (hint || '').toLowerCase()
  const s = slug.toLowerCase()
  if (h === 'home' || s === '') return <HomeTemplate />
  if (['catalog', 'courses', 'all-products', 'mini-courses', 'free'].includes(h) || ['courses', 'all-products', 'mini-courses', 'free'].includes(s)) return <CatalogTemplate />
  if (h === 'books' || s === 'books' || s === 'ebooks') return <BooksTemplate />
  if (h.startsWith('blog') || s.startsWith('blog')) return <BlogTemplate />
  if (['legal', 'page'].includes(h) || /privacy|terms|refund|policy/.test(s)) return <LegalTemplate title={slug.replace(/-/g, ' ')} />
  if (h === 'path-landing' || s.startsWith('path-landing') || s.startsWith('learn-') || s === 'build-your-expert-business' || s === 'grow-my-business' || s === 'business-solutions') return <PathTemplate title={slug.replace(/-/g, ' ')} />
  if (h === 'lead-magnet' || /book$|pdf|download|freebies|win-a-book|signup/.test(s)) return <LeadTemplate title={slug.replace(/-/g, ' ')} />
  return <GenericTemplate title={slug.replace(/-/g, ' ')} />
}

/** Server wrapper used by every public route. */
export function TemplatePage({ slug, hint, children }: { slug: string; hint?: string; children?: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="__next-content">{children ?? templateFor(slug, hint)}</main>
      <Footer />
    </>
  )
}
