/**
 * Shared helpers for turning captured reference HTML into build inputs:
 *  - styled-components CSS union
 *  - per-page SEO metadata
 *  - compact DOM specs consumed by the <RefNode/> renderer
 */
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'parse5'

export const ROOT = process.cwd()
export const REF_DIR = path.resolve(ROOT, '..', '_reference')
export const REF_SITE = path.join(REF_DIR, 'site', 'www.savvypro.org')
export const CAPTURE_DIR = path.join(ROOT, 'captured')
export const BROWSER_DIR = path.join(ROOT, 'captured-browser')
export const STYLES_DIR = path.join(ROOT, 'src', 'styles')
export const PAGES_DIR = path.join(ROOT, 'src', 'content', 'pages')

export const SITEMAP = path.join(REF_DIR, 'sitemap.xml')

export function sitemapUrls() {
  const xml = fs.readFileSync(SITEMAP, 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
}

/** URL path -> on-disk capture file name (matches capture-live.mjs). */
export function captureFileName(url) {
  const p = new URL(url).pathname.replace(/^\/+|\/+$/g, '')
  if (!p) return 'index.html'
  return p.replace(/\//g, '__') + '.html'
}

/** Pick the best available source file for a URL: hydrated browser render first. */
export function sourceFor(url) {
  const name = captureFileName(url)
  const candidates = [path.join(BROWSER_DIR, name), path.join(CAPTURE_DIR, name), path.join(REF_SITE, name)]
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).size > 20_000) return c
  }
  return null
}

/** All usable HTML sources, de-duplicated by resolved path. */
export function allSources() {
  const out = new Map()
  // REF_SITE first: its SSR <style data-styled> blocks carry the canonical rule
  // order. captured-browser is last because speedy-mode sheets serialize empty.
  const dirs = [REF_SITE, CAPTURE_DIR, BROWSER_DIR]
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue
    for (const f of fs.readdirSync(d).sort()) {
      if (!f.endsWith('.html')) continue
      const p = path.join(d, f)
      out.set(p, true)
    }
  }
  return [...out.keys()]
}

/** Union of every styled-components rule emitted by the captured pages. */
export function styledCssUnion(sources) {
  const seen = new Map()
  for (const file of sources) {
    const html = fs.readFileSync(file, 'utf8')
    for (const m of html.matchAll(/<style data-styled[^>]*>([\s\S]*?)<\/style>/g)) {
      for (const part of m[1].split('/*!sc*/')) {
        const rule = part.trim()
        if (!rule) continue
        seen.set(rule, (seen.get(rule) || 0) + 1)
      }
    }
  }
  // Keep first-seen order. Sorting alphabetically here used to reorder media
  // queries (max-width:767px before max-width:991px), which silently broke
  // every responsive override in the clone.
  return [...seen.keys()].join('\n')
}

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
])

/**
 * Convert a parse5 element into the compact spec shape used by <RefNode/>:
 *   { t: tag, c: className, a: {attrs}, ch: [child] }
 * Text nodes: { t: '#text', x: text }
 */
export function toSpec(node, opts = {}) {
  if (node.nodeName === '#text') {
    const x = node.value
    if (!x) return null
    if (opts.stripWhitespace && !x.trim()) return null
    return { t: '#text', x }
  }
  if (node.nodeName === '#comment') return null
  if (node.nodeName === '#document' || node.nodeName === '#document-fragment') {
    return null
  }
  const tag = node.nodeName.toLowerCase()
  if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'template') return null

  const a = {}
  for (const attr of node.attrs || []) {
    if (attr.name === 'class') continue
    a[attr.name] = attr.value
  }
  const spec = { t: tag }
  const cls = (node.attrs || []).find((x) => x.name === 'class')
  if (cls && cls.value.trim()) spec.c = cls.value
  if (Object.keys(a).length) spec.a = a

  if (!VOID.has(tag) && node.childNodes) {
    const ch = []
    for (const child of node.childNodes) {
      const s = toSpec(child, opts)
      if (s) ch.push(s)
    }
    if (ch.length) spec.ch = ch
  }
  return spec
}

/** Children of the page content wrapper, excluding the shared header. */
export function bodyBlocks(ast, { stripHeader = true } = {}) {
  const body = findFirst(ast, (n) => n.nodeName === 'body')
  if (!body) return []

  // Next.js renders into <div id="__next"><div><div>…content…</div></div></div>.
  // Descend through single-child wrappers until the real content children appear.
  let container = body
  const nextDiv = findFirst(body, (n) => n.nodeName === 'div' && attr(n, 'id') === '__next')
  if (nextDiv) container = nextDiv
  for (let i = 0; i < 8; i++) {
    const els = (container.childNodes || []).filter(
      (c) => c.nodeName && c.nodeName !== '#text' && c.nodeName !== '#comment',
    )
    if (els.length === 1 && els[0].nodeName === 'div') container = els[0]
    else break
  }

  const blocks = []
  for (const child of container.childNodes || []) {
    if (child.nodeName === '#text' && !child.value.trim()) continue
    if (child.nodeName === '#comment') continue
    if (stripHeader && child.nodeName === 'header') continue
    const tag = child.nodeName.toLowerCase()
    if (tag === 'script' || tag === 'style' || tag === 'noscript') continue
    if (tag === 'next-route-announcer') continue
    const s = toSpec(child)
    if (s) blocks.push(s)
  }
  return blocks
}

export function findFirst(node, pred) {
  if (pred(node)) return node
  for (const child of node.childNodes || []) {
    const r = findFirst(child, pred)
    if (r) return r
  }
  return null
}

export function findAll(node, pred, out = []) {
  if (pred(node)) out.push(node)
  for (const child of node.childNodes || []) findAll(child, pred, out)
  return out
}

export function attr(el, name) {
  return (el.attrs || []).find((a) => a.name === name)?.value
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

/** Per-page SEO metadata from <head>. */
export function extractMeta(ast, url) {
  const head = findFirst(ast, (n) => n.nodeName === 'head')
  const meta = { title: '', description: '', canonical: '', og: {}, twitter: {}, jsonLd: [] }
  if (!head) return meta
  const titleEl = findFirst(head, (n) => n.nodeName === 'title')
  if (titleEl) meta.title = decodeEntities(textOf(titleEl)).trim()

  for (const m of findAll(head, (n) => n.nodeName === 'meta')) {
    const name = attr(m, 'name') || attr(m, 'property')
    const content = attr(m, 'content') || ''
    if (!name) continue
    if (name === 'description') meta.description = content
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      const key = name.replace(/^(og|twitter):/, '')
      const bucket = name.startsWith('og:') ? meta.og : meta.twitter
      bucket[key] = content
    }
  }
  const link = findAll(head, (n) => n.nodeName === 'link').find((l) => attr(l, 'rel') === 'canonical')
  if (link) meta.canonical = attr(link, 'href') || ''

  for (const s of findAll(head, (n) => n.nodeName === 'script')) {
    if (attr(s, 'type') === 'application/ld+json') {
      const raw = textOf(s).trim()
      if (raw) {
        try {
          meta.jsonLd.push(JSON.parse(raw))
        } catch {
          meta.jsonLd.push({ raw })
        }
      }
    }
  }
  if (!meta.og.url) meta.og.url = url
  return meta
}

export function textOf(node) {
  if (node.nodeName === '#text') return node.value
  return (node.childNodes || []).map(textOf).join('')
}

export function parseHtml(html) {
  return parse(html, { sourceCodeLocationInfo: false })
}

export function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8')
  } catch {
    return null
  }
}
