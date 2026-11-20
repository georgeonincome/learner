import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { communityStore } from '@/lib/community-store'

export const metadata = {
  title: 'Community — Lena Learning',
  description: 'Join a Lena Learning chat group, ask questions and learn alongside other members.',
}

export default function CommunityPage() {
  return (
    <div className="py-10 md:py-14 px-2 sm:px-2">
      <div className="mx-auto max-w-[1264px]">
        <h1 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-2">
          Community
        </h1>
        <p className="text-text-secondary mb-8">
          Join a chat group, ask questions, and learn alongside other members.
        </p>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {communityStore.groups.map((g) => (
            <Link
              key={g.id}
              href={`/community/${g.id}`}
              className="no-underline block"
            >
              <Card className="flex flex-col h-full p-5 hover:border-primary transition-colors">
                <h2 className="font-heading font-bold text-text-primary mb-1 text-lg">
                  {g.name}
                </h2>
                <p className="text-text-secondary text-sm mb-4 flex-1">{g.tagline}</p>
                {g.price && (
                  <p className="text-primary font-medium text-sm mb-2">{g.price}</p>
                )}
                <div className="flex gap-4 text-xs text-text-muted border-t border-border pt-3">
                  <span>{g.memberCount} Members</span>
                  <span>{g.channelCount} Channels</span>
                  <span>{g.postCount} Posts</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
