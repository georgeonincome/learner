'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export interface LessonContent {
  html?: string
  videoUrl?: string | null
  audioUrl?: string | null
  fileMediaId?: string | null
  fileName?: string
  prompt?: string
  questions?: { question: string; options: string[]; answer: number }[]
  passMark?: number
  pending?: boolean
  note?: string
}

export interface LessonPlayerProps {
  lessonId: string
  title: string
  lessonType: string
  content: LessonContent
  fallbackText?: string
  durationSec: number
  completed: boolean
  lastPositionSec: number
  courseTitle: string
  courseId: number
  nextHref?: string
  prevHref?: string
  percent: number
  lockedReason?: string | null
}

const CARD = 'rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-5'
const BTN = 'rounded-[10px] bg-[var(--color-cta)] hover:bg-[var(--color-cta-hover)] text-[var(--color-cta-text)] font-semibold text-sm px-5 py-2.5 transition-colors disabled:opacity-60'

function Pending({ note }: { note?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] p-8 text-center">
      <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Media not uploaded yet</p>
      <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
        {note || 'This lesson is ready for its media. An editor can attach the file in the CMS and it will appear here immediately.'}
      </p>
    </div>
  )
}

/** Strip scripts/event handlers from CMS-authored HTML before rendering. */
function safeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = String(Math.floor(sec % 60)).padStart(2, '0')
  return `${m}:${s}`
}

type QuizResult = { score: number; passed: boolean } | null

export function LessonPlayer(props: LessonPlayerProps) {
  const {
    lessonId, title, lessonType, content, fallbackText, durationSec,
    completed: initialCompleted, lastPositionSec, courseTitle, courseId,
    nextHref, prevHref, percent: initialPercent, lockedReason,
  } = props

  const [completed, setCompleted] = useState(initialCompleted)
  const [percent, setPercent] = useState(initialPercent)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [answer, setAnswer] = useState<Record<number, number>>({})
  const [quiz, setQuiz] = useState<QuizResult>(null)
  const [submission, setSubmission] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { setCompleted(initialCompleted); setPercent(initialPercent) }, [initialCompleted, initialPercent])

  const saveProgress = useCallback(async (partial: { completed?: boolean; percent?: number; lastPositionSec?: number }) => {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, ...partial }),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Could not save progress')
  }, [lessonId])

  // Resume: seek media to the stored position once metadata is available.
  useEffect(() => {
    if (!lastPositionSec || lockedReason) return
    const el = lessonType === 'video' ? videoRef.current : lessonType === 'audio' ? audioRef.current : null
    if (!el) return
    const seek = () => { if (Number.isFinite(el.duration)) el.currentTime = Math.min(lastPositionSec, el.duration - 1) }
    if (el.readyState >= 1) seek(); else el.addEventListener('loadedmetadata', seek, { once: true })
  }, [lastPositionSec, lessonType, lockedReason])

  async function markComplete() {
    if (saving || completed) return
    setSaving(true); setMessage('')
    try {
      await saveProgress({ completed: true, percent: 100 })
      setCompleted(true); setPercent(100)
      // Issue the certificate automatically once the whole course is done.
      const res = await fetch('/api/certificates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, name: '' }),
      })
      if (res.ok) setMessage('Lesson complete — your certificate is ready in the dashboard.')
      else setMessage('Lesson complete.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not save progress')
    } finally { setSaving(false) }
  }

  function trackPosition(sec: number) {
    void saveProgress({ lastPositionSec: Math.floor(sec) }).catch(() => {})
  }

  async function submitQuiz() {
    const res = await fetch('/api/quizzes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, answers: answer }),
    })
    const json = await res.json().catch(() => ({}))
    if (res.ok) { setQuiz(json); if (json.passed) void markComplete() }
    else setMessage(json.error || 'Could not submit quiz')
  }

  async function submitAssignment(e: React.FormEvent) {
    e.preventDefault()
    if (!submission.trim()) { setMessage('Write your answer before submitting.'); return }
    const res = await fetch('/api/assignments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, content: submission }),
    })
    if (res.ok) { setSubmitted(true); setMessage('Assignment submitted. Your instructor will review it.') }
    else setMessage((await res.json().catch(() => ({}))).error || 'Could not submit assignment')
  }

  if (lockedReason) {
    return (
      <div className={CARD}>
        <h1 className="font-heading font-bold text-xl text-[var(--color-text-primary)] mb-2">{title}</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">{lockedReason}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-3">Complete the previous lesson or wait for the scheduled release date.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] overflow-hidden">
        <div className="min-h-[260px] flex flex-col items-stretch justify-center bg-[var(--color-bg-surface-elevated)] p-4">
          {lessonType === 'video' ? (
            content.videoUrl ? (
              content.videoUrl.includes('youtube') || content.videoUrl.includes('youtu.be') || content.videoUrl.includes('vimeo') ? (
                <iframe className="w-full aspect-video rounded-lg" src={content.videoUrl} title={title} allowFullScreen allow="accelerometer; autoplay; encrypted-media; picture-in-picture" />
              ) : (
                <video ref={videoRef} className="w-full max-h-[60vh] rounded-lg" controls preload="metadata" src={content.videoUrl}
                  onTimeUpdate={(e) => trackPosition(e.currentTarget.currentTime)} />
              )
            ) : <Pending note={content.note} />
          ) : null}

          {lessonType === 'audio' ? (
            content.audioUrl ? (
              <div className="w-full rounded-xl bg-[var(--color-bg-surface)] p-6">
                <audio ref={audioRef} className="w-full" controls preload="metadata" src={content.audioUrl}
                  onTimeUpdate={(e) => trackPosition(e.currentTarget.currentTime)} />
              </div>
            ) : <Pending note={content.note} />
          ) : null}

          {lessonType === 'text' ? (
            <div className="w-full rounded-xl bg-[var(--color-bg-surface)] p-6 prose-sm">
              {content.html ? (
                <div dangerouslySetInnerHTML={{ __html: safeHtml(content.html) }} />
              ) : fallbackText ? (
                <p className="whitespace-pre-line text-sm leading-7 text-[var(--color-text-secondary)]">{fallbackText}</p>
              ) : <Pending note={content.note} />}
            </div>
          ) : null}

          {lessonType === 'pdf' ? (
            content.fileMediaId ? (
              <iframe className="w-full h-[70vh] rounded-lg bg-white" src={`/api/media/file?mediaId=${encodeURIComponent(content.fileMediaId)}&lessonId=${encodeURIComponent(lessonId)}#toolbar=1`} title={title} />
            ) : <Pending note={content.note} />
          ) : null}

          {lessonType === 'download' ? (
            content.fileMediaId ? (
              <div className="w-full rounded-xl bg-[var(--color-bg-surface)] p-6 text-center">
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">{content.fileName || 'Lesson resource file'}</p>
                <a className={BTN + ' inline-block no-underline'} href={`/api/media/file?mediaId=${encodeURIComponent(content.fileMediaId)}&lessonId=${encodeURIComponent(lessonId)}&download=1`}>
                  Download file
                </a>
              </div>
            ) : <Pending note={content.note} />
          ) : null}

          {lessonType === 'asgmt' ? (
            <form onSubmit={submitAssignment} className="w-full rounded-xl bg-[var(--color-bg-surface)] p-6 space-y-3">
              <p className="text-sm text-[var(--color-text-secondary)]">{content.prompt || `Submit your work for “${title}”.`}</p>
              <textarea value={submission} onChange={(e) => setSubmission(e.target.value)} rows={6} disabled={submitted}
                placeholder="Paste your work or a link…" className="w-full rounded-lg border border-[var(--color-border-card)] bg-[var(--color-bg-surface-elevated)] p-3 text-sm text-[var(--color-text-primary)]" />
              <button type="submit" className={BTN} disabled={submitted}>{submitted ? 'Submitted' : 'Submit assignment'}</button>
            </form>
          ) : null}

          {lessonType === 'quiz' ? (
            <div className="w-full rounded-xl bg-[var(--color-bg-surface)] p-6 space-y-5">
              {content.questions?.length ? content.questions.map((q, qi) => (
                <fieldset key={qi}>
                  <legend className="text-sm font-medium text-[var(--color-text-primary)] mb-2">{qi + 1}. {q.question}</legend>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
                        <input type="radio" name={`q-${qi}`} checked={answer[qi] === oi} onChange={() => setAnswer((a) => ({ ...a, [qi]: oi }))} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )) : <Pending note={content.note || 'Quiz questions have not been added yet.'} />}
              {content.questions?.length ? (
                <div>
                  <button className={BTN} onClick={submitQuiz}>Submit answers</button>
                  {quiz ? <p className="mt-2 text-sm text-[var(--color-text-primary)]">Score: {quiz.score}% — {quiz.passed ? 'Passed' : `You need ${content.passMark ?? 70}% to pass`}.</p> : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="p-4 flex flex-wrap items-center gap-3">
          <h1 className="font-heading font-bold text-lg text-[var(--color-text-primary)] flex-1">{title}</h1>
          <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-secondary)] uppercase">{lessonType === 'asgmt' ? 'Assignment' : lessonType}</span>
          {durationSec ? <span className="text-xs text-[var(--color-text-muted)]">{fmt(durationSec)}</span> : null}
          <span className={`text-xs px-3 py-1.5 rounded-full ${completed ? 'bg-[var(--color-bg-surface-elevated)] text-[var(--color-primary-text)]' : 'bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-muted)]'}`}>
            {completed ? '✓ Completed' : 'Not completed'}
          </span>
        </div>
      </div>

      <div className={CARD}>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[var(--color-text-secondary)]">{courseTitle} progress</span>
          <span className="text-[var(--color-text-primary)] font-medium">{percent}%</span>
        </div>
        <div className="w-full rounded-full h-2 bg-[var(--color-bg-surface-elevated)]">
          <div className="bg-[var(--color-primary)] h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex gap-3 mt-5">
          <button className={BTN} onClick={markComplete} disabled={completed || saving || !!lockedReason}>
            {saving ? 'Saving…' : completed ? '✓ Completed' : 'Mark complete'}
          </button>
          {prevHref ? <Link href={prevHref} className="no-underline rounded-[10px] border border-[var(--color-border-card)] px-4 py-2.5 text-sm text-[var(--color-text-primary)]">← Previous</Link> : null}
          {nextHref ? <Link href={nextHref} className="no-underline rounded-[10px] border border-[var(--color-border-card)] px-4 py-2.5 text-sm text-[var(--color-text-primary)]">Next lesson →</Link> : null}
        </div>
        {message ? <p role="status" className="mt-3 text-sm text-[var(--color-primary-text)]">{message}</p> : null}
      </div>
    </div>
  )
}
