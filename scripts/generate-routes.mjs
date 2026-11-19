/**
 * generate-routes.mjs — create one real route per sitemap URL.
 *
 * Every route delegates to <PublicPage/> (or, for the dynamic patterns, to a
 * params-driven variant), which renders the reference page spec for that route.
 * Routes owned by the application (auth, account, checkout, dashboard, admin,
 * API) are left untouched.
 *
 * Usage: node scripts/generate-routes.mjs [--dry]
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const APP = path.join(ROOT, 'src', 'app')
const DRY = process.argv.includes('--dry')

/** Routes implemented by the application rather than by a captured page spec. */
const FUNCTIONAL = new Set([
  '/reset-password',
  '/verify',
  '/user',
  '/cart',
  '/checkout',
  '/dashboard',
  '/admin',
  '/api',
  '/offers',
  '/payments',
  '/you-have-paid',
  '/books-stripe-payment',
  '/payforcontentcreationschool',
  '/testkcpayment',
  '/kcpay--redirect',
  '/kcpay-registration-success',
  '/membership',
])

const xml = fs.readFileSync(path.resolve(ROOT, '..', '_reference', 'sitemap.xml'), 'utf8')
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())

const keyFor = (pathname) => {
  const p = pathname.replace(/^\/+|\/+$/g, '')
  return p ? p.replace(/\//g, '__') : 'home'
}

const STATIC_FILE = (key, title) => `import { PublicPage, specMetadata } from '@/components/layout/PublicPage'

export const metadata = specMetadata('${key}', '${title.replace(/'/g, "\\'")}')

export default function Page() {
  return <PublicPage specKey="${key}" />
}
`

const DYNAMIC_FILE = ({ paramsType, filter, toParams, toKey, label }) => `import { PublicPage, specMetadataForSpec } from '@/components/layout/PublicPage'
import { getSpecByKey, listSpecKeys } from '@/lib/page-spec'

type Params = Promise<${paramsType}>

export function generateStaticParams() {
  return listSpecKeys().filter((k) => ${filter}).map((k) => ${toParams})
}

export async function generateMetadata({ params }: { params: Params }) {
  const n = await params
  return specMetadataForSpec(getSpecByKey(${toKey}), '${label}')
}

export default async function Page({ params }: { params: Params }) {
  const n = await params
  return <PublicPage specKey={String(${toKey})} />
}
`

const DYNAMIC = {
  blogCategory: {
    file: ['blog', 'category', '[cat]', '[id]', 'page.tsx'],
    paramsType: '{ cat: string; id: string }',
    filter: `k.startsWith('blog__category__')`,
    toParams: `({ cat: k.split('__')[2], id: k.split('__')[3] })`,
    toKey: `\`blog__category__\${n.cat}__\${n.id}\``,
    label: 'Blog category',
  },
  blogPost: {
    file: ['blog', '[slug]', 'page.tsx'],
    paramsType: '{ slug: string }',
    filter: `k.startsWith('blog__') && !k.startsWith('blog__category__')`,
    toParams: `({ slug: k.slice(6) })`,
    toKey: `\`blog__\${n.slug}\``,
    label: 'Blog',
  },
  courseDetail: {
    file: ['course-detail', '[slug]', '[id]', 'page.tsx'],
    paramsType: '{ slug: string; id: string }',
    filter: `k.startsWith('course-detail__')`,
    toParams: `({ slug: k.split('__')[1], id: k.split('__')[2] })`,
    toKey: `\`course-detail__\${n.slug}__\${n.id}\``,
    label: 'Course',
  },
  community: {
    file: ['community', '[id]', 'page.tsx'],
    paramsType: '{ id: string }',
    filter: `k.startsWith('community__')`,
    toParams: `({ id: k.slice(11) })`,
    toKey: `\`community__\${n.id}\``,
    label: 'Community',
  },
}

function write(file, contents) {
  if (DRY) {
    console.log(`would write ${path.relative(ROOT, file)}`)
    return
  }
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

const titles = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'content', 'pages', 'index.json'), 'utf8'))
const titleFor = (pathname) => {
  const route = pathname.replace(/\/$/, '') || '/'
  const hit = titles.pages.find((p) => p.route === route)
  return hit?.title || route
}

let created = 0
let skipped = 0
for (const url of urls) {
  const pathname = new URL(url).pathname.replace(/\/$/, '') || '/'
  if (FUNCTIONAL.has(pathname)) {
    skipped++
    continue
  }

  const key = keyFor(pathname)
  let m
  if ((m = pathname.match(/^\/blog\/category\/([^/]+)\/([^/]+)$/))) {
    write(path.join(APP, ...DYNAMIC.blogCategory.file), DYNAMIC_FILE(DYNAMIC.blogCategory))
    skipped++
    continue
  }
  if ((m = pathname.match(/^\/blog\/([^/]+)$/))) {
    write(path.join(APP, ...DYNAMIC.blogPost.file), DYNAMIC_FILE(DYNAMIC.blogPost))
    skipped++
    continue
  }
  if ((m = pathname.match(/^\/course-detail\/([^/]+)\/([^/]+)$/))) {
    // Hand-maintained: renders the captured spec when present, otherwise the
    // catalog-driven course page. Do not overwrite it with the generic template.
    const file = path.join(APP, ...DYNAMIC.courseDetail.file)
    if (!fs.existsSync(file)) write(file, DYNAMIC_FILE(DYNAMIC.courseDetail))
    skipped++
    continue
  }
  if ((m = pathname.match(/^\/community\/([^/]+)$/))) {
    write(path.join(APP, ...DYNAMIC.community.file), DYNAMIC_FILE(DYNAMIC.community))
    skipped++
    continue
  }

  const rel = pathname === '/' ? 'page.tsx' : path.join(pathname.slice(1), 'page.tsx')
  write(path.join(APP, rel), STATIC_FILE(key, titleFor(pathname)))
  created++
}

console.log(`\nstatic routes written: ${created}   dynamic/functional handled: ${skipped}`)
