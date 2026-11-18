import booksData from '@/content/books.json'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const REF = {
  bgSurface: '#101b2f',
  bgSurfaceElevated: '#16243e',
  textPrimary: '#f8f7f7',
  textSecondary: '#f7f3f3',
  textMuted: '#5b6475',
  primary: '#00a3ff',
  magenta: '#df1488',
  borderCard: '#64748b',
}

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Books',
  description: 'Explore our library of ebooks on digital skills and business growth. Read free books or purchase premium titles.',
}

export default function BooksPage() {
  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-heading font-bold" style={{
            fontSize: '43px',
            color: REF.textPrimary,
          }}>
            Books
          </h1>
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
            {booksData.books.length} books
          </span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {booksData.books.map((b) => (
            <div key={b.slug} className="flex-1 min-w-[260px] flex-col h-full border border-border-card rounded-xl bg-surface-elevated p-3" style={{ flexBasis: '25%' }}>
              <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
                {b.title}
              </div>
              <div className="flex flex-col gap-2 flex-grow-1">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-border-card text-white">
                  {b.category}
                </span>
                <h3 className="font-heading font-bold" style={{ fontSize: '18px', color: REF.textPrimary }}>
                  {b.title}
                </h3>
                <p className="flex-1 text-text-secondary text-sm line-clamp-2">{b.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-heading font-bold" style={{ color: b.is_free ? REF.primary : REF.textPrimary }}>
                    {b.is_free ? 'Free' : `${b.currency} ${b.price}`}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-surface text-text-muted">
                    {b.format} · {b.pages}pp
                  </span>
                </div>
                <Link href={`/book/${b.slug}`} className="no-underline w-full">
                  <Button variant={b.is_free ? 'primary' : 'outline'} size="md" className="w-full">
                    {b.is_free ? 'Read Free' : 'View Details'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
