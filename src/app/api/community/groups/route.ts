import { NextResponse } from 'next/server'
import { communityStore } from '@/lib/community-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const groups = communityStore.groups.map((g) => ({
    id: g.id,
    name: g.name,
    tagline: g.tagline,
    description: g.description,
    price: g.price,
    memberCount: g.memberCount,
    channelCount: g.channelCount,
    postCount: g.postCount,
  }))
  return NextResponse.json({ groups })
}
