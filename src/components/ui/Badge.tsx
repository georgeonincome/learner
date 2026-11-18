'use client'

import { clsx, type ClassValue } from 'clsx'
import { forwardRef, type HTMLAttributes } from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const base =
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium'
    const variants = {
      default: 'bg-badge text-text-primary border border-border',
      secondary: 'bg-surface-elevated text-text-primary border border-border',
      success: 'bg-green-100 text-green-800 border border-green-200',
      warning: 'bg-amber-100 text-amber-800 border border-amber-200',
      danger: 'bg-red-100 text-red-800 border border-red-200',
    }
    return (
      <span
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  },
)

Badge.displayName = 'Badge'
