import { notFound } from 'next/navigation'

// Live reference returns 404 for this URL (audit A6 / decision D1). Replicate
// the true 404 status rather than serving 200-with-404-content.
export default function Page() {
  notFound()
}
