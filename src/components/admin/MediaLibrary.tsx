'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** Media library (M4): list + upload via /api/admin/media (local or Cloudinary driver). */
export function MediaLibrary() {
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/media', { cache: 'no-store' })
    if (r.ok) setItems((await r.json()).items ?? [])
  }, [])
  useEffect(() => { load() }, [load])

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setMsg('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await fetch('/api/admin/media', { method: 'POST', body: fd })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Upload failed')
      setMsg(`Uploaded: ${j.item.url}`)
      await load()
    } catch (err) { setMsg(err instanceof Error ? err.message : 'Upload failed') }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = '' }
  }
  async function copy(url: string) { await navigator.clipboard.writeText(url).catch(() => {}); setMsg(`Copied ${url}`) }

  return (
    <div className="rounded-[10px] border border-[var(--color-border-card)] bg-[var(--color-bg-surface)] p-6 mt-8">
      <h3 className="font-heading font-bold text-lg text-[var(--color-text-primary)] mb-4">Media library</h3>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input ref={fileRef} type="file" onChange={upload} disabled={busy} className="text-sm text-[var(--color-text-secondary)]" />
        {busy ? <span className="text-sm text-[var(--color-text-muted)]">Uploading…</span> : null}
      </div>
      {msg ? <p role="status" className="text-sm text-[var(--color-primary-text)] mb-3 break-all">{msg}</p> : null}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="rounded-[8px] border border-[var(--color-border-card)] p-2">
            {m.mime?.startsWith('image/') ? (
              <img src={m.url} alt={m.filename} className="w-full h-24 object-cover rounded-[6px] mb-2" />
            ) : (
              <div className="w-full h-24 flex items-center justify-center rounded-[6px] bg-[var(--color-bg-surface-elevated)] text-xs text-[var(--color-text-muted)] mb-2 uppercase">{m.mime?.split('/')[1] ?? 'file'}</div>
            )}
            <p className="text-xs text-[var(--color-text-secondary)] truncate">{m.filename}</p>
            <button onClick={() => copy(m.url)} className="mt-1 text-xs text-[var(--color-primary-text)] hover:underline cursor-pointer">Copy URL</button>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-[var(--color-text-muted)] col-span-full">No media yet. Upload covers, PDFs, audio or video.</p> : null}
      </div>
    </div>
  )
}
