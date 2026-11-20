import { MediaLibrary } from '@/components/admin/MediaLibrary'

export const dynamic = 'force-dynamic'

export default function AdminMediaPage() {
  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-[var(--color-text-primary)] mb-2">Media</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">Upload and manage images, PDFs, audio and video. Uses the local driver in dev; Cloudinary signed uploads in production.</p>
      <MediaLibrary />
    </div>
  )
}
