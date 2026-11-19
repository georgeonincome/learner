'use client'

import React, { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { attrsToProps, styleStringToObject } from '@/lib/ref-attrs'
import { buttonTarget } from '@/lib/button-targets'
import { RefLoginForm, RefSignupForm } from '@/components/auth/RefAuthForm'

/** Compact DOM spec produced by scripts/extract-page-specs.mjs. */
export type SpecNode = {
  t: string
  c?: string
  a?: Record<string, string>
  ch?: SpecNode[]
  x?: string
}

/** Current route, so controls can resolve their captured navigation target. */
const RouteContext = createContext('/')

/** Visible text of a spec subtree (the reference's own copy). */
export function nodeText(node: SpecNode | undefined): string {
  if (!node || typeof node !== 'object') return ''
  let out = node.x || ''
  for (const child of node.ch || []) out += nodeText(child)
  return out.replace(/\s+/g, ' ').trim()
}

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
])

const REFERENCE_ORIGINS = ['https://www.savvypro.org', 'https://savvypro.org', 'http://www.savvypro.org']

/**
 * Reference links point at the source site; rewrite them to local routes so the
 * clone is self-contained. External links are left untouched.
 */
export function normalizeHref(href?: string): string | undefined {
  if (!href) return href
  for (const origin of REFERENCE_ORIGINS) {
    if (href === origin) return '/'
    if (href.startsWith(origin + '/')) return href.slice(origin.length) || '/'
  }
  return href
}

/**
 * The reference renders its CTAs as <button> elements with minified React onClick
 * closures, and its anchor wrappers use in-page `#uuid` hrefs. Both are inert in a
 * static capture. Wire them to the destination recorded by
 * scripts/capture-button-targets.mjs.
 */
function useRefNavigation() {
  const router = useRouter()
  const route = useContext(RouteContext)
  return (label: string) => {
    const target = buttonTarget(route, label)
    return target ? () => router.push(target) : null
  }
}

export function RefNode({ node, layoutSection }: { node: SpecNode; layoutSection?: boolean }) {
  const navigateByLabel = useRefNavigation()

  if (node.t === '#text') return <>{node.x ?? ''}</>
  if (node.t.startsWith('#')) return null

  if (node.t === 'form') {
    const cls = node.c || ''
    if (cls.includes('_login_page_form')) {
      const isSignup = JSON.stringify(node).includes('"id":"first_name"')
      return isSignup ? <RefSignupForm /> : <RefLoginForm />
    }
    return <RefForm node={node} />
  }

  const props: Record<string, unknown> = attrsToProps(node.a || {})
  if (node.c) props.className = node.c
  const style = styleStringToObject(node.a?.['style'])
  if (style) props.style = style
  if (typeof props.href === 'string') props.href = normalizeHref(props.href as string)
  if (layoutSection) props['data-layout-section'] = ''

  // Controls ---------------------------------------------------------------
  // Leave real form controls alone; a type="button" CTA is still a navigation control.
  const isSubmit = props.type === 'submit' || props.type === 'reset'

  // The captured reference markup carries static `value` attributes on inputs.
  // React warns unless the field is explicitly read-only.
  if ((node.t === 'input' || node.t === 'textarea') && props.value !== undefined && !props.onChange) {
    props.readOnly = true
  }
  if (node.t === 'button' && !isSubmit) {
    const label = nodeText(node)
    const go = navigateByLabel(label)
    if (go) {
      props.onClick = go
      props.type = 'button'
    }
  } else if (node.t === 'a') {
    // Anchor wrappers around CTAs: the reference uses in-page `#uuid` hrefs, or
    // no href at all, with the real target in a minified React handler. Point
    // them at the recorded destination so the whole control is clickable.
    const href = typeof props.href === 'string' ? props.href : ''
    if (href === '' || href.startsWith('#')) {
      const target = buttonTarget(useContext(RouteContext), nodeText(node))
      if (target) props.href = target
    }
  }

  if (VOID.has(node.t)) return React.createElement(node.t, props)
  const children = node.ch?.length
    ? node.ch.map((child, i) => <RefNode key={i} node={child} />)
    : undefined
  return React.createElement(node.t, props, children)
}

export function RefBlocks({ blocks, route = '/' }: { blocks: SpecNode[]; route?: string }) {
  return (
    <RouteContext.Provider value={route}>
      {blocks.map((b, i) => (
        <RefNode key={i} node={b} layoutSection />
      ))}
    </RouteContext.Provider>
  )
}

/**
 * The reference renders its forms client-side, so the captured markup carries no
 * working action. This wrapper keeps the reference's own form styling and fields
 * but submits to the clone's form endpoint.
 */
function RefForm({ node }: { node: SpecNode }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const props: Record<string, unknown> = attrsToProps(node.a || {})
  if (node.c) props.className = node.c
  const style = styleStringToObject(node.a?.['style'])
  if (style) props.style = style
  delete props.action

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setMessage('')

    const form = event.currentTarget
    const data = new FormData(form)
    const fields: Record<string, string> = {}
    for (const [key, value] of data.entries()) {
      if (typeof value === 'string') fields[key] = value
    }

    const email = fields.email || fields.Email || fields['email-address'] || ''
    const name = fields.name || fields.Name || fields.fullname || fields['full-name'] || ''
    const body = {
      formType: (node.a?.['data-form-type'] as string) || 'contact',
      name,
      email,
      message: fields.message || fields.Message || '',
      fields,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    }

    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('error')
        setMessage(json.error || 'Something went wrong. Please try again.')
        return
      }
      setStatus('done')
      setMessage('Thank you — your submission has been received.')
      form.reset?.()
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const children = node.ch?.length
    ? node.ch.map((child, i) => <RefNode key={i} node={child} />)
    : undefined

  return (
    <>
      <form {...props} onSubmit={handleSubmit} noValidate>
        {children}
      </form>
      {status !== 'idle' && status !== 'sending' && (
        <p
          role="status"
          className="_ref_form_status mt-2 text-sm"
          style={{ color: status === 'done' ? '#198754' : '#dc3545' }}
        >
          {message}
        </p>
      )}
    </>
  )
}
