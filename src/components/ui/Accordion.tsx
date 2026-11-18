'use client'

import { clsx, type ClassValue } from 'clsx'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

type AccordionValue = string | string[]

interface AccordionContextValue {
  value: AccordionValue
  onValueChange: (value: AccordionValue) => void
  type: 'single' | 'multiple'
}

const AccordionContext =
  createContext<AccordionContextValue | undefined>(undefined)

export function Accordion({
  children,
  defaultValue,
  type = 'multiple',
  onValueChange,
}: {
  children: ReactNode
  defaultValue?: AccordionValue
  type?: 'single' | 'multiple'
  onValueChange?: (value: AccordionValue) => void
}) {
  const [value, setValue] = useState<AccordionValue>(
    defaultValue ?? (type === 'single' ? '' : []),
  )
  const handleChange = useCallback((v: AccordionValue) => {
    setValue(v)
    onValueChange?.(v)
  }, [onValueChange])
  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleChange, type }}>
      {children}
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ children }: { children: ReactNode }) {
  return <div className="border-b border-border last:border-none">{children}</div>
}

export function AccordionTrigger({ value }: { value: string }) {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('AccordionTrigger must be used within Accordion')
  const active =
    ctx.type === 'single' ? ctx.value === value : (ctx.value as string[]).includes(value)
  return (
    <button
      className={cn(
        'flex w-full items-center justify-between py-4 text-left text-sm font-medium text-text-primary transition-colors hover:text-primary',
        active ? 'font-bold' : '',
      )}
      onClick={() => {
        if (ctx.type === 'single') {
          ctx.onValueChange(active ? '' : value)
        } else {
          const current = ctx.value as string[]
          ctx.onValueChange(
            active ? current.filter((v) => v !== value) : [...current, value],
          )
        }
      }}
    >
      <span className="transition-transform duration-300">
        {active ? '▲' : '▼'}
      </span>
    </button>
  )
}

export function AccordionContent({
  children,
  value,
}: {
  children: ReactNode
  value: string
}) {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('AccordionContent must be used within Accordion')
  const active =
    ctx.type === 'single' ? ctx.value === value : (ctx.value as string[]).includes(value)
  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300 ease-out',
        active ? 'max-h-[500px] pb-4' : 'max-h-0 pb-0',
      )}
      hidden={!active}
    >
      {children}
    </div>
  )
}

Accordion.displayName = 'Accordion'
AccordionItem.displayName = 'AccordionItem'
AccordionTrigger.displayName = 'AccordionTrigger'
AccordionContent.displayName = 'AccordionContent'
