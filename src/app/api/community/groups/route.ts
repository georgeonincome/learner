import { NextResponse } from 'next/server'
import { listSpaces } from '@/lib/community'
import { parseJson } from '@/lib/content'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const spaces = await listSpaces()
  return NextResponse.json({
    groups: spaces.map((s) => ({
      id: String(s.id), name: s.name, tagline: s.tagline, description: s.description,
      price: s.access === 'paid' ? 'Paid group' : 'Free',
      memberCount: s.member_count,
      channelCount: parseJson<string[]>(s.channels, ['General']).length,
      postCount: 0,
      channels: parseJson<string[]>(s.channels, ['General']),
    })),
  })
}
