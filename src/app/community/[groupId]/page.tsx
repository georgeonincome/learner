import { notFound } from 'next/navigation'
import { GroupFeed } from '@/components/community/GroupFeed'
import { communityStore } from '@/lib/community-store'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ groupId: string }>
}) {
  const { groupId } = await params
  const group = communityStore.groups.find((g) => g.id === groupId)
  return {
    title: group
      ? `${group.name} (${group.id}) — SavvyPro Community`
      : 'Community — SavvyPro',
    description: group ? `${group.tagline} Community ${group.id} on SavvyPro.` : undefined,
  }
}

export default async function CommunityGroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>
}) {
  const { groupId } = await params
  const group = communityStore.groups.find((g) => g.id === groupId)
  if (!group) notFound()

  return (
    <GroupFeed
      group={{
        id: group.id,
        name: group.name,
        tagline: group.tagline,
        memberCount: group.memberCount,
        channelCount: group.channelCount,
        postCount: group.postCount,
        channels: group.channels,
      }}
    />
  )
}
