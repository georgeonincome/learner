'use client'

import { clsx } from 'clsx'
import { forwardRef, type HTMLAttributes } from 'react'

export function cn(...inputs: unknown[]) {
  return clsx(inputs)
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'dark'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const base =
      'border border-card rounded-xl shadow-sm p-3 text-text-primary'
    const variants = {
      default: 'bg-surface',
      elevated: 'bg-surface-elevated',
      dark: 'bg-near-black',
    }
    return (
      <div
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  },
)

Card.displayName = 'Card'
