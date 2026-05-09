import Link from 'next/link'
import astrologyData from '@/data/astrology-positions.json'

type DailyEntry = {
  date: string
  moon_sign: string
  positions: Record<string, string>
}

type PlanetMeta = {
  key: string
  symbol: string
  label: string
  nature: string
  color: string
  borderColor: string
}

const PLANET_META: PlanetMeta[] = [
  { key: 'Sun',     symbol: '☉', label: 'Sun',     nature: 'Identity & Ego',       color: 'text-amber-400',  borderColor: 'border-amber-400/25' },
  { key: 'Moon',    symbol: '☽', label: 'Moon',    nature: 'Emotion & Instinct',   color: 'text-slate-300',  borderColor: 'border-slate-300/25' },
  { key: 'Mercury', symbol: '☿', label: 'Mercury', nature: 'Mind & Communication', color: 'text-sky-400',    borderColor: 'border-sky-400/25' },
  { key: 'Venus',   symbol: '♀', label: 'Venus',   nature: 'Love & Aesthetics',    color: 'text-rose-400',   borderColor: 'border-rose-400/25' },
  { key: 'Mars',    symbol: '♂', label: 'Mars',    nature: 'Drive & Ambition',     color: 'text-red-500',    borderColor: 'border-red-500/25' },
  { key: 'Jupiter', symbol: '♃', label: 'Jupiter', nature: 'Growth & Fortune',     color: 'text-orange-400', borderColor: 'border-orange-400/25' },
  { key: 'Saturn',  symbol: '♄', label: 'Saturn',  nature: 'Structure & Karma',    color: 'text-yellow-600', borderColor: 'border-yellow-600/25' },
  { key: 'Uranus',  symbol: '♅', label: 'Uranus',  nature: 'Change & Innovation',  color: 'text-cyan-400',   borderColor: 'border-cyan-400/25' },
  { key: 'Neptune', symbol: '♆', label: 'Neptune', nature: 'Dreams & Illusion',    color: 'text-violet-400', borderColor: 'border-violet-400/25' },
  { key: 'Pluto',   symbol: '♇', label: 'Pluto',   nature: 'Power & Rebirth',      color: 'text-fuchsia-500',borderColor: 'border-fuchsia-500/25' },
]

const SIGN_GLYPHS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

const SIGN_ELEMENTS: Record<string, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
}

const ELEMENT_COLOR: Record<string, string> = {
  Fire: 'text-orange-400',
  Earth: 'text-green-500',
  Air: 'text-sky-400',
  Water: 'text-blue-400',
}

function getTodayEntry(): DailyEntry | null {
  const today = new Date().toISOString().slice(0, 10)
  const entries = astrologyData as DailyEntry[]
  return entries.find((e) => e.date === today) ?? entries[0] ?? null
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function PlanetaryPositionsSection() {
  const entry = getTodayEntry()

  if (!entry) return null

  const { date, positions } = entry

  // Find any retrograde planets (none in dataset but reserve space for UI)
  const retrograde: string[] = []

  return (
    <section className="py-24 px-4 bg-background" id="sky-today">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-sans text-xs tracking-[0.45em] uppercase text-primary mb-3">
              Live Sky
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Planets Today
            </h2>
            <p className="font-sans text-sm text-muted-foreground mt-3 leading-relaxed">
              Where every planet stands in the sky right now — drawn from the 2026–2028 ephemeris.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
            <p className="font-serif text-lg text-foreground">{formatDate(date)}</p>
            <Link
              href="/astrology/sky-today"
              className="font-sans text-xs tracking-widest uppercase text-primary hover:underline underline-offset-4"
            >
              Full sky view &rarr;
            </Link>
          </div>
        </div>

        {/* Planet grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-12">
          {PLANET_META.map(({ key, symbol, label, nature, color, borderColor }) => {
            const sign = positions[key]
            const glyph = sign ? SIGN_GLYPHS[sign] : '?'
            const element = sign ? SIGN_ELEMENTS[sign] : ''
            const elemColor = element ? ELEMENT_COLOR[element] : 'text-muted-foreground'
            const isRetrograde = retrograde.includes(key)

            return (
              <div
                key={key}
                className={`group flex flex-col gap-3 p-4 rounded-lg bg-card border ${borderColor} hover:border-primary/50 transition-colors duration-200`}
              >
                {/* Planet symbol + retrograde */}
                <div className="flex items-start justify-between">
                  <span className={`font-serif text-2xl leading-none ${color}`} aria-hidden="true">
                    {symbol}
                  </span>
                  {isRetrograde && (
                    <span className="font-sans text-[9px] tracking-widest uppercase text-destructive border border-destructive/30 rounded px-1">
                      Rx
                    </span>
                  )}
                </div>

                {/* Planet name + nature */}
                <div>
                  <p className={`font-sans text-xs font-semibold tracking-wider uppercase ${color}`}>
                    {label}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground mt-0.5 leading-snug">
                    {nature}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60" />

                {/* Sign */}
                {sign ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {sign}
                      </p>
                      <p className={`font-sans text-[10px] tracking-wider uppercase ${elemColor}`}>
                        {element}
                      </p>
                    </div>
                    <span className={`font-serif text-xl ${elemColor} opacity-70`} aria-hidden="true">
                      {glyph}
                    </span>
                  </div>
                ) : (
                  <p className="font-sans text-xs text-muted-foreground">—</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Element tally bar */}
        <ElementTally positions={positions} />

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            href="/astrology/birth-chart"
            className="font-sans text-sm tracking-widest uppercase px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 rounded-sm"
          >
            Cast My Birth Chart
          </Link>
          <Link
            href="/astrology/sky-today"
            className="font-sans text-sm tracking-widest uppercase px-8 py-3 bg-card border border-border text-foreground hover:border-primary transition-colors duration-200 rounded-sm"
          >
            Full Sky Map
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Element tally ────────────────────────────────────────────────────────────

function ElementTally({ positions }: { positions: Record<string, string> }) {
  const counts: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  for (const sign of Object.values(positions)) {
    const el = SIGN_ELEMENTS[sign]
    if (el) counts[el]++
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  const bars: { label: string; color: string; bg: string }[] = [
    { label: 'Fire',  color: 'text-orange-400', bg: 'bg-orange-400' },
    { label: 'Earth', color: 'text-green-500',  bg: 'bg-green-500'  },
    { label: 'Air',   color: 'text-sky-400',    bg: 'bg-sky-400'    },
    { label: 'Water', color: 'text-blue-400',   bg: 'bg-blue-400'   },
  ]

  return (
    <div className="rounded-lg bg-card border border-border/60 p-6">
      <p className="font-sans text-xs tracking-[0.4em] uppercase text-muted-foreground mb-5">
        Elemental Balance — Sky Today
      </p>
      <div className="flex flex-col gap-3">
        {bars.map(({ label, color, bg }) => {
          const pct = total ? Math.round((counts[label] / total) * 100) : 0
          return (
            <div key={label} className="flex items-center gap-4">
              <span className={`font-sans text-xs w-10 shrink-0 ${color} font-semibold tracking-wider`}>
                {label}
              </span>
              <div className="flex-1 h-1.5 bg-border/60 rounded-full overflow-hidden">
                <div
                  className={`h-full ${bg} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-sans text-xs text-muted-foreground w-8 text-right shrink-0">
                {counts[label]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
