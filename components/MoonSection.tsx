import MoonPhaseData from './MoonPhaseData'
import MoonModel from './MoonModel'
import Link from 'next/link'

const moonPhases = [
  { name: 'New Moon', symbol: '🌑', desc: 'New beginnings & intention setting' },
  { name: 'Waxing Crescent', symbol: '🌒', desc: 'Growth & manifestation' },
  { name: 'First Quarter', symbol: '🌓', desc: 'Action & decisions' },
  { name: 'Waxing Gibbous', symbol: '🌔', desc: 'Refinement & adjustment' },
  { name: 'Full Moon', symbol: '🌕', desc: 'Fulfillment & illumination' },
  { name: 'Waning Gibbous', symbol: '🌖', desc: 'Gratitude & sharing' },
  { name: 'Last Quarter', symbol: '🌗', desc: 'Release & reflection' },
  { name: 'Waning Crescent', symbol: '🌘', desc: 'Rest & surrender' },
]

export default function MoonSection() {
  return (
    <section className="py-24 px-4 bg-background" id="moon">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans font-medium mb-3">
            Lunar Tracker
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
            The Moon Tonight
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed max-w-lg mx-auto font-sans">
            Real-time lunar data to guide your daily rhythms and cosmic awareness.
          </p>
        </div>

        {/* Moon display grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* 3D Moon model */}
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="rounded-full overflow-hidden bg-muted w-72 h-72 flex items-center justify-center shadow-lg">
              <MoonModel />
            </div>
          </div>

          {/* Live phase data */}
          <div className="flex flex-col gap-6">
            <MoonPhaseData />
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { label: 'Previous Phase', value: '—' },
                { label: 'Next Phase', value: '—' },
                { label: 'Illumination', value: '—%' },
                { label: 'Days in Cycle', value: '—' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-card border border-border rounded-md px-4 py-3"
                >
                  <p className="text-xs text-muted-foreground tracking-widest uppercase font-sans mb-1">
                    {item.label}
                  </p>
                  <p className="text-foreground font-serif text-lg font-semibold">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/moon/calendar"
              className="inline-block text-gold hover:text-primary text-sm font-sans tracking-wide underline underline-offset-4 transition-colors"
            >
              View Full Lunar Calendar &rarr;
            </Link>
          </div>
        </div>

        {/* Moon phases row */}
        <div>
          <h3 className="font-serif text-2xl text-center text-foreground mb-8">
            The Eight Phases
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {moonPhases.map((phase) => (
              <div
                key={phase.name}
                className="flex flex-col items-center gap-2 p-3 rounded-md bg-card border border-border hover:border-gold transition-colors group"
              >
                <span className="text-2xl" role="img" aria-label={phase.name}>
                  {phase.symbol}
                </span>
                <p className="font-sans text-xs font-semibold text-foreground text-center group-hover:text-gold transition-colors tracking-wide">
                  {phase.name}
                </p>
                <p className="font-sans text-xs text-muted-foreground text-center leading-relaxed hidden md:block">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
