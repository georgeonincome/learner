/**
 * codemod-blockpages.mts — M2: replace DOM-replay spec pages and ReferenceLanding
 * stubs with the CMS-driven BlockPage template wherever a DB page exists.
 * Dynamic routes ([slug]) are left for their real templates (M5/M6/M8).
 * Run: TURSO_DATABASE_URL=file:local.db npx tsx scripts/codemod-blockpages.mts
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

const ROOT = process.cwd()
const client = createClient({ url: process.env.TURSO_DATABASE_URL || 'file:local.db' })
const pages = (await client.execute('SELECT slug FROM pages')).rows.map((r) => String(r.slug))
const slugSet = new Set(pages)

function routeOf(file: string): string {
  let rel = file.split('src/app/')[1].replace(/\/page\.tsx$/, '')
  rel = rel.replace(/\([^)]+\)\/?/g, '') // strip route groups
  return '/' + rel
}

const TEMPLATE = (slug: string) => `import { BlockPage, blockPageMetadata } from '@/components/layout/BlockPage'

export const revalidate = 3600

export async function generateMetadata() {
  return blockPageMetadata('${slug}')
}

export default function Page() {
  return <BlockPage slug="${slug}" />
}
`

// Routes whose spec carries a WORKING form/control that BlockPage's static
// compiler would break. They keep their functional renderer until their
// milestone rebuilds them in Tailwind (auth M3, chat M8, booking M8).
const KEEP_FUNCTIONAL = new Set(['login', 'signup', 'savvybot-ai-agent', 'appointment'])

let converted = 0, skipped = 0
const files: string[] = []
function walk(dir: string) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name === 'page.tsx') files.push(p)
  }
}
walk(path.join(ROOT, 'src/app'))

for (const file of files) {
  const route = routeOf(file)
  if (route.includes('[')) { skipped++; continue } // dynamic → real templates later
  const slug = route === '/' ? 'home' : route.replace(/^\//, '')
  if (KEEP_FUNCTIONAL.has(slug)) { skipped++; continue }
  const t = fs.readFileSync(file, 'utf8')
  const isSpec = t.includes('PublicPage') || t.includes('ReferenceLanding')
  if (!isSpec) { skipped++; continue }
  if (!slugSet.has(slug)) { skipped++; continue }
  fs.writeFileSync(file, TEMPLATE(slug))
  converted++
}
console.log(`✅ converted ${converted} pages to BlockPage; skipped ${skipped} (dynamic/no-DB-page/already-functional)`)
await client.close()
