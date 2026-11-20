/**
 * compile-blocks.mts — compile every page's reference builder tree (blocks_raw)
 * into original Tailwind blocks (pages.blocks). Run after import-reference.
 * TURSO_DATABASE_URL=file:local.db npx tsx scripts/compile-blocks.mts
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'
import { compilePage } from '../src/lib/blocks/compile'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const rows = (await client.execute('SELECT id, slug, title, blocks_raw FROM pages')).rows
let compiled = 0, empty = 0
const queue: { sql: string; args: unknown[] }[] = []
for (const r of rows) {
  let raw: any = {}
  try { raw = JSON.parse(String(r.blocks_raw ?? '{}')) } catch {}
  const blocks = compilePage(raw, { pageSlug: String(r.slug), pageTitle: String(r.title) })
  if (!blocks.length) empty++
  queue.push({ sql: 'UPDATE pages SET blocks = ?, updated_at = datetime(\'now\') WHERE id = ?', args: [JSON.stringify(blocks), r.id] })
  compiled++
  if (queue.length >= 200) { await client.batch(queue.splice(0), 'write') }
}
if (queue.length) await client.batch(queue.splice(0), 'write')
console.log(`✅ compiled ${compiled} pages (${empty} with empty block trees)`)
await client.close()
