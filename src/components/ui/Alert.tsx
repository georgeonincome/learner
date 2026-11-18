'use client'

import { clsx, type ClassValue } from 'clsx'
import { forwardRef, type HTMLAttributes } from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, ...props }, ref) => {
    const base =
      'flex items-start gap-3 p-4 rounded-md border text-sm'
    const variants = {
      info:
        'bg-surface-elevated text-text-primary border-blue-500',
      success:
        'bg-green-50 text-green-800 border-green-200',
      warning:
        'bg-amber-50 text-amber-800 border-amber-200',
      error:
        'bg-red-50 text-red-800 border-red-200',
    }
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {title && <h3 className="font-semibold">{title}</h3>}
        {props.children}
      </div>
    )
  },
)

Alert.displayName = 'Alert'
