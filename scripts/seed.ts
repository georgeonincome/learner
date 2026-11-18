/**
 * Seed script: loads content from src/content/*.json and seeds Turso + Firestore.
 * Run: npx tsx scripts/seed.ts
 * Requires .env.local with TURSO_DATABASE_URL and Firebase Admin creds.
 */

import { query } from '@/lib/turso'
import { getFirestoreDb } from '@/lib/firestore-server'
import * as fs from 'fs'
import * as path from 'path'

const contentDir = path.join(process.cwd(), 'src/content')

function readJson(file: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'))
}

async function seed() {
  console.log('🌱 Starting seed...')

  // ---- Turso: ensure schema ----
  const schema = fs.readFileSync(path.join(process.cwd(), 'database/schema.sql'), 'utf8')
  const statements = schema.split(';').filter((s) => s.trim())
  for (const stmt of statements) {
    if (stmt.trim()) await query(stmt)
  }
  console.log('✅ Turso schema applied')

  // ---- Seed content (idempotent) ----
  const courses = readJson('courses.json')
  const books = readJson('books.json')
  const home = readJson('home.json')

  console.log(`📚 Courses: ${courses.courses?.length ?? 0}`)
  console.log(`📖 Books: ${books.books?.length ?? 0}`)
  console.log(`🏠 Home paths: ${home.paths?.length ?? 0}, testimonials: ${home.testimonials?.length ?? 0}`)

  // ---- Firestore: seed content collections (idempotent by doc id) ----
  const db = getFirestoreDb()

  // Seed courses into Firestore
  if (courses.courses) {
    const batch = db.batch()
    for (const c of courses.courses) {
      const ref = db.collection('courses').doc(String(c.id))
      batch.set(ref, {
        slug: c.slug,
        title: c.title,
        category: c.category,
        description: c.description,
        price: c.price,
        currency: c.currency || 'usd',
        isPublished: true,
        is_free: c.is_free ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true })
    }
    await batch.commit()
    console.log(`✅ Firestore: seeded ${courses.courses.length} courses`)
  }

  // Seed books into Firestore
  if (books.books) {
    const batch = db.batch()
    for (const b of books.books) {
      const ref = db.collection('books').doc(String(b.id))
      batch.set(ref, {
        slug: b.slug,
        title: b.title,
        category: b.category,
        description: b.description,
        price: b.price,
        currency: b.currency || 'usd',
        isPublished: true,
        is_free: b.is_free ?? false,
        createdAt: new Date(),
      }, { merge: true })
    }
    await batch.commit()
    console.log(`✅ Firestore: seeded ${books.books.length} books`)
  }

  console.log('🎉 Seed complete')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
