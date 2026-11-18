'use client'

import { clsx, type ClassValue } from 'clsx'
import { forwardRef, type HTMLAttributes } from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2 rounded-md border border-border bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="text-xs text-gray-text">{helper}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
