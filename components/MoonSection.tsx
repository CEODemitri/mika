import MoonPhaseData from './MoonPhaseData'
import MoonModel from './MoonModel'
import Link from 'next/link'

const PHASES = [
  { name: 'New Moon',      symbol: '○', desc: 'Beginnings' },
  { name: 'Waxing',        symbol: '◑', desc: 'Growth' },
  { name: 'Full Moon',     symbol: '●', desc: 'Illumination' },
  { name: 'Waning',        symbol: '◐', desc: 'Release' },
]

export default function MoonSection() {
  return (
    <section className="py-20 px-4 bg-background border-b border-border/50" id="moon">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-primary mb-2">
            Lunar Tracker
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
            The Moon Tonight
          </h2>
        </div>

        {/* Main display */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          {/* 3D Moon */}
          <div className="shrink-0 w-56 h-56 rounded-full overflow-hidden bg-muted shadow-lg flex items-center justify-center">
            <MoonModel />
          </div>

          {/* Phase data + CTA */}
          <div className="flex flex-col gap-5 flex-1 w-full">
            <MoonPhaseData />

            {/* Phase legend — compact 4-item row */}
            <div className="grid grid-cols-4 gap-2 mt-1">
              {PHASES.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-md bg-card border border-border"
                >
                  <span className="text-foreground text-lg leading-none" aria-hidden="true">{p.symbol}</span>
                  <span className="font-sans text-[10px] font-semibold tracking-wide uppercase text-muted-foreground text-center">
                    {p.name}
                  </span>
                  <span className="font-sans text-[9px] text-muted-foreground/70 text-center hidden sm:block">
                    {p.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-5 pt-1">
              <Link
                href="/moon/map"
                className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wide text-primary hover:text-foreground border border-primary/40 hover:border-primary px-4 py-2 rounded-sm transition-colors duration-150"
              >
                Explore Moon Map
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/moon/phases"
                className="font-sans text-xs tracking-wide text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors duration-150"
              >
                Phases &amp; Calendar
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
