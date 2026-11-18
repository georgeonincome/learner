import { NextResponse } from 'next/server'
import { adminStore } from '@/lib/admin-store'
import { getAdminIdentity } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json({ settings: adminStore.settings })
}

export async function POST(req: Request) {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = (await req.json()) as Partial<typeof adminStore.settings>
  Object.assign(adminStore.settings, body)
  return NextResponse.json({ settings: adminStore.settings })
}
