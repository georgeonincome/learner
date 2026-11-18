import { NextResponse } from 'next/server'
import { getAdminIdentity } from '@/lib/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await getAdminIdentity())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  try {
    const { getFirestoreDb } = await import('@/lib/firestore-server')
    const snapshot = await getFirestoreDb().collection('users').limit(200).get()
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json({ users })
  } catch {
    // Firestore not configured in demo mode.
    return NextResponse.json({ users: [] })
  }
}
