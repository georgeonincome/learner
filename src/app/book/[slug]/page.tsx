import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const REF = {
  bgHero: '#090e21',
  bgSurface: '#101b2f',
  bgSurfaceElevated: '#16243e',
  textPrimary: '#f8f7f7',
  textSecondary: '#f7f3f3',
  textMuted: '#5b6475',
  primary: '#00a3ff',
  magenta: '#df1488',
  borderCard: '#64748b',
}

const books = [
  {
    slug: 'zero-to-hero-social-media-manager-book',
    title: 'Zero to Hero Social Media Manager',
    category: 'Social Media',
    description: 'A complete guide to becoming a professional social media manager from scratch.',
    author: 'SavvyPro Team',
    format: 'Ebook',
    price: 49,
    currency: 'USD',
    is_free: false,
    pages: 120,
    preview_chapters: 1,
    chapters: [
      { title: 'The Social Media Landscape', body: 'Social media has transformed how businesses connect with customers.', is_preview: true },
      { title: 'Content Pillars & Planning', body: 'Learn to build a content strategy that resonates with your audience.', is_preview: false },
      { title: 'Community Management', body: 'Building an engaged community requires more than just posting content.', is_preview: false },
      { title: 'Paid Social Advertising', body: 'Take your social media to the next level with paid advertising.', is_preview: false },
      { title: 'Analytics & Reporting', body: 'Measure what matters. Learn to track key metrics.', is_preview: false },
      { title: 'Landing Clients & Pricing', body: 'Turn your social media skills into a business.', is_preview: false },
    ],
  },
]

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<import('next').Metadata> {
  const { slug } = await params
  const book = books.find((b) => b.slug === slug)
  if (!book) return { title: 'Book not found' }
  return {
    title: `${book.title} — Book Details`,
    description: book.description,
    openGraph: { title: `${book.title} — Book Details`, description: book.description, type: 'website' },
  }
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = books.find((b) => b.slug === slug)
  if (!book) notFound()

  const purchased = book.is_free

  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
            BOOK · {book.category}
          </span>
          {book.is_free && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary text-[#151515]">
              FREE
            </span>
          )}
        </div>
        <h1 className="font-heading font-bold" style={{
          fontSize: '34px',
          lineHeight: '1.2',
          marginBottom: '12px',
          color: REF.textPrimary,
        }}>
          {book.title}
        </h1>
        <p className="mb-4" style={{ color: REF.textSecondary, maxWidth: '720px' }}>
          {book.description}
        </p>
        <div className="flex gap-2 flex-wrap items-center mb-4">
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{
            backgroundColor: book.is_free ? REF.primary : REF.magenta,
            color: '#151515',
          }}>
            {book.is_free ? 'Free' : `${book.currency} ${book.price}`}
          </span>
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-surface text-text-muted">
            {book.format} · {book.pages} pages
          </span>
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-surface text-text-muted">
            {book.author}
          </span>
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-surface text-text-muted">
            {book.chapters.length} chapters
          </span>
        </div>
        {!purchased && !book.is_free && (
          <div className="mb-4 p-3 bg-surface border border-border-card rounded-lg" style={{ color: REF.textSecondary }}>
            You are viewing the free preview ({book.preview_chapters} chapter{book.preview_chapters !== 1 ? 's' : ''}). Purchase to read the full book.
          </div>
        )}

        <h2 className="font-heading font-bold mt-6 mb-3" style={{ color: REF.textPrimary }}>
          Chapters ({book.chapters.length})
        </h2>
        <ul className="space-y-2">
          {book.chapters.map((chapter, i) => (
            <li key={i} className="flex justify-between items-center p-2 bg-surface rounded-md border border-border-card">
              <span className="text-text-secondary text-sm">{chapter.title}</span>
              {chapter.is_preview && (
                <span className="text-primary text-xs font-medium">Free preview</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
