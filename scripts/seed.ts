/**
 * Seed CLI (audit G26/G27): applies migrations then imports the full reference
 * dataset into Turso. Idempotent. Run: npx tsx scripts/seed.ts
 * Requires TURSO_DATABASE_URL (default file:local.db). No production keys.
 *
 * Supersedes the old flat Firestore seed (audit I6/I9): Turso is authoritative
 * for content; Firestore is only the realtime community projection (M8).
 */
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const root = process.cwd()
const env = { ...process.env, TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL || 'file:local.db' }
console.log('🌱 seed: migrate →', env.TURSO_DATABASE_URL)
execFileSync('npx', ['tsx', path.join(root, 'scripts/migrate.mts')], { stdio: 'inherit', env })
console.log('🌱 seed: import reference dataset (32 courses / 305 chapters / 1106 lessons)')
execFileSync('npx', ['tsx', path.join(root, 'scripts/import-reference.mts')], { stdio: 'inherit', env })
console.log('🎉 seed complete')
