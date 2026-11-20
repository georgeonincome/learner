/**
 * Versioned migration runner (audit I5). Applies database/migrations/*.sql
 * in filename order, tracking applied versions in schema_migrations.
 * Run: npx tsx scripts/migrate.ts   (uses TURSO_DATABASE_URL, e.g. file:local.db)
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL || 'file:local.db'
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })

await client.execute(
  `CREATE TABLE IF NOT EXISTS schema_migrations (
     version TEXT PRIMARY KEY,
     applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
   )`,
)
const applied = new Set(
  (await client.execute('SELECT version FROM schema_migrations')).rows.map((r) => String(r.version)),
)

const dir = path.join(process.cwd(), 'database', 'migrations')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
let count = 0
for (const file of files) {
  const version = file.replace(/\.sql$/, '')
  if (applied.has(version)) continue
  const sql = fs.readFileSync(path.join(dir, file), 'utf8')
  // Strip -- line comments BEFORE splitting on ';'. A semicolon inside a comment
  // would otherwise split a statement in half (audit: migration 0003 comment).
  const statements = sql
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
  for (const stmt of statements) {
    try {
      await client.execute(stmt)
    } catch (err) {
      // ALTER TABLE ADD COLUMN is idempotent-hostile: tolerate duplicate column.
      const msg = err instanceof Error ? err.message : String(err)
      if (/duplicate column name/i.test(msg)) continue
      throw new Error(`${file}: ${msg}\nStatement: ${stmt.slice(0, 120)}`)
    }
  }
  await client.execute({ sql: 'INSERT INTO schema_migrations (version) VALUES (?)', args: [version] })
  console.log(`applied ${version} (${statements.length} statements)`)
  count++
}
console.log(count ? `✅ ${count} migration(s) applied to ${url}` : `✅ schema up to date (${url})`)
await client.close()
