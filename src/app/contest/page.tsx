import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Contest — SavvyPro',
  description: 'Enter the SavvyPro contest and win a book.',
}

export default function ContestPage() {
  return (
    <div className="py-10 md:py-16 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[900px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-6">
          Contest
        </h1>
        <Card className="p-8 text-center">
          <h2 className="font-heading font-bold text-xl text-text-primary mb-3">
            Win a book
          </h2>
          <p className="text-text-secondary mb-6">
            Enter our contest for a chance to win a book and a free digital
            skills resource.
          </p>
          <Link href="/win-a-book" className="no-underline">
            <Button variant="primary" size="md">
              Enter the contest
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
