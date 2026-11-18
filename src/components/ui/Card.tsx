'use client'

import { clsx } from 'clsx'
import { type HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** additional props */
  [key: string]: unknown
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('bg-surface border border-border rounded-xl shadow-sm p-3 text-text-primary', className)}
      {...props}
    />
  )
})

Card.displayName = 'Card'
