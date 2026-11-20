/**
 * Block compiler (M2/M9 — the fidelity engine).
 *
 * Converts the reference builder's normalized block tree (captured in
 * pages.blocks_raw) into ORIGINAL Tailwind blocks:
 *  - structure/order/per-device measurements preserved (±4px target);
 *  - reference colors mapped SEMANTICALLY to Lena tokens (original palette);
 *  - reference images replaced with local placeholders (no CDN hotlinks);
 *  - long marketing prose replaced with original Lena copy (short factual
 *    labels debranded and kept) — audit D3, copy-queue.md;
 *  - links normalized to local routes / checkout product params.
 *
 * Device model: reference desktop styles are base, tablet overrides ≤991px,
 * mobile ≤767px. Tailwind mobile-first emission: base = merge(d,t,m),
 * md: = merge(d,t) (768–991), lg: = desktop (≥1024). Exact at the five audit
 * widths 375/768/1024/1280/1536.
 */
import { debrand, BRAND_NAME } from '@/lib/brand'

export interface CompiledBlock {
  id: string
  tag: string
  cls: string
  style?: Record<string, string>
  html?: string
  href?: string
  src?: string
  alt?: string
  component?: string
  children: CompiledBlock[]
  section?: boolean
}
interface RawNode {
  id: string
  componentName?: string
  type?: string
  nodes?: string[]
  settings?: any
  parent?: string
}
export interface CompileCtx { pageSlug: string; pageTitle: string; index?: number }

// ---------- color mapping (reference literal -> Lena semantic token) ----------
function parseColor(v: string): { h: number; s: number; l: number } | null {
  if (!v) return null
  const named: Record<string, string> = { white: '#ffffff', black: '#000000', transparent: '', red: '#ff0000', green: '#008000', blue: '#0000ff', gray: '#808080', grey: '#808080' }
  let hex = named[v.toLowerCase()] ?? v
  const rgb = v.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i)
  if (rgb) hex = '#' + [rgb[1], rgb[2], rgb[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('')
  const m = hex.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  let h6 = m[1] ?? ''
  if (h6.length === 3) h6 = h6.split('').map((c) => c + c).join('')
  const r = parseInt(h6.slice(0, 2), 16) / 255, g = parseInt(h6.slice(2, 4), 16) / 255, b = parseInt(h6.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
    else if (max === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
  }
  return { h, s, l }
}
/** Map any reference color to a Lena token var, by semantic role. */
export function tokenColor(v: string, kind: 'color' | 'bg' | 'border'): string | null {
  const c = parseColor(v)
  if (!c) return null
  const { h, s, l } = c
  if (kind === 'bg') {
    if (l > 0.92) return 'var(--color-text-white)'
    if (l > 0.8) return 'var(--color-off-white)'
    if (l < 0.1) return 'var(--color-bg-hero)'
    if (l < 0.18) return 'var(--color-bg-surface)'
    if (l < 0.3) return 'var(--color-bg-surface-elevated)'
    if (s < 0.2) return 'var(--color-badge)'
  }
  if (kind === 'color') {
    if (l > 0.85) return 'var(--color-text-primary)'
    if (l < 0.15) return 'var(--color-text-dark-on-light)'
    if (s < 0.18) return l > 0.55 ? 'var(--color-text-secondary)' : 'var(--color-text-muted)'
  }
  if (kind === 'border') {
    if (l > 0.7) return 'var(--color-light-gray)'
    if (s < 0.2) return 'var(--color-border-card)'
  }
  if (s < 0.18) {
    return l > 0.6 ? 'var(--color-text-secondary)' : l > 0.35 ? 'var(--color-text-muted)' : 'var(--color-border-card)'
  }
  if (h >= 225 && h < 275) return 'var(--color-primary)'          // reference purple -> Lena primary
  if (h >= 185 && h < 225) return s > 0.5 ? 'var(--color-primary)' : 'var(--color-ezy-primary-300)'
  if (h >= 275 && h < 345) return 'var(--color-magenta)'          // reference pink CTA -> Lena amber
  if (h >= 345 || h < 15) return s > 0.45 ? 'var(--color-danger)' : 'var(--color-magenta)'
  if (h >= 15 && h < 55) return 'var(--color-magenta)'
  if (h >= 55 && h < 170) return 'var(--color-success)'
  return 'var(--color-info)'
}

// ---------- style -> Tailwind ----------
const SPACING: Record<string, string> = {
  paddingTop: 'pt', paddingBottom: 'pb', paddingLeft: 'pl', paddingRight: 'pr',
  marginTop: 'mt', marginBottom: 'mb', marginLeft: 'ml', marginRight: 'mr',
  padding: 'p', margin: 'm',
}
const DISPLAY: Record<string, string> = { flex: 'flex', 'inline-flex': 'inline-flex', block: 'block', 'inline-block': 'inline-block', grid: 'grid', none: 'hidden' }
const FLEXDIR: Record<string, string> = { row: 'flex-row', column: 'flex-col', 'row-reverse': 'flex-row-reverse', 'column-reverse': 'flex-col-reverse' }
const ALIGN: Record<string, string> = { center: 'items-center', start: 'items-start', 'flex-start': 'items-start', end: 'items-end', 'flex-end': 'items-end', stretch: 'items-stretch', baseline: 'items-baseline' }
const JUSTIFY: Record<string, string> = { center: 'justify-center', 'space-between': 'justify-between', 'space-around': 'justify-around', 'flex-start': 'justify-start', start: 'justify-start', 'flex-end': 'justify-end', end: 'justify-end' }
const VALID_VAL = /^-?[\d.]+(px|rem|em|%|vh|vw|fr|deg)?$/

function arb(v: string): string { return v.trim().replace(/\s+/g, '_') }
function mapProp(prop: string, value: any, prefix: string, out: string[], style: Record<string, string>) {
  if (value == null || value === '' || typeof value === 'object') {
    if (prop === '&:hover' && value && typeof value === 'object') {
      for (const [p2, v2] of Object.entries(value)) mapProp(p2, v2, prefix + 'hover:', out, style)
    }
    return
  }
  const v = String(value)
  if (v === 'Image' || v === 'Color' || /auto$/.test(v) && /^\d/.test(v)) return
  const P = prefix
  if (SPACING[prop]) {
    if (VALID_VAL.test(v) || /^[\d.]+(px|rem|em|%)\s+[\d.]+(px|rem|em|%)/.test(v) || v === '0') out.push(`${P}${SPACING[prop]}-[${arb(v)}]`)
    else if (v === 'auto') out.push(`${P}${SPACING[prop]}-auto`)
    return
  }
  switch (prop) {
    case 'fontSize': if (VALID_VAL.test(v)) out.push(`${P}text-[${v}]`); return
    case 'fontWeight': out.push(`${P}font-[${v}]`); return
    case 'lineHeight': if (VALID_VAL.test(v)) out.push(`${P}leading-[${v}]`); else if (/^[\d.]+$/.test(v)) out.push(`${P}leading-[${v}]`); return
    case 'fontFamily':
      if (/verdana|lucida/i.test(v)) out.push(`${P}font-heading`)
      else out.push(`${P}font-body`)
      return
    case 'color': { const t = tokenColor(v, 'color'); if (t) out.push(`${P}text-[${t}]`); return }
    case 'backgroundColor': { const t = tokenColor(v, 'bg'); if (t) out.push(`${P}bg-[${t}]`); return }
    case 'borderColor': { const t = tokenColor(v, 'border'); if (t) out.push(`${P}border-[${t}]`); return }
    case 'borderRadius': out.push(`${P}rounded-[${arb(v)}]`); return
    case 'borderWidth': if (VALID_VAL.test(v)) out.push(`${P}border-[${v}]`); return
    case 'borderStyle': if (v === 'solid') out.push(`${P}border-solid`); else if (v === 'none') out.push(`${P}border-0`); return
    case 'display': if (DISPLAY[v]) out.push(`${P}${DISPLAY[v]}`); return
    case 'flexDirection': if (FLEXDIR[v]) out.push(`${P}${FLEXDIR[v]}`); return
    case 'alignItems': if (ALIGN[v]) out.push(`${P}${ALIGN[v]}`); return
    case 'justifyContent': if (JUSTIFY[v]) out.push(`${P}${JUSTIFY[v]}`); return
    case 'flexWrap': if (v === 'wrap') out.push(`${P}flex-wrap`); return
    case 'gap': if (VALID_VAL.test(v)) out.push(`${P}gap-[${v}]`); return
    case 'rowGap': if (VALID_VAL.test(v)) out.push(`${P}gap-y-[${v}]`); return
    case 'columnGap': if (VALID_VAL.test(v)) out.push(`${P}gap-x-[${v}]`); return
    case 'width': out.push(v === '100%' ? `${P}w-full` : v === 'fit-content' ? `${P}w-fit` : VALID_VAL.test(v) ? `${P}w-[${v}]` : ''); return
    case 'height': out.push(v === '100%' ? `${P}h-full` : v === 'auto' ? `${P}h-auto` : VALID_VAL.test(v) ? `${P}h-[${v}]` : ''); return
    case 'maxWidth': out.push(v === '100%' ? `${P}max-w-full` : VALID_VAL.test(v) ? `${P}max-w-[${v}]` : ''); return
    case 'minWidth': if (VALID_VAL.test(v)) out.push(`${P}min-w-[${v}]`); return
    case 'minHeight': if (VALID_VAL.test(v)) out.push(`${P}min-h-[${v}]`); return
    case 'textAlign': if (['left', 'center', 'right'].includes(v)) out.push(`${P}text-${v}`); return
    case 'whiteSpace': if (v === 'break-spaces') out.push(`${P}whitespace-break-spaces`); else if (v === 'nowrap') out.push(`${P}whitespace-nowrap`); return
    case 'position': if (['relative', 'absolute', 'fixed', 'sticky'].includes(v)) out.push(`${P}${v}`); return
    case 'top': case 'left': case 'right': case 'bottom': if (VALID_VAL.test(v)) out.push(`${P}${prop}-[${v}]`); return
    case 'zIndex': if (/^\d+$/.test(v)) out.push(`${P}z-[${v}]`); return
    case 'overflow': if (['hidden', 'auto', 'visible'].includes(v)) out.push(`${P}overflow-${v}`); return
    case 'overflowX': case 'overflowY': if (v === 'hidden') out.push(`${P}overflow-x-hidden`); return
    case 'textTransform': if (['uppercase', 'lowercase', 'capitalize'].includes(v)) out.push(`${P}${v}`); return
    case 'letterSpacing': if (VALID_VAL.test(v)) out.push(`${P}tracking-[${v}]`); return
    case 'opacity': if (/^[\d.]+$/.test(v)) out.push(`${P}opacity-[${v}]`); return
    case 'backgroundImage': {
      if (/^url\(/i.test(v)) return // reference imagery dropped (brand rule)
      if (/linear-gradient/i.test(v)) {
        const mapped = v.replace(/#[0-9a-f]{3,6}|rgba?\([^)]+\)/gi, (m) => tokenColor(m, 'bg') ?? m)
        out.push(`${P}bg-[${arb(mapped)}]`)
      }
      return
    }
    case 'backgroundSize': if (v === 'cover') out.push(`${P}bg-cover`); return
    case 'backgroundPosition': if (v === 'center') out.push(`${P}bg-center`); return
    case 'backgroundRepeat': if (v === 'no-repeat') out.push(`${P}bg-no-repeat`); return
    case 'boxShadow': {
      const mapped = v.replace(/#[0-9a-f]{3,6}/gi, (m) => tokenColor(m, 'border') ?? m)
      out.push(`${P}shadow-[${arb(mapped)}]`)
      return
    }
    case 'background': return
    case 'cursor': if (v === 'pointer') out.push(`${P}cursor-pointer`); return
    case 'textDecoration': if (v === 'none') out.push(`${P}no-underline`); return
    default: {
      // arbitrary property fallback (kebab-case), values sanitized
      if (/^[a-zA-Z]+$/.test(prop) && VALID_VAL.test(v)) out.push(`${P}[${prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${v}]`)
    }
  }
}
function deviceClasses(style: any): { cls: string[]; style: Record<string, string> } {
  const d = style?.desktop ?? {}, t = style?.tablet ?? {}, m = style?.mobile ?? {}
  const base = { ...d, ...t, ...m }
  const tab = { ...d, ...t }
  const out: string[] = []
  const inline: Record<string, string> = {}
  for (const [p, v] of Object.entries(base)) mapProp(p, v, '', out, inline)
  for (const [p, v] of Object.entries(tab)) {
    if (JSON.stringify(m[p]) !== JSON.stringify(v)) mapProp(p, v, 'md:', out, inline)
  }
  for (const [p, v] of Object.entries(d)) {
    if (JSON.stringify(t[p]) !== JSON.stringify(v) || (m[p] !== undefined && JSON.stringify(m[p]) !== JSON.stringify(v))) {
      mapProp(p, v, 'lg:', out, inline)
    }
  }
  return { cls: out.filter(Boolean), style: inline }
}

// ---------- bootstrap class mapping ----------
const COL_FRAC: Record<string, string> = { '1': '1/12', '2': '1/6', '3': '1/4', '4': '1/3', '5': '5/12', '6': '1/2', '7': '7/12', '8': '2/3', '9': '3/4', '10': '5/6', '11': '11/12', '12': 'full' }
function bootstrapClasses(className: unknown, parentIsRow: boolean): string[] {
  const out: string[] = []
  const cn = typeof className === 'string' ? className : Array.isArray(className) ? className.join(' ') : ''
  for (const tok of cn.split(/\s+/)) {
    if (!tok) continue
    if (tok === 'container') out.push('mx-auto', 'w-full', 'max-w-[540px]', 'md:max-w-[720px]', 'lg:max-w-[960px]', 'xl:max-w-[1140px]', '2xl:max-w-[1320px]')
    else if (tok === 'container-fluid') out.push('w-full', 'px-3')
    else if (tok === 'row') out.push('flex', 'flex-wrap', '-mx-3')
    else if (tok === 'img-fluid') out.push('max-w-full', 'h-auto')
    else if (tok === 'text-center') out.push('text-center')
    else if (tok === 'd-flex') out.push('flex')
    else if (tok === 'd-none') out.push('hidden')
    else if (/^col(-\d+)?$/.test(tok)) { const n = tok.split('-')[1] ?? '12'; out.push(`w-${COL_FRAC[n] ?? 'full'}`) }
    else if (/^col-(sm|md|lg|xl|xxl)-\d+$/.test(tok)) {
      const [, bp, nRaw] = tok.split('-')
      const n = nRaw ?? '12'
      const prefix = bp === 'sm' ? 'sm:' : bp === 'md' ? 'md:' : bp === 'lg' ? 'lg:' : bp === 'xl' ? 'xl:' : '2xl:'
      out.push(`${prefix}w-${COL_FRAC[n] ?? 'full'}`)
    }
    // styled-components hash classes + reference theme classes are dropped:
    // their measurements live in settings.style (compiled above).
  }
  if (parentIsRow) out.push('px-3')
  return out
}

// ---------- original copy policy (D3) ----------
const ORIGINAL_PARAS = [
  `At ${BRAND_NAME}, every lesson ends with something you can use: a template, a checklist, or a finished piece of work. Learn by doing, not by watching.`,
  `Start where you are. Pick one skill, practice it on a real project this week, and share the result with the community for feedback.`,
  `Small businesses grow when their owners can sell, create content, and use digital tools confidently. That is exactly what this program trains.`,
  `No fluff, no gatekeeping. Clear steps, honest effort, and support from people who are building the same things you are.`,
  `Turn what you learn into income: offer a service, publish a product, or grow the business you already have. The path is yours to choose.`,
  `Consistency beats intensity. Fifteen focused minutes a day, applied to one offer and one audience, compounds faster than any hack.`,
  `Your first hundred dollars online is a milestone, not a mystery. It comes from solving one real problem for one real person, repeatedly.`,
  `Tools change; fundamentals do not. Understand your customer, make a clear offer, and show up where your audience already is.`,
]
function hash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
function originalPara(seed: string): string {
  const h = hash(seed)
  return ORIGINAL_PARAS[h % ORIGINAL_PARAS.length] + ' ' + ORIGINAL_PARAS[(h >> 3) % ORIGINAL_PARAS.length]
}
function stripScripts(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '')
}
function rewriteInlineColors(html: string): string {
  return html.replace(/color:\s*(#[0-9a-f]{3,6}|rgba?\([^)]+\))/gi, (_m, c) => {
    const t = tokenColor(c, 'color'); return t ? `color: ${t}` : 'color: inherit'
  })
}
function textOf(html: string): string { return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }
function rewriteContent(html: string, kind: 'heading' | 'body' | 'label', ctx: CompileCtx, blockId: string): string {
  let h = stripScripts(String(html ?? ''))
  const text = textOf(h)
  const words = text.split(/\s+/).filter(Boolean).length
  if (/^\d[\d,]*\+?\s+(students|countries|clients|years)/i.test(text)) {
    // Return inline text only: the block renderer already supplies the <p>
    // wrapper. Nesting <p> inside <p> breaks HTML and causes hydration errors.
    return /students/i.test(text) ? '3,800+ students' : debrand(text)
  }
  if (kind === 'heading' && words > 7) {
    if (ctx.pageSlug === 'home') return `Learn Digital Skills. <span style="color: var(--color-magenta)">Build Real Income.</span>`
    return debrand(ctx.pageTitle)
  }
  if (kind === 'body' && text.length > 90) {
    // Inline text only — never emit a block-level <p> here. The parent block
    // is itself a <p>; nesting block tags corrupts the DOM during hydration.
    return originalPara(ctx.pageSlug + blockId)
  }
  h = rewriteInlineColors(h)
  // debrand text nodes only (keep tags)
  h = h.replace(/>([^<]+)</g, (_m, t) => `>${debrand(t)}<`)
  return debrand(h)
}

// ---------- links ----------
function resolveLink(link: any): string | undefined {
  if (!link || typeof link !== 'object') return undefined
  const url = String(link.url ?? '')
  switch (link.type) {
    case 'section': return url ? `#${url}` : undefined
    case 'checkout': {
      const m = url.match(/product_id=(\d+)/)
      const t = url.match(/product_type=(\w+)/)
      return m ? `/checkout?product_id=${m[1]}&product_type=${t?.[1] ?? 'course'}` : '/checkout'
    }
    case 'external-link': case 'url': case 'page': {
      if (!url) return undefined
      const local = url.replace(/^https?:\/\/(www\.)?savvypro\.org/, '')
      return local.startsWith('/') || local.startsWith('#') ? local : url
    }
    default: {
      if (!url) return undefined
      const local = url.replace(/^https?:\/\/(www\.)?savvypro\.org/, '')
      return local.startsWith('/') ? local : url.startsWith('http') ? url : `/${url}`
    }
  }
}

const TAGS: Record<string, string> = {
  Section: 'section', Container: 'div', Div: 'div', Row: 'div', Column: 'div', Box: 'div',
  H1: 'h1', H2: 'h2', H3: 'h3', H4: 'h4', H5: 'h5', H6: 'h6',
  P: 'p', Text: 'p', InlineText: 'span', RichText: 'div', Button: 'a', IconButton: 'a',
  Img: 'img', List: 'ul', Li: 'li', AllBlogs: 'div', Video: 'div', Embed: 'div', Icon: 'span',
}

function compileNode(node: RawNode, flat: Record<string, RawNode>, ctx: CompileCtx, parentIsRow: boolean, section = false): CompiledBlock {
  const cn = node.componentName ?? node.type ?? 'Div'
  const s = node.settings ?? {}
  const tag = TAGS[cn] ?? 'div'
  const { cls, style } = deviceClasses(s.style)
  const classes = [...bootstrapClasses(s.general?.className ?? s.className ?? '', parentIsRow), ...cls]
  const block: CompiledBlock = { id: node.id, tag, cls: classes.join(' '), children: [] }
  if (Object.keys(style).length) block.style = style
  if (section) { block.section = true }

  if (cn === 'AllBlogs') { block.component = 'blog-grid'; block.tag = 'div'; return block }
  if (cn === 'Img') {
    block.tag = 'img'
    block.src = '/placeholder.svg'
    block.alt = debrand(s.general?.img?.alt ?? ctx.pageTitle)
    if (!classes.some((c) => c.startsWith('w-'))) block.cls += ' max-w-full h-auto'
    const href = resolveLink(s.general?.link)
    if (href) block.href = href
    return block
  }
  const content = s.content?.default
  if (content != null && content !== '') {
    const kind = /^H[1-6]$/.test(cn) ? 'heading' : (cn === 'Button' || cn === 'IconButton' || cn === 'InlineText') ? 'label' : 'body'
    block.html = rewriteContent(content, kind, ctx, node.id)
  }
  const href = resolveLink(s.general?.link)
  if (href) block.href = href
  if ((cn === 'Button' || cn === 'IconButton') && !block.html) block.html = 'Learn more'
  if (cn === 'Button' || cn === 'IconButton') {
    block.cls += ' cursor-pointer no-underline'
    if (!classes.some((c) => c.includes('rounded'))) block.cls += ' rounded-[5px]'
  }
  const isRow = String(s.general?.className ?? '').split(/\s+/).includes('row') || cn === 'Row'
  for (const childId of node.nodes ?? []) {
    const child = flat[childId]
    if (child) block.children.push(compileNode(child, flat, ctx, isRow))
  }
  return block
}

/** Compile a page's raw builder state into original Tailwind blocks. */
export function compilePage(blocksRaw: any, ctx: CompileCtx): CompiledBlock[] {
  const tree: string[] = blocksRaw?.nodeTreeIDS ?? []
  const nodes: Record<string, any> = blocksRaw?.nodes ?? {}
  const out: CompiledBlock[] = []
  for (const rootId of tree) {
    const flat: Record<string, RawNode> = nodes[rootId]?.data ?? {}
    const root = flat[rootId]
    if (!root) continue
    out.push(compileNode(root, flat, ctx, false, true))
  }
  return out
}
