import type { Metadata } from 'next'
import MoonMap from '@/components/MoonMap'

export const metadata: Metadata = {
  title: 'Moon Map — Mika',
  description: 'Interactive lunar surface map with crater labels, overlay options for constellations, zodiac, and planets.',
}

export default function MoonMapPage() {
  return (
    <main className="w-screen overflow-hidden" style={{ height: '100dvh' }}>
      <MoonMap />
    </main>
  )
}
