import { notFound } from 'next/navigation'

// Live reference returns 404 for this URL (audit A6 / decision D1).
export default function Page() {
  notFound()
}
