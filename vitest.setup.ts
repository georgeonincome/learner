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
// Run the SAME versioned migrations as production (scripts/migrate.mts) so the
// test schema can never drift from the app schema (audit I5).
const dir = path.join(process.cwd(), 'database/migrations')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
for (const file of files) {
  const sql = fs.readFileSync(path.join(dir, file), 'utf8')
  // Strip -- line comments first: a ';' inside a comment otherwise splits a
  // statement in half and produces a SQLite syntax error (migration 0003).
  const statements = sql
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
  for (const stmt of statements) {
    await client.execute(stmt)
  }
}
await client.close()
