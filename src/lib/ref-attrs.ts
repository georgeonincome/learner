import React from 'react'

/**
 * Minimal HTML-attribute -> React-prop mapping.
 * React already maps most lowercase names (tabindex, readonly, maxlength, ...)
 * through its possibleStandardNames table; the entries below cover the ones
 * that must be camelCase or that React would otherwise set verbatim.
 */
const ATTR_MAP: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  viewbox: 'viewBox',
  preserveaspectratio: 'preserveAspectRatio',
  patternunits: 'patternUnits',
  gradientunits: 'gradientUnits',
  gradienttransform: 'gradientTransform',
  clippathunits: 'clipPathUnits',
  maskunits: 'maskUnits',
  maskcontentunits: 'maskContentUnits',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  markerheight: 'markerHeight',
  refx: 'refX',
  refy: 'refY',
  textlength: 'textLength',
  attributename: 'attributeName',
  attributetype: 'attributeType',
  baseprofile: 'baseProfile',
  calcmode: 'calcMode',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  numoctaves: 'numOctaves',
  stddeviation: 'stdDeviation',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'clip-rule': 'clipRule',
  'color-interpolation': 'colorInterpolation',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'vector-effect': 'vectorEffect',
  'dominant-baseline': 'dominantBaseline',
  'text-anchor': 'textAnchor',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'letter-spacing': 'letterSpacing',
  // HTML attributes React expects camelCase for. Without these React logs
  // "Invalid DOM property" on every captured page.
  tabindex: 'tabIndex',
  maxlength: 'maxLength',
  minlength: 'minLength',
  autocomplete: 'autoComplete',
  readonly: 'readOnly',
  autocapitalize: 'autoCapitalize',
  autofocus: 'autoFocus',
  'clip-path': 'clipPath',
  'mask-image': 'maskImage',
  srcset: 'srcSet',
  crossorigin: 'crossOrigin',
  usemap: 'useMap',
  formaction: 'formAction',
  formmethod: 'formMethod',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen',
  spellcheck: 'spellCheck',
  contenteditable: 'contentEditable',
  enterkeyhint: 'enterKeyHint',
  inputmode: 'inputMode',
  accesskey: 'accessKey',
  datapagesize: 'datapagesize',
}

/** Attributes that must never be emitted (inline handlers, booking, etc.). */
const DROP_ATTR = /^(on|style)$/

export function attrsToProps(attrs: Record<string, string>): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  for (const [rawName, value] of Object.entries(attrs)) {
    if (DROP_ATTR.test(rawName)) continue
    if (rawName.startsWith('onclick') || rawName.startsWith('onload')) continue
    if (rawName === 'href' && /^\s*javascript:/i.test(value)) continue
    const name = ATTR_MAP[rawName] || rawName
    props[name] = value
  }
  return props
}

/** Convert a `style="a:b;c:d"` attribute string into a React style object. */
export function styleStringToObject(style?: string): React.CSSProperties | undefined {
  if (!style) return undefined
  const out: Record<string, string> = {}
  for (const decl of style.split(';')) {
    const idx = decl.indexOf(':')
    if (idx < 0) continue
    const prop = decl.slice(0, idx).trim()
    const value = decl.slice(idx + 1).trim()
    if (!prop || !value) continue
    const key = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    out[key] = value
  }
  return out as React.CSSProperties
}
