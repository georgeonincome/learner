'use client'

import { clsx, type ClassValue } from 'clsx'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithRef, forwardRef } from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

const buttonVariants = cva(
  'font-medium font-heading text-button-md transition-all disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-[#151515] px-4 py-2 rounded-md hover:bg-primary-hover',
        secondary:
          'bg-magenta text-[#151515] px-4 py-2 rounded-full hover:bg-magenta-hover',
        outline:
          'border border-border text-text-primary px-4 py-2 rounded-md hover:bg-border hover:text-primary',
        ghost:
          'text-primary px-4 py-2 rounded-md hover:text-primary-hover',
        danger:
          'bg-[#ef4444] text-white px-4 py-2 rounded-md hover:bg-red-700',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-button-md',
        lg: 'px-6 py-3 text-button-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends VariantProps<typeof buttonVariants>,
    ComponentPropsWithRef<'button'> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
