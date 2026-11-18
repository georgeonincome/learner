'use client'

import { clsx, type ClassValue } from 'clsx'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

type ToastVariant = 'default' | 'destructive' | 'success' | 'info'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (props: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({
  children,
}: {
  children: ReactNode
}) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    (props: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { ...props, id }])
      if (props.duration !== 0) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, props.duration ?? 5000)
        ;(window as any).__toastTimers =
          (window as any).__toastTimers || {}
        ;(window as any).__toastTimers[id] = timer
      }
    },
    [],
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    return () => {
      const timers = (window as any).__toastTimers || {}
      Object.keys(timers).forEach((key) => {
        const t = timers[key] as number | undefined
        if (t !== undefined) clearTimeout(t)
      })
    }
  }, [])

  const value = useMemo(
    () => ({ toasts, toast, dismiss }),
    [toasts, toast, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const variants = {
    default: 'bg-surface border border-border text-text-primary',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-surface-elevated border-blue-500 text-text-primary',
  }
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-md shadow-sm border min-w-[300px] text-sm animate-in fade-in slide-in-from-right-2 duration-300',
        variants[toast.variant ?? 'default'],
      )}
      role="alert"
      aria-live="polite"
    >
      {toast.title && <h4 className="font-semibold">{toast.title}</h4>}
      {toast.description && <p className="text-xs opacity-90">{toast.description}</p>}
      <button
        onClick={onDismiss}
        className="ml-auto shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
