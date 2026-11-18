// Generates page.tsx files for reference sitemap routes that are not yet
// represented in src/app. Each page uses the shared ReferenceLanding shell
// with a unique title. Run: node scripts/generate-route-pages.mjs
import fs from 'node:fs'
import path from 'node:path'

const sitemapPath = path.resolve('..', '_reference', 'sitemap.xml')
const appDir = path.resolve('src', 'app')

const xml = fs.readFileSync(sitemapPath, 'utf8')
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  new URL(m[1]).pathname.replace(/\/$/, '') || '/',
)

function collectRoutes(dir, base = '') {
  const routes = new Set()
  if (fs.existsSync(path.join(dir, 'page.tsx'))) routes.add(base || '/')
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const name = entry.name
    if (name.startsWith('(')) {
      for (const r of collectRoutes(path.join(dir, name), base)) routes.add(r)
      continue
    }
    const segment = name.startsWith('[') ? '*' : name
    const nextBase = `${base}/${segment}`
    const full = path.join(dir, name)
    if (fs.existsSync(path.join(full, 'page.tsx'))) routes.add(nextBase)
    for (const r of collectRoutes(full, nextBase)) routes.add(r)
  }
  return routes
}

function matchesRoute(p, routes) {
  const seg = p.split('/').filter(Boolean)
  for (const r of routes) {
    const a = r.split('/').filter(Boolean)
    if (a.length !== seg.length) continue
    if (a.every((s, i) => s === '*' || s === seg[i])) return true
  }
  return false
}

const SPECIAL = {
  '/you-have-paid': 'Payment Successful',
  '/signin': 'Sign In',
  '/user': 'My Account',
  '/membership': 'Membership',
  '/offers': 'Special Offers',
  '/payments': 'Payments',
  '/freebies': 'Free Resources',
  '/ebooks': 'Ebooks',
  '/video-library': 'Video Library',
  '/audio-library': 'Audio Library',
  '/video-details': 'Video Details',
  '/audio-details': 'Audio Details',
  '/mini-courses': 'Mini Courses',
  '/learning-hub': 'Learning Hub',
  '/savvypro-home': 'Home',
  '/savvypro': 'Home',
  '/savvypro-main': 'Home',
  '/digital-savvypro': 'Digital SavvyPro',
  '/for-businesses': 'For Businesses',
  '/inner-circle': 'Inner Circle',
  '/content-creation-school': 'Content Creation School',
  '/content-creation-school-main': 'Content Creation School',
  '/freelancers': 'Freelancers',
  '/susan-mwenda-mulongoti': 'Susan Mwenda-Mulongoti',
  '/susan-mwenda-mulongoti-consultant': 'Consultant Profile',
  '/ceo-digital-strategy': 'CEO Digital Strategy',
  '/marketing-software': 'Marketing Software',
  '/savvypro-mobile-apps': 'SavvyPro Mobile Apps',
  '/coaching-program-detail': 'Coaching Program Detail',
  '/savvypro-refund-policy': 'Refund Policy',
  '/savvypro-terms-and-conditions': 'Terms and Conditions',
  '/savvypro-privacy-policy': 'Privacy Policy',
}

function titleFor(slug) {
  if (SPECIAL[slug]) return SPECIAL[slug]
  const words = slug
    .split('-')
    .filter(Boolean)
    .map((w) => (/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
  return words.join(' ') || 'SavvyPro'
}

function escapeString(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

const routes = collectRoutes(appDir)
const missing = urls.filter((u) => u !== '/' && !matchesRoute(u, routes))
let created = 0

for (const urlPath of missing) {
  const segments = urlPath.split('/').filter(Boolean)
  const dir = path.join(appDir, ...segments)
  const file = path.join(dir, 'page.tsx')
  if (fs.existsSync(file)) continue
  fs.mkdirSync(dir, { recursive: true })
  const title = titleFor(segments[segments.length - 1] ?? '')
  const content = `import { ReferenceLanding } from '@/components/routes/ReferenceLanding'

export const metadata = {
  title: '${escapeString(title)} — SavvyPro',
  description: '${escapeString(title)} on SavvyPro — practical digital skills, training and support.',
}

export default function Page() {
  return <ReferenceLanding title="${escapeString(title)}" />
}
`
  fs.writeFileSync(file, content)
  created++
}

console.log(`Missing routes: ${missing.length}`)
console.log(`Pages created: ${created}`)
