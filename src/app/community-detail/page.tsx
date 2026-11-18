import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { communityStore } from '@/lib/community-store'

export const metadata = {
  title: 'Community detail — SavvyPro',
  description: 'Explore SavvyPro communities and chat groups.',
}

export default function CommunityDetailPage() {
  return (
    <div className="py-10 md:py-14 px-2.5 sm:px-5">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
          Community detail
        </h1>
        <p className="text-text-secondary mb-8">
          Explore our communities and find the right group for you.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communityStore.groups.map((g) => (
            <Card key={g.id} className="p-5 flex flex-col">
              <h2 className="font-heading font-bold text-text-primary mb-1">{g.name}</h2>
              <p className="text-text-secondary text-sm flex-1 mb-4">{g.tagline}</p>
              <Link href={`/community/${g.id}`} className="no-underline">
                <Button variant="outline" size="sm" className="w-full">
                  Open group
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
