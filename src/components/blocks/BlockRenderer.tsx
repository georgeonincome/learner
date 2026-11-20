import React from 'react'
import type { CompiledBlock } from '@/lib/blocks/compile'
import { BlogGrid } from '@/components/blocks/BlogGrid'

/**
 * Renders compiled Tailwind blocks (M2). Pure presentation: no reference CSS,
 * no captured DOM — structure/measurements come from the compiler, colors from
 * Lena tokens, copy from the original-copy policy.
 */
export function BlockRenderer({ blocks }: { blocks: CompiledBlock[] }) {
  return <>{blocks.map((b) => <Block key={b.id} block={b} />)}</>
}

function Block({ block: b }: { block: CompiledBlock }) {
  if (b.component === 'blog-grid') {
    return (
      <div className={b.cls || undefined} style={b.style} data-layout-section={b.section ? '' : undefined}>
        <BlogGrid />
      </div>
    )
  }
  const props: Record<string, unknown> = {}
  if (b.cls) props.className = b.cls
  if (b.style) props.style = b.style
  if (b.section) {
    props.id = b.id
    props['data-layout-section'] = ''
  }
  if (b.tag === 'img') {
    const img = <img src={b.src} alt={b.alt ?? ''} className={b.cls || 'max-w-full h-auto'} style={b.style} loading="lazy" />
    return b.href ? <a href={b.href}>{img}</a> : img
  }
  const children = (
    <>
      {b.html ? <span dangerouslySetInnerHTML={{ __html: b.html }} /> : null}
      {b.children.map((c) => <Block key={c.id} block={c} />)}
    </>
  )
  if (b.tag === 'a') {
    return <a href={b.href ?? '#'} {...props}>{children}</a>
  }
  return React.createElement(b.tag, props, children)
}
