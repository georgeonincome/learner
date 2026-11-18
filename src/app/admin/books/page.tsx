import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import booksData from '@/content/books.json'

export const metadata = { title: 'Books — Admin — SavvyPro' }

export default function AdminBooksPage() {
  const books = booksData.books ?? []
  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-text-primary mb-6">Books</h2>
      <Card className="p-5">
        <h3 className="font-heading font-bold text-text-primary mb-4">Catalog ({books.length})</h3>
        <div className="space-y-2">
          {books.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border-card">
              <div className="min-w-0">
                <p className="text-text-primary font-medium truncate">{b.title}</p>
                <p className="text-text-muted text-xs truncate">{b.category} · {b.format} · {b.currency} {b.price}</p>
              </div>
              <a href={`/book/${b.slug}`} className="no-underline shrink-0">
                <Button size="sm" variant="outline">View</Button>
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
