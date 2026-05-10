import { Navbar } from '@/components/navbar'
import Footer from '@/components/Footer'
import MoonPhaseData from '@/components/MoonPhaseData'
import MoonModel from '@/components/MoonModel'
import LunarCalendar from '@/components/LunarCalendar'
import Link from 'next/link'

export const metadata = {
  title: 'Moon Phases & Lunar Calendar — Mika',
  description: 'Track the current moon phase and explore the monthly lunar calendar with phase markers for every day.',
}

const PHASES = [
  { symbol: '○', name: 'New Moon',      desc: 'Dark sky, new beginnings' },
  { symbol: '◔', name: 'Waxing Crescent', desc: 'Setting intentions' },
  { symbol: '◑', name: 'First Quarter', desc: 'Take action' },
  { symbol: '◕', name: 'Waxing Gibbous', desc: 'Refine & grow' },
  { symbol: '●', name: 'Full Moon',     desc: 'Peak illumination' },
  { symbol: '◖', name: 'Waning Gibbous', desc: 'Gratitude & release' },
  { symbol: '◐', name: 'Last Quarter',  desc: 'Let go' },
  { symbol: '◗', name: 'Waning Crescent', desc: 'Rest & reflect' },
]

export default function MoonPhasesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">

        {/* ── Hero header ───────────────────────────────────────────── */}
        <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border/50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-primary/40" />
              <span className="font-sans text-[10px] tracking-[0.55em] uppercase text-primary">
                Lunar Tracker
              </span>
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-center text-balance mb-3">
              Moon Phases &amp; Lunar Calendar
            </h1>
            <p className="font-sans text-sm text-muted-foreground text-center max-w-md mx-auto leading-relaxed">
              Track tonight&apos;s phase and navigate the monthly rhythm of the moon.
            </p>
          </div>
        </section>

        {/* ── Current phase display ─────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-border/40">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* 3D globe */}
              <div className="shrink-0 w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden bg-muted shadow-lg flex items-center justify-center">
                <MoonModel />
              </div>

              {/* Live data */}
              <div className="flex-1 w-full">
                <MoonPhaseData />

                {/* Quick links */}
                <div className="flex items-center gap-4 mt-5">
                  <Link
                    href="/moon/map"
                    className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wide text-primary hover:text-foreground border border-primary/40 hover:border-primary px-4 py-2 rounded-sm transition-colors duration-150"
                  >
                    Explore Moon Map
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Phase legend ─────────────────────────────────────────── */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 border-b border-border/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6 text-center tracking-wide">
              The Eight Phases
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PHASES.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col items-center gap-1.5 py-4 px-3 rounded-md bg-card border border-border hover:border-primary/40 transition-colors duration-150"
                >
                  <span className="text-foreground text-2xl leading-none" aria-hidden="true">
                    {p.symbol}
                  </span>
                  <span className="font-sans text-[11px] font-semibold tracking-wide uppercase text-foreground text-center">
                    {p.name}
                  </span>
                  <span className="font-sans text-[10px] text-muted-foreground text-center leading-snug">
                    {p.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lunar calendar ───────────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-8 text-center tracking-wide">
              Lunar Calendar
            </h2>
            <LunarCalendar />
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
