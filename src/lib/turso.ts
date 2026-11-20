import { createClient } from '@libsql/client'
import type { InArgs } from '@libsql/core/api'

let client: ReturnType<typeof createClient> | undefined

export function getTursoClient() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN
    if (!url) {
      throw new Error('TURSO_DATABASE_URL is required')
    }
    client = createClient({ url, authToken })
  }
  return client
}

export async function query<T = unknown>(sql: string, args: InArgs = []) {
  const c = getTursoClient()
  const { rows } = await c.execute({ sql, args })
  return rows as unknown as T[]
}

/** INSERT helper returning the new rowid (libSQL lastInsertRowid). */
export async function insert(sql: string, args: InArgs = []): Promise<number | undefined> {
  const c = getTursoClient()
  const res = await c.execute({ sql, args })
  const id = (res as any).lastInsertRowid
  return id != null ? Number(id) : undefined
}

export async function getClient() {
  return getTursoClient()
}
