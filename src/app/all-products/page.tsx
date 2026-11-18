import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import coursesData from '@/content/courses.json'
import booksData from '@/content/books.json'

export const metadata = {
  title: 'All Products — SavvyPro',
  description: 'Explore our full catalog of courses, programs and books to build your digital skills and grow your business.',
}

export default function AllProductsPage() {
  const courses = coursesData.courses ?? []
  const books = booksData.books ?? []

  return (
    <div data-layout-section className="py-10 md:py-16 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-heading font-bold" style={{
            fontSize: '30px',
            color: 'var(--color-text-primary)',
          }}>
            All Products
          </h1>
          <p className="text-text-muted text-sm">
            {courses.length + books.length} courses & books
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((c) => (
            <Card key={c.id} className="flex flex-col h-full">
              <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
                {c.title}
              </div>
              <div className="flex-1">
                <Link href={`/course-detail/${c.slug}/${c.id}`} className="no-underline">
                  <h3 className="font-heading font-bold text-text-primary mb-1" style={{ fontSize: '16px' }}>{c.title}</h3>
                </Link>
                <p className="text-text-muted text-sm mb-2" style={{ lineHeight: '1.4' }}>{c.category}</p>
                <div className="flex items-center gap-2">
                  <span className="text-text-primary font-medium">
                    {c.is_free ? 'Free' : `$${c.currency} ${c.price}`}
                  </span>
                  {c.strike_through_price && (
                    <span className="text-gray-text text-xs line-through">
                      {c.currency} {c.strike_through_price}
                    </span>
                  )}
                </div>
              </div>
              <Link href={`/course-detail/${c.slug}/${c.id}`} className="no-underline mt-3 block">
                <Button variant="primary" size="sm" className="w-full">
                  {c.is_free ? 'Enroll Free' : 'Enroll Now'}
                </Button>
              </Link>
            </Card>
          ))}
          {books.map((b) => (
            <Card key={b.id} className="flex flex-col h-full">
              <div className="h-40 flex items-center justify-center rounded-lg bg-surface text-text-muted mb-3">
                {b.title}
              </div>
              <div className="flex-1">
                <Link href={`/book/${b.slug}`} className="no-underline">
                  <h3 className="font-heading font-bold text-text-primary mb-1" style={{ fontSize: '16px' }}>{b.title}</h3>
                </Link>
                <p className="text-text-muted text-sm mb-2" style={{ lineHeight: '1.4' }}>{b.category} · {b.format}</p>
                <div className="flex items-center gap-2">
                  <span className="text-text-primary font-medium">
                    {b.is_free ? 'Free' : `$${b.currency} ${b.price}`}
                  </span>
                </div>
              </div>
              <Link href={`/book/${b.slug}`} className="no-underline mt-3 block">
                <Button variant="primary" size="sm" className="w-full">
                  {b.is_free ? 'Read Free' : 'Buy Now'}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
