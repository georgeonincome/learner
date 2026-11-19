/**
 * Button targets captured from the live reference site.
 *
 * The reference renders its CTAs as styled-components <button> elements whose
 * destinations live inside minified React onClick closures, so the captured HTML
 * carries no usable href. scripts/capture-button-targets.mjs clicks each control
 * on the live site and records where it goes.
 *
 * Lookup is route-specific first, then falls back to a site-wide text index
 * (most CTA labels are unique across the reference).
 */
import raw from '@/content/button-targets.json'

type TargetEntry = { target: string | null; kind: string; cls?: string }

type Capture = {
  host?: string
  at?: string
  pages?: Record<string, Record<string, TargetEntry>>
}

const pages = (raw as unknown as Capture).pages || {}

const normalise = (route: string) => {
  const s = route.replace(/^\/+|\/+$/g, '')
  return s ? '/' + s : '/'
}

// Site-wide index of control label -> target, for labels that resolve consistently.
const globalIndex: Record<string, TargetEntry> = {}
for (const page of Object.values(pages)) {
  for (const [label, entry] of Object.entries(page)) {
    if (label.startsWith('__')) continue
    if (!globalIndex[label]) globalIndex[label] = entry
  }
}

export function isNavigationEntry(entry: TargetEntry | undefined): entry is TargetEntry {
  if (!entry || !entry.target) return false
  if (entry.kind === 'popup' || entry.kind === 'none') return false
  return entry.target.startsWith('/')
}

/**
 * Resolve where a control on `route` labelled `label` navigates.
 * Returns a local path, or null when the control is not a navigation control
 * (cookie banner, carousel arrow, accordion, in-page anchor, ...).
 */
export function buttonTarget(route: string, label: string): string | null {
  const text = label.replace(/\s+/g, ' ').trim()
  if (!text) return null
  const r = normalise(route)
  const page = pages[r] || pages[r + '/'] || pages[r.replace(/\/$/, '')] || {}
  const entry: TargetEntry | undefined = page[text] || globalIndex[text]
  if (!isNavigationEntry(entry) || !entry.target) return null
  // A "navigate" that lands back on the same page is an in-page anchor/scroll,
  // not a route change — wiring it would fight the reference's own behaviour.
  if (normalise(entry.target) === r) return null
  return entry.target
}

/** True when the reference has a recorded behaviour for this label on this route. */
export function hasButtonTarget(route: string, label: string): boolean {
  const text = label.replace(/\s+/g, ' ').trim()
  if (!text) return false
  const r = normalise(route)
  const page = pages[r] || pages[r + '/'] || pages[r.replace(/\/$/, '')] || {}
  return Boolean(page[text] || globalIndex[text])
}
