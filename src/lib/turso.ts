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

export async function getClient() {
  return getTursoClient()
}
