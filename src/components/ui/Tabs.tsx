'use client'

import { clsx, type ClassValue } from 'clsx'
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export function Tabs({ children, defaultValue, onValueChange }: { children: ReactNode; defaultValue?: string; onValueChange?: (value: string) => void }) {
  const [value, setValue] = useState(defaultValue ?? '')
  const handleChange = useCallback((v: string) => {
    setValue(v)
    onValueChange?.(v)
  }, [onValueChange])
  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      {children}
    </TabsContext.Provider>
  )
}

export function TabsList({ children }: { children: ReactNode }) {
  return (
    <div
      className="inline-flex gap-1 border-b border-border p-1"
      role="tablist"
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ children, value }: { children: ReactNode; value: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs')
  const active = ctx.value === value
  return (
    <button
      role="tab"
      aria-selected={active}
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-surface-elevated text-primary border-b-2 border-primary'
          : 'text-gray-text hover:bg-surface-elevated',
      )}
      onClick={() => ctx.onValueChange(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value }: { children: ReactNode; value: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used within Tabs')
  return (
    <div
      role="tabpanel"
      hidden={ctx.value !== value}
      className={cn('mt-4 space-y-4', ctx.value !== value && 'hidden')}
    >
      {children}
    </div>
  )
}

Tabs.displayName = 'Tabs'
TabsList.displayName = 'TabsList'
TabsTrigger.displayName = 'TabsTrigger'
TabsContent.displayName = 'TabsContent'
