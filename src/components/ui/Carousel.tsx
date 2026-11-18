'use client'

import { clsx, type ClassValue } from 'clsx'
import { useCallback, useRef, useState } from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export interface CarouselProps {
  children: React.ReactElement[]
  className?: string
  showControls?: boolean
}

export function Carousel({ children, className, showControls = true }: CarouselProps) {
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % children.length)
  }, [children.length])
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + children.length) % children.length)
  }, [children.length])

  return (
    <div className={cn('relative', className)}>
      <div
        ref={containerRef}
        className="overflow-hidden rounded-xl border border-card bg-surface"
      >
        <div className="flex transition-transform duration-500 ease-in-out">
          {children.map((child, i) => (
            <div
              key={i}
              className="min-w-full flex-shrink-0"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {showControls && children.length > 1 && (
        <div className="flex items-center justify-between mt-3 px-2">
          <button
            onClick={prev}
            disabled={index === 0}
            className="px-3 py-2 rounded-md border border-border text-text-primary disabled:opacity-50 disabled:pointer-events-none hover:bg-surface-elevated"
          >
            Prev
          </button>
          <button
            onClick={next}
            disabled={index === children.length - 1}
            className="px-3 py-2 rounded-md border border-border text-text-primary disabled:opacity-50 disabled:pointer-events-none hover:bg-surface-elevated"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
