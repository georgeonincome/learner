import React from 'react'
import { SiteHeader } from './SiteHeader'

/**
 * Surface for the app's own screens (checkout, dashboard, lesson player, book
 * reader, catalog-driven course page).
 *
 * The captured reference pages are light with dark navy cards; these screens are
 * the product's own dark-themed app area, so they sit on the brand ink with the
 * light text tokens (`text-text-primary`, `bg-surface`, `text-text-muted`).
 */
export function AppSurface({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="app-surface"
      style={{
        minHeight: '100vh',
        background: 'var(--brand-ink)',
        color: 'var(--color-text-primary)',
        // The brand ink is darker than the cards; keep text off the edges.
        paddingBottom: '2px',
      }}
    >
      <SiteHeader />
      {children}
    </div>
  )
}
