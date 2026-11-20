'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Curriculum editor (M4/M5): manage chapters + lessons for a course via the CMS
 * API. Drag-free reorder via up/down (position), lesson type select, free flag,
 * publish toggle. Closes the "lessons = client-state string list" mock (audit F2).
 */
const LESSON_TYPES = ['video', 'text', 'audio', 'pdf', 'download', 'asgmt', 'quiz']
const inputCls = 'rounded-[8px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]'
const btnGhost = 'rounded-[8px] border border-[var(--color-border-card)] text-[var(--color-text-primary)] text-xs px-3 py-1.5 hover:border-[var(--color-primary)] cursor-pointer'
const btnPrimary = 'rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-medium px-3 py-1.5 cursor-pointer'

export function CurriculumEditor() {
  const [courses, setCourses] = useState<any[]>([])
  const [courseId, setCourseId] = useState('')
  const [chapters, setChapters] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [newChapter, setNewChapter] = useState('')
  const [newLesson, setNewLesson] = useState({ title: '', lesson_type: 'video', chapter_id: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { fetch('/api/admin/cms/courses?drafts=1').then((r) => r.json()).then((j) => setCourses(j.items ?? [])) }, [])
  const loadCurriculum = useCallback(async (cid: string) => {
    if (!cid) return
    const [ch, le] = await Promise.all([
      fetch('/api/admin/cms/chapters?drafts=1').then((r) => r.json()),
      fetch('/api/admin/cms/lessons?drafts=1').then((r) => r.json()),
    ])
    setChapters((ch.items ?? []).filter((c: any) => String(c.course_id) === cid).sort((a: any, b: any) => a.position - b.position))
    setLessons((le.items ?? []).filter((l: any) => String(l.course_id) === cid).sort((a: any, b: any) => a.position - b.position))
  }, [])
  useEffect(() => { loadCurriculum(courseId) }, [courseId, loadCurriculum])

  async function addChapter() {
    if (!newChapter.trim() || !courseId) return
    await fetch('/api/admin/cms/chapters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course_id: Number(courseId), title: newChapter.trim(), position: chapters.length, is_published: 1 }) })
    setNewChapter(''); setMsg('Chapter added.'); loadCurriculum(courseId)
  }
  async function addLesson() {
    if (!newLesson.title.trim() || !newLesson.chapter_id) return
    await fetch('/api/admin/cms/lessons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course_id: Number(courseId), chapter_id: Number(newLesson.chapter_id), title: newLesson.title.trim(), lesson_type: newLesson.lesson_type, position: lessons.length, is_free: 0, is_published: 1, content: {} }) })
    setNewLesson({ title: '', lesson_type: 'video', chapter_id: '' }); setMsg('Lesson added.'); loadCurriculum(courseId)
  }
  async function moveLesson(id: any, dir: -1 | 1) {
    const ordered = lessons.map((l) => l.id)
    const i = ordered.indexOf(id); const j = i + dir
    if (j < 0 || j >= ordered.length) return
    ;[ordered[i], ordered[j]] = [ordered[j], ordered[i]]
    await fetch(`/api/admin/cms/lessons/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reorder', orderedIds: ordered }) })
    loadCurriculum(courseId)
  }
  async function delLesson(id: any) { await fetch(`/api/admin/cms/lessons/${id}`, { method: 'DELETE' }); loadCurriculum(courseId) }
  async function toggleFree(l: any) { await fetch(`/api/admin/cms/lessons/${l.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_free: l.is_free ? 0 : 1 }) }); loadCurriculum(courseId) }

  return (
    <div className="rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6 mt-8">
      <h3 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-4">Curriculum (chapters &amp; lessons)</h3>
      <label className="block mb-4">
        <span className="block text-sm text-[var(--color-text-secondary)] mb-1">Course</span>
        <select className={inputCls + ' w-full'} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select a course…</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </label>
      {msg ? <p role="status" className="text-sm text-[var(--color-primary-text)] mb-3">{msg}</p> : null}
      {courseId ? (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            <input className={inputCls + ' flex-1 min-w-[200px]'} placeholder="New chapter title" value={newChapter} onChange={(e) => setNewChapter(e.target.value)} />
            <button className={btnPrimary} onClick={addChapter}>+ Chapter</button>
          </div>
          <div className="space-y-3 mb-6">
            {chapters.map((ch) => (
              <div key={ch.id} className="rounded-[8px] border border-[var(--color-border-card)] p-3">
                <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">{ch.position + 1}. {ch.title}</p>
                <ul className="space-y-1 list-none p-0 m-0 mb-2">
                  {lessons.filter((l) => l.chapter_id === ch.id).map((l) => (
                    <li key={l.id} className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                      <span className="uppercase text-[var(--color-text-muted)] w-16">{l.lesson_type}</span>
                      <span className="flex-1 truncate">{l.title}</span>
                      <button className={btnGhost} onClick={() => toggleFree(l)}>{l.is_free ? 'Free ✓' : 'Locked'}</button>
                      <button className={btnGhost} onClick={() => moveLesson(l.id, -1)}>↑</button>
                      <button className={btnGhost} onClick={() => moveLesson(l.id, 1)}>↓</button>
                      <button className={btnGhost} onClick={() => delLesson(l.id)}>✕</button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 flex-wrap">
                  <select className={inputCls} value={newLesson.chapter_id === String(ch.id) ? newLesson.lesson_type : 'video'} onChange={(e) => setNewLesson({ ...newLesson, chapter_id: String(ch.id), lesson_type: e.target.value })}>
                    {LESSON_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input className={inputCls + ' flex-1 min-w-[160px]'} placeholder="New lesson title" value={newLesson.chapter_id === String(ch.id) ? newLesson.title : ''} onChange={(e) => setNewLesson({ ...newLesson, chapter_id: String(ch.id), title: e.target.value })} />
                  <button className={btnPrimary} onClick={addLesson}>+ Lesson</button>
                </div>
              </div>
            ))}
            {!chapters.length ? <p className="text-sm text-[var(--color-text-muted)]">No chapters yet.</p> : null}
          </div>
        </>
      ) : <p className="text-sm text-[var(--color-text-muted)]">Select a course to edit its curriculum.</p>}
    </div>
  )
}
