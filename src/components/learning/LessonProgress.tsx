'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

export function LessonProgress({ lessonId }: { lessonId: string }) {
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/progress?lessonId=${encodeURIComponent(lessonId)}`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = (await res.json()) as {
          progress: { completed: number } | null
        }
        setCompleted(data.progress?.completed === 1)
      }
    } catch {
      // Progress not available — leave defaults.
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  useEffect(() => {
    load()
  }, [load])

  async function markComplete() {
    setSaving(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          completed: true,
          percent: 100,
          lastPositionSec: 0,
        }),
      })
      if (res.ok) setCompleted(true)
    } catch {
      // Ignore network errors; user can retry.
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4">
      <Button
        variant="primary"
        size="sm"
        className="w-full"
        disabled={completed || loading || saving}
        onClick={markComplete}
      >
        {loading
          ? 'Loading…'
          : completed
            ? '✓ Completed'
            : saving
              ? 'Saving…'
              : 'Mark complete'}
      </Button>
    </div>
  )
}
