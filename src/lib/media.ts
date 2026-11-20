import { query } from '@/lib/turso'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Media library (M4, audit F11/G12). Driver abstraction:
 *  - local (dev/test): files stored under public/media, served statically. No
 *    production credentials needed.
 *  - cloudinary (prod): signed uploads via CLOUDINARY_* env.
 * Every upload is recorded in the `media` table for the library UI.
 */
export type MediaDriver = 'local' | 'cloudinary'
export function mediaDriver(): MediaDriver {
  return process.env.MEDIA_DRIVER === 'cloudinary' ? 'cloudinary' : 'local'
}

export interface MediaRecord {
  id: string; driver: string; url: string; public_id: string | null
  filename: string; mime: string; bytes: number; width: number | null; height: number | null
}

const LOCAL_DIR = path.join(process.cwd(), 'public', 'media')

export async function recordMedia(rec: Omit<MediaRecord, 'width' | 'height'> & { width?: number | null; height?: number | null }, uploadedBy: string) {
  await query(
    `INSERT OR REPLACE INTO media (id, driver, url, public_id, filename, mime, bytes, width, height, uploaded_by)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [rec.id, rec.driver, rec.url, rec.public_id, rec.filename, rec.mime, rec.bytes, rec.width ?? null, rec.height ?? null, uploadedBy],
  )
}

export async function listMedia() {
  return query<MediaRecord>('SELECT * FROM media ORDER BY created_at DESC LIMIT 500')
}

/** Store an uploaded buffer. Returns the media record. */
export async function storeUpload(buf: Buffer, filename: string, mime: string, uploadedBy: string): Promise<MediaRecord> {
  const id = crypto.randomUUID()
  const ext = (filename.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (mediaDriver() === 'cloudinary') {
    const cloud = process.env.CLOUDINARY_CLOUD_NAME
    const key = process.env.CLOUDINARY_API_KEY
    const secret = process.env.CLOUDINARY_API_SECRET
    if (!cloud || !key || !secret) throw new Error('Cloudinary is not configured')
    const timestamp = Math.floor(Date.now() / 1000)
    const publicId = `lena/${id}`
    const signature = crypto.createHash('sha1').update(`public_id=${publicId}&timestamp=${timestamp}${secret}`).digest('hex')
    const form = new FormData()
    form.append('file', new Blob([new Uint8Array(buf)], { type: mime }), filename)
    form.append('api_key', key)
    form.append('timestamp', String(timestamp))
    form.append('public_id', publicId)
    form.append('signature', signature)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/auto/upload`, { method: 'POST', body: form })
    if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.status}`)
    const json: any = await res.json()
    const rec = { id, driver: 'cloudinary', url: json.secure_url, public_id: json.public_id, filename, mime, bytes: buf.length, width: json.width ?? null, height: json.height ?? null }
    await recordMedia(rec, uploadedBy)
    return rec
  }
  // local driver
  fs.mkdirSync(LOCAL_DIR, { recursive: true })
  const file = `${id}.${ext}`
  fs.writeFileSync(path.join(LOCAL_DIR, file), buf)
  const rec = { id, driver: 'local', url: `/media/${file}`, public_id: null, filename, mime, bytes: buf.length, width: null, height: null }
  await recordMedia(rec, uploadedBy)
  return rec
}

/** Signed Cloudinary upload params for direct client uploads (prod). */
export function cloudinarySignParams(folder = 'lena') {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME
  const key = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud || !key || !secret) return null
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest('hex')
  return { cloudName: cloud, apiKey: key, timestamp, folder, signature }
}
