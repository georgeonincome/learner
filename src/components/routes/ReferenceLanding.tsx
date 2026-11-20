import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

/**
 * Shared landing shell for the reference sitemap routes whose detailed
 * content was not capturable. Keeps the same visual structure (nav-style
 * hero, content card, related links) with original copy and a unique title.
 */
export function ReferenceLanding({
  title,
  description,
  sectionTitle = 'Explore more',
}: {
  title: string
  description?: string
  sectionTitle?: string
}) {
  return (
    <div className="px-2 sm:px-2 pb-16">
      <section className="bg-hero py-16">
        <div className="mx-auto max-w-[1000px]">
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-text-primary mb-4">
            {title}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-[760px]">
            {description ??
              `Explore ${title} on Lena Learning — practical digital skills, training and support for people building what comes next.`}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/courses" className="no-underline">
              <Button variant="primary" size="md">
                Browse courses
              </Button>
            </Link>
            <Link href="/all-products" className="no-underline">
              <Button variant="outline" size="md">
                All products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1000px] pt-14">
        <Card className="p-6">
          <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">
            {sectionTitle}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            This page is part of the rebuilt Lena Learning platform. Course, book and
            program details are available through the catalog and product pages.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/books" className="no-underline text-primary text-sm font-medium">
              Books →
            </Link>
            <Link href="/blog" className="no-underline text-primary text-sm font-medium">
              Blog →
            </Link>
            <Link href="/community" className="no-underline text-primary text-sm font-medium">
              Community →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
