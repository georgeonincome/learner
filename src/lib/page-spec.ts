import fs from 'node:fs'
import path from 'node:path'

/**
 * Page specs are the reference site's own rendered DOM, extracted to JSON by
 * scripts/extract-page-specs.mjs. They live in src/content/pages/<key>.json so
 * the content stays editable data rather than hand-written markup.
 */

export type SpecNode = {
  t: string
  c?: string
  a?: Record<string, string>
  ch?: SpecNode[]
  x?: string
}

export type PageSpec = {
  route: string
  key: string
  template: string
  title: string
  meta: {
    title: string
    description: string
    canonical: string
    og: Record<string, string>
    twitter: Record<string, string>
    jsonLd: unknown[]
  }
  blocks: SpecNode[]
}

const PAGES_DIR = path.join(process.cwd(), 'src', 'content', 'pages')

export function keyForPath(pathname: string) {
  const p = pathname.replace(/^\/+|\/+$/g, '')
  return p ? p.replace(/\//g, '__') : 'home'
}

export function getSpecByKey(key: string): PageSpec | null {
  const file = path.join(PAGES_DIR, `${key}.json`)
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as PageSpec
  } catch {
    return null
  }
}

export function getSpecForPath(pathname: string): PageSpec | null {
  return getSpecByKey(keyForPath(pathname))
}

export function listSpecKeys(): string[] {
  try {
    return fs
      .readdirSync(PAGES_DIR)
      .filter((f) => f.endsWith('.json') && f !== 'index.json')
      .map((f) => f.replace(/\.json$/, ''))
      .sort()
  } catch {
    return []
  }
}

export function getManifest(): { count: number; pages: Array<Record<string, unknown>> } {
  try {
    return JSON.parse(fs.readFileSync(path.join(PAGES_DIR, 'index.json'), 'utf8'))
  } catch {
    return { count: 0, pages: [] }
  }
}

/** Metadata for a route, matching what the reference emits in <head>. */
export function metadataForSpec(spec: PageSpec | null, fallback: string) {
  if (!spec) return { title: fallback, description: '' }
  return {
    title: spec.title || fallback,
    description: spec.meta?.description || '',
  }
}
