/**
 * Replace reference-derived seed copy with original, clearly-labelled sample
 * content and attach small local media fixtures so the lesson player, books
 * reader and protected download are testable end to end.
 *
 * Run: TURSO_DATABASE_URL=file:local.db npx tsx scripts/seed-original.mts
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const PAID = [19, 29, 49]
const pad = (n: number) => String(n).padStart(2, '0')

const coursesPath = path.join(process.cwd(), 'src', 'content', 'courses.json')
const booksPath = path.join(process.cwd(), 'src', 'content', 'books.json')
const blogPath = path.join(process.cwd(), 'src', 'content', 'blog.json')

type Course = Record<string, any>
type Book = Record<string, any>
type Post = Record<string, any>

const courses = ((JSON.parse(fs.readFileSync(coursesPath, 'utf8')) as { courses: Course[] }).courses)
const books = ((JSON.parse(fs.readFileSync(booksPath, 'utf8')) as { books: Book[] }).books)
const posts = ((JSON.parse(fs.readFileSync(blogPath, 'utf8')) as { posts: Post[] }).posts)

courses.forEach((c, i) => {
  const label = `Course ${pad(i + 1)}`
  const price = c.is_free ? 0 : PAID[i % PAID.length]
  c.title = `${label} — Practical Digital Skills`
  c.category = ['Digital Skills', 'Business', 'Content', 'Marketing'][i % 4]
  c.description = `Original sample content for ${label}. An editor can replace this with the real lesson material in the CMS.`
  c.short_description = `${label}: a hands-on introduction with short, practical lessons.`
  c.curriculum_sample = ['Getting started', 'Core ideas', 'Practice exercise', 'Next steps']
  c.price = price
  c.strike_through_price = price ? price + 10 : null
  c.thumbnail = '/placeholder.svg'
})
books.forEach((b, i) => {
  const label = `Guide ${pad(i + 1)}`
  b.title = `${label} — A Practical Guide`
  b.author = 'Lena Editorial Team'
  b.description = `Original sample book content for ${label}. Replace the chapters and cover in the CMS.`
  b.cover_image = '/placeholder.svg'
  b.price = b.is_free ? 0 : PAID[i % PAID.length]
  b.chapters = [
    { title: 'Introduction', body: `This is original sample content for ${label}. It is safe to edit or replace.` },
    { title: 'Chapter 1 — The basics', body: 'Work through the basics, then apply one small action to your own project.' },
  ]
})
posts.forEach((p, i) => {
  p.title = `Field note ${pad(i + 1)} — learning digital skills`
  p.excerpt = 'An original sample article. Edit the body and title in the CMS before publication.'
  p.content = 'This is original placeholder content. Replace it with your own article in the CMS.'
  p.coverImage = '/placeholder.svg'
})

fs.writeFileSync(coursesPath, JSON.stringify({ courses }, null, 2) + '\n')
fs.writeFileSync(booksPath, JSON.stringify({ books }, null, 2) + '\n')
fs.writeFileSync(blogPath, JSON.stringify({ posts }, null, 2) + '\n')

// -- Database: copy-safe updates ------------------------------------------------
for (const c of courses) {
  await client.execute({
    sql: 'UPDATE courses SET title = ?, category = ?, description = ?, short_description = ?, cover_media_id = NULL WHERE id = ?',
    args: [c.title, c.category, c.description, c.short_description, c.id],
  })
  await client.execute({
    sql: 'UPDATE prices SET price = ?, strike_through = ? WHERE entity_type = ? AND entity_id = ?',
    args: [c.price, c.strike_through_price, 'course', c.id],
  })
}
for (const b of books) {
  await client.execute({
    sql: 'UPDATE books SET title = ?, author = ?, description = ?, chapters = ?, cover_media_id = NULL WHERE id = ?',
    args: [b.title, b.author, b.description, JSON.stringify(b.chapters), b.id],
  })
  await client.execute({
    sql: 'UPDATE prices SET price = ? WHERE entity_type = ? AND entity_id = ?',
    args: [b.price, 'book', b.id],
  })
}
for (const p of posts) {
  await client.execute({
    sql: 'UPDATE blog_posts SET title = ?, excerpt = ?, body = ?, cover_media_id = NULL WHERE slug = ?',
    args: [p.title, p.excerpt, p.content, p.slug],
  })
}

// -- Sample media fixtures -------------------------------------------------------
const fixtures = [
  { id: 'sample-video', url: '/sample/sample-video.mp4', filename: 'sample-video.mp4', mime: 'video/mp4' },
  { id: 'sample-audio', url: '/sample/sample-audio.wav', filename: 'sample-audio.wav', mime: 'audio/wav' },
  { id: 'sample-pdf', url: '/sample/sample-lesson.pdf', filename: 'sample-lesson.pdf', mime: 'application/pdf' },
  { id: 'sample-book', url: '/sample/sample-book.pdf', filename: 'sample-book.pdf', mime: 'application/pdf' },
]
for (const f of fixtures) {
  await client.execute({
    sql: `INSERT INTO media (id, driver, url, filename, mime, bytes, uploaded_by) VALUES (?, 'local', ?, ?, ?, ?, 'seed')
          ON CONFLICT(id) DO UPDATE SET url=excluded.url, filename=excluded.filename, mime=excluded.mime, bytes=excluded.bytes`,
    args: [f.id, f.url, f.filename, f.mime, fs.statSync(path.join(process.cwd(), 'public', f.url.slice(1))).size],
  })
}

// Attach one fixture of each type to a real lesson, and a PDF to the first book.
const attach = [
  ['video', 'sample-video', '{"videoUrl":"/sample/sample-video.mp4","pending":false}'],
  ['audio', 'sample-audio', '{"audioUrl":"/sample/sample-audio.wav","pending":false}'],
  ['pdf', 'sample-pdf', '{"fileMediaId":"sample-pdf","pending":false}'],
  ['download', 'sample-pdf', '{"fileMediaId":"sample-pdf","fileName":"sample-lesson.pdf","pending":false}'],
  ['quiz', null, '{"questions":[{"question":"What is the first step in the practice exercise?","options":["Plan","Publish","Ignore"],"answer":0}],"passMark":70,"pending":false}'],
]
for (const [type, mediaId, content] of attach) {
  const row = (await client.execute({ sql: 'SELECT id FROM lessons WHERE lesson_type = ? LIMIT 1', args: [type as string] })).rows[0]
  if (!row) continue
  await client.execute({ sql: 'UPDATE lessons SET content = ? WHERE id = ?', args: [content as string, row.id] })
  void mediaId
}
const firstBook = (await client.execute('SELECT id FROM books ORDER BY id LIMIT 1')).rows[0]
if (firstBook) {
  await client.execute('UPDATE books SET file_media_id = ? WHERE id = ?', ['sample-book', firstBook.id])
}

console.log(`seeded original copy: ${courses.length} courses, ${books.length} books, ${posts.length} posts; ${fixtures.length} media fixtures`)

// -- Database-wide pass: rewrite every seeded row, not just the JSON subset ----
const allCourses = (await client.execute('SELECT id FROM courses ORDER BY id')).rows
for (const [i, row] of allCourses.entries()) {
  const id = Number(row.id)
  const label = `Course ${pad(i + 1)}`
  const price = PAID[i % PAID.length]
  await client.execute({
    sql: 'UPDATE courses SET title=?, category=?, description=?, short_description=? WHERE id=?',
    args: [`${label} — Practical Digital Skills`, 'Digital Skills',
      `Original sample content for ${label}. Replace with real course material in the CMS.`,
      `${label}: a hands-on introduction with short, practical lessons.`, id],
  })
  await client.execute({
    sql: 'UPDATE prices SET price=?, strike_through=? WHERE entity_type=? AND entity_id=?',
    args: [id === 49791 ? 0 : price, id === 49791 ? null : price + 10, 'course', id],
  })
}
const allBooks = (await client.execute('SELECT id FROM books ORDER BY id')).rows
for (const [i, row] of allBooks.entries()) {
  const id = Number(row.id)
  const label = `Guide ${pad(i + 1)}`
  const price = PAID[i % PAID.length]
  await client.execute({
    sql: 'UPDATE books SET title=?, author=?, description=?, chapters=?, file_media_id=? WHERE id=?',
    args: [`${label} — A Practical Guide`, 'Lena Editorial Team',
      `Original sample book content for ${label}. Replace the chapters in the CMS.`,
      JSON.stringify([
        { title: 'Introduction', body: `Original sample content for ${label}. Safe to edit or replace.` },
        { title: 'Chapter 1 — The basics', body: 'Work through the basics, then apply one small action.' },
      ]), 'sample-book', id],
  })
  await client.execute({
    sql: 'UPDATE prices SET price=?, price_type=? WHERE entity_type=? AND entity_id=?', args: [id === 49792 ? 0 : price, id === 49792 ? 'FREE' : 'ONE_TIME', 'book', id],
  })
}
const allPosts = (await client.execute('SELECT slug FROM blog_posts ORDER BY id')).rows
for (const [i, row] of allPosts.entries()) {
  await client.execute({
    sql: 'UPDATE blog_posts SET title=?, excerpt=?, body=? WHERE slug=?',
    args: [`Field note ${pad(i + 1)} — learning digital skills`,
      'An original sample article. Edit the body and title in the CMS before publication.',
      'This is original placeholder content. Replace it with your own article in the CMS.', String(row.slug)],
  })
}
console.log(`database-wide original copy: ${allCourses.length} courses, ${allBooks.length} books, ${allPosts.length} posts`)
await client.close()

// Keep the documented free sample items free after the original-copy rewrite.
await client.execute({ sql: "UPDATE prices SET price=0, price_type='FREE' WHERE price_type='FREE'" })
await client.close()
