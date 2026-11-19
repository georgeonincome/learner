import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

// Deterministic local DB for integration tests; no external services needed.
const dbFile = path.join(process.cwd(), '.tmp-test.db')
if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile)

process.env.TURSO_DATABASE_URL = `file:${dbFile}`
process.env.STRIPE_SECRET_KEY = 'sk_test_local_integration'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_local_integration'
process.env.NEXT_PUBLIC_BASE_URL = 'http://127.0.0.1:3000'

const client = createClient({ url: process.env.TURSO_DATABASE_URL })
const schema = fs.readFileSync(path.join(process.cwd(), 'database/schema.sql'), 'utf8')
for (const statement of schema.split(';')) {
  if (statement.trim()) await client.execute(statement)
}
await client.close()
