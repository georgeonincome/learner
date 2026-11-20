'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Generic CMS manager (M4). Turso-backed CRUD via /api/admin/cms/[entity] with
 * draft/publish/schedule, duplicate, delete, revision restore, and per-item SEO.
 * Replaces the in-memory adminStore (audit G/F2). Field sets are per-entity.
 */
type Field = { key: string; label: string; type: 'text' | 'textarea' | 'number' | 'select' | 'json'; options?: string[]; placeholder?: string }

const FIELDS: Record<string, Field[]> = {
  courses: [
    { key: 'title', label: 'Title', type: 'text' }, { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' }, { key: 'short_description', label: 'Short description', type: 'textarea' },
    { key: 'description', label: 'Description', type: 'textarea' }, { key: 'course_type', label: 'Type', type: 'select', options: ['SINGLE', 'BUNDLE'] },
    { key: 'course_level', label: 'Level', type: 'text' }, { key: 'progressive_mode', label: 'Sequential unlock (0/1)', type: 'number' },
    { key: 'learning_list', label: 'What you’ll learn (JSON array)', type: 'json' }, { key: 'includes_list', label: 'Includes (JSON array)', type: 'json' },
  ],
  books: [
    { key: 'title', label: 'Title', type: 'text' }, { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'author', label: 'Author', type: 'text' }, { key: 'category', label: 'Category', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }, { key: 'format', label: 'Format', type: 'select', options: ['ebook', 'audiobook', 'pdf'] },
    { key: 'pages', label: 'Pages', type: 'number' }, { key: 'preview_chapters', label: 'Preview chapters', type: 'number' },
    { key: 'access', label: 'Access', type: 'select', options: ['free', 'purchase', 'membership'] },
    { key: 'chapters', label: 'Chapters (JSON [{title,body}])', type: 'json' },
  ],
  blog_posts: [
    { key: 'title', label: 'Title', type: 'text' }, { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea' }, { key: 'category_id', label: 'Category id', type: 'number' },
    { key: 'author', label: 'Author', type: 'text' }, { key: 'body', label: 'Body (HTML)', type: 'textarea' },
  ],
  pages: [
    { key: 'title', label: 'Title', type: 'text' }, { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'template', label: 'Template', type: 'select', options: ['blocks', 'home', 'path-landing', 'legal', 'lead-magnet', 'form'] },
    { key: 'blocks', label: 'Compiled blocks (JSON)', type: 'json' },
  ],
  membership_tiers: [
    { key: 'name', label: 'Name', type: 'text' }, { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }, { key: 'price_usd', label: 'Price USD', type: 'number' },
    { key: 'price_zmw', label: 'Price ZMW', type: 'number' }, { key: 'interval', label: 'Interval', type: 'select', options: ['month', 'year', 'one_time'] },
    { key: 'features', label: 'Features (JSON array)', type: 'json' },
  ],
  testimonials: [
    { key: 'name', label: 'Name', type: 'text' }, { key: 'role', label: 'Role', type: 'text' },
    { key: 'quote', label: 'Quote', type: 'textarea' }, { key: 'result', label: 'Result', type: 'text' }, { key: 'position', label: 'Position', type: 'number' },
  ],
}

const SEO_FIELDS: Field[] = [
  { key: 'seo_title', label: 'SEO title', type: 'text' }, { key: 'seo_description', label: 'SEO description', type: 'textarea' },
  { key: 'og_image', label: 'OG image URL', type: 'text' }, { key: 'canonical', label: 'Canonical URL', type: 'text' },
]

function toForm(item: any, fields: Field[]): Record<string, string> {
  const f: Record<string, string> = {}
  for (const fld of fields) {
    const v = item?.[fld.key]
    f[fld.key] = v == null ? '' : (fld.type === 'json' && typeof v === 'string' ? v : String(v))
  }
  return f
}
function fromForm(form: Record<string, string>, fields: Field[]): Record<string, any> {
  const out: Record<string, any> = {}
  for (const fld of fields) {
    const raw = form[fld.key]
    if (raw === '' || raw == null) { out[fld.key] = fld.type === 'number' ? null : ''; continue }
    if (fld.type === 'number') out[fld.key] = Number(raw)
    else if (fld.type === 'json') { try { out[fld.key] = JSON.parse(raw) } catch { out[fld.key] = raw } }
    else out[fld.key] = raw
  }
  return out
}

const inputCls = 'w-full rounded-[8px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]'
const btnPrimary = 'rounded-[8px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-60 text-white text-sm font-medium px-4 py-2 cursor-pointer'
const btnGhost = 'rounded-[8px] border border-[var(--color-border-card)] text-[var(--color-text-primary)] text-sm px-3 py-1.5 hover:border-[var(--color-primary)] cursor-pointer'

export function CmsManager({ entity, title }: { entity: string; title: string }) {
  const fields = FIELDS[entity] ?? [{ key: 'title', label: 'Title', type: 'text' as const }, { key: 'slug', label: 'Slug', type: 'text' as const }]
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [revisions, setRevisions] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/cms/${entity}?drafts=1`, { cache: 'no-store' })
    if (r.ok) setItems((await r.json()).items ?? [])
  }, [entity])
  useEffect(() => { load() }, [load])

  function startNew() { setEditing({}); setForm(toForm({}, [...fields, ...SEO_FIELDS])); setRevisions([]); setMsg('') }
  async function startEdit(item: any) {
    setEditing(item); setForm(toForm(item, [...fields, ...SEO_FIELDS])); setMsg('')
    const r = await fetch(`/api/admin/cms/${entity}/${item.id}`)
    if (r.ok) setRevisions((await r.json()).revisions ?? [])
  }
  async function save() {
    setBusy(true); setMsg('')
    const data = fromForm(form, [...fields, ...SEO_FIELDS])
    try {
      const r = editing?.id
        ? await fetch(`/api/admin/cms/${entity}/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        : await fetch(`/api/admin/cms/${entity}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Save failed')
      setMsg('Saved.'); setEditing(null); await load()
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Save failed') } finally { setBusy(false) }
  }
  async function action(id: any, action: string, extra: Record<string, any> = {}) {
    setBusy(true); setMsg('')
    try {
      const r = await fetch(`/api/admin/cms/${entity}/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...extra }) })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Action failed')
      setMsg(`${action} done.`); await load(); if (editing?.id === id) setEditing(null)
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Action failed') } finally { setBusy(false) }
  }
  async function remove(id: any) {
    if (!confirm('Delete this item?')) return
    setBusy(true)
    await fetch(`/api/admin/cms/${entity}/${id}`, { method: 'DELETE' })
    setEditing(null); await load(); setBusy(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-heading font-bold text-2xl text-[var(--color-text-primary)]">{title} <span className="text-sm text-[var(--color-text-muted)]">({items.length})</span></h2>
        <button className={btnPrimary} onClick={startNew}>+ New</button>
      </div>
      {msg ? <p role="status" className="text-sm text-[var(--color-primary-text)] mb-4">{msg}</p> : null}

      {editing ? (
        <div className="rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6 mb-8">
          <h3 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-4">{editing.id ? `Edit #${editing.id}` : 'New item'}</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className={f.type === 'textarea' || f.type === 'json' ? 'md:col-span-2' : ''}>
                <span className="block text-sm text-[var(--color-text-secondary)] mb-1">{f.label}</span>
                {f.type === 'textarea' || f.type === 'json' ? (
                  <textarea rows={f.type === 'json' ? 5 : 4} className={inputCls} value={form[f.key] ?? ''} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                ) : f.type === 'select' ? (
                  <select className={inputCls} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                    <option value="">—</option>{f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type === 'number' ? 'number' : 'text'} className={inputCls} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                )}
              </label>
            ))}
          </div>
          <details className="mt-4">
            <summary className="text-sm text-[var(--color-text-secondary)] cursor-pointer">SEO fields</summary>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-3">
              {SEO_FIELDS.map((f) => (
                <label key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <span className="block text-sm text-[var(--color-text-secondary)] mb-1">{f.label}</span>
                  {f.type === 'textarea'
                    ? <textarea rows={2} className={inputCls} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                    : <input className={inputCls} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
                </label>
              ))}
            </div>
          </details>
          <div className="flex gap-2 flex-wrap mt-6 items-center">
            <button className={btnPrimary} disabled={busy} onClick={save}>Save draft</button>
            {editing.id ? (
              <>
                <button className={btnGhost} disabled={busy} onClick={() => action(editing.id, 'publish')}>Publish</button>
                <button className={btnGhost} disabled={busy} onClick={() => action(editing.id, 'unpublish')}>Unpublish</button>
                <input type="datetime-local" className={inputCls + ' max-w-[220px]'} value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
                <button className={btnGhost} disabled={busy || !scheduleAt} onClick={() => action(editing.id, 'schedule', { publishAt: new Date(scheduleAt).toISOString() })}>Schedule</button>
                <button className={btnGhost} disabled={busy} onClick={() => action(editing.id, 'duplicate')}>Duplicate</button>
                <button className={btnGhost} disabled={busy} onClick={() => remove(editing.id)}>Delete</button>
              </>
            ) : null}
            <button className={btnGhost} onClick={() => setEditing(null)}>Cancel</button>
          </div>
          {revisions.length ? (
            <div className="mt-6">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">Revision history</p>
              <ul className="space-y-1 list-none p-0 m-0">
                {revisions.map((rv) => (
                  <li key={rv.id} className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <span>v{rv.version} · {rv.author} · {new Date(rv.created_at).toLocaleString()}</span>
                    <button className={btnGhost} disabled={busy} onClick={() => action(editing.id, 'restore', { version: rv.version })}>Restore</button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between gap-3 rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-4">
            <div className="min-w-0">
              <p className="text-[var(--color-text-primary)] font-medium truncate">{it.title ?? it.name ?? it.question ?? `#${it.id}`}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">#{it.id} · {it.slug ?? ''} · <span className={it.status === 'published' ? 'text-[var(--color-success)]' : it.status === 'scheduled' ? 'text-[var(--color-warning)]' : ''}>{it.status ?? '—'}</span></p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className={btnGhost} onClick={() => startEdit(it)}>Edit</button>
              {it.status !== 'published'
                ? <button className={btnGhost} disabled={busy} onClick={() => action(it.id, 'publish')}>Publish</button>
                : <button className={btnGhost} disabled={busy} onClick={() => action(it.id, 'unpublish')}>Unpublish</button>}
            </div>
          </div>
        ))}
        {!items.length ? <p className="text-[var(--color-text-muted)] text-sm py-8 text-center">No items yet.</p> : null}
      </div>
    </div>
  )
}
