import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSpaceById } from '@/lib/community'
import { parseJson } from '@/lib/content'
import { GroupFeed } from '@/components/community/GroupFeed'
import { AppSurface } from '@/components/layout/AppSurface'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const space = await getSpaceById(id)
  return { title: space ? `${space.name} — Community` : 'Community' }
}

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const space = await getSpaceById(id)
  if (!space) notFound()
  return (
    <AppSurface>
      <main className="py-8 md:py-12 px-2 sm:px-4">
        <div className="mx-auto max-w-[1264px]">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/dashboard" className="no-underline text-[var(--color-text-secondary)]">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <Link href="/dashboard/community" className="no-underline text-[var(--color-text-secondary)]">Community</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-[var(--color-text-primary)] font-medium">{space.name}</span>
          </nav>
          <GroupFeed group={{
            id: String(space.id), name: space.name, tagline: space.tagline,
            memberCount: space.member_count,
            channelCount: parseJson<string[]>(space.channels, ['General']).length,
            postCount: 0,
            channels: parseJson<string[]>(space.channels, ['General']),
          }} />
        </div>
      </main>
    </AppSurface>
  )
}
