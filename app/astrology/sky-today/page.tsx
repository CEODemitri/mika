import { Navbar } from '@/components/navbar'
import Footer from '@/components/Footer'
import astrologyData from '@/data/astrology-positions.json'
import Link from 'next/link'

type DailyEntry = {
  date: string
  moon_sign: string
  positions: Record<string, string>
}

const PLANET_META = [
  { key: 'Sun',     symbol: '☉', label: 'Sun',     nature: 'Identity & Creative Force',       color: 'text-amber-400',   borderColor: 'border-amber-400/30',   description: 'The Sun defines your core self — your vitality, ego, and life purpose. Its sign shows how you shine.' },
  { key: 'Moon',    symbol: '☽', label: 'Moon',    nature: 'Emotion & Subconscious',          color: 'text-slate-300',   borderColor: 'border-slate-300/30',   description: 'The Moon governs your inner emotional world, instincts, and the needs beneath the surface.' },
  { key: 'Mercury', symbol: '☿', label: 'Mercury', nature: 'Mind, Language & Travel',         color: 'text-sky-400',     borderColor: 'border-sky-400/30',     description: 'Mercury rules thought, speech, and the exchange of ideas. It shapes how you think and communicate.' },
  { key: 'Venus',   symbol: '♀', label: 'Venus',   nature: 'Love, Beauty & Value',            color: 'text-rose-400',    borderColor: 'border-rose-400/30',    description: 'Venus draws people and pleasures toward you. It governs romance, aesthetics, and what you find beautiful.' },
  { key: 'Mars',    symbol: '♂', label: 'Mars',    nature: 'Action, Drive & Desire',          color: 'text-red-500',     borderColor: 'border-red-500/30',     description: 'Mars fuels ambition, passion, and the will to act. It shows how you pursue what you want.' },
  { key: 'Jupiter', symbol: '♃', label: 'Jupiter', nature: 'Expansion, Luck & Wisdom',        color: 'text-orange-400',  borderColor: 'border-orange-400/30',  description: 'Jupiter expands whatever it touches — fortune, philosophy, and opportunity follow in its wake.' },
  { key: 'Saturn',  symbol: '♄', label: 'Saturn',  nature: 'Structure, Karma & Discipline',   color: 'text-yellow-600',  borderColor: 'border-yellow-600/30',  description: 'Saturn demands effort, patience, and integrity. Its lessons are hard-won but enduring.' },
  { key: 'Uranus',  symbol: '♅', label: 'Uranus',  nature: 'Revolution, Freedom & Awakening', color: 'text-cyan-400',    borderColor: 'border-cyan-400/30',    description: 'Uranus shatters convention and ushers in the new. Where it sits, expect the unexpected.' },
  { key: 'Neptune', symbol: '♆', label: 'Neptune', nature: 'Dreams, Mysticism & Dissolution', color: 'text-violet-400',  borderColor: 'border-violet-400/30',  description: 'Neptune dissolves boundaries, inspiring spiritual vision — and sometimes confusion.' },
  { key: 'Pluto',   symbol: '♇', label: 'Pluto',   nature: 'Transformation, Death & Rebirth', color: 'text-fuchsia-500', borderColor: 'border-fuchsia-500/30', description: 'Pluto rules the depths — power, shadow, and the total renewal that comes from destruction.' },
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

const SIGN_MODALITIES: Record<string, string> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
}

const SIGN_KEYWORDS: Record<string, string> = {
  Aries: 'Bold, Pioneering, Impulsive',
  Taurus: 'Stable, Sensual, Determined',
  Gemini: 'Curious, Adaptable, Communicative',
  Cancer: 'Nurturing, Intuitive, Protective',
  Leo: 'Radiant, Generous, Dramatic',
  Virgo: 'Analytical, Precise, Devoted',
  Libra: 'Diplomatic, Harmonious, Indecisive',
  Scorpio: 'Intense, Perceptive, Transformative',
  Sagittarius: 'Adventurous, Philosophical, Honest',
  Capricorn: 'Ambitious, Disciplined, Pragmatic',
  Aquarius: 'Visionary, Rebellious, Humanitarian',
  Pisces: 'Empathic, Mystical, Fluid',
}

const ELEMENT_COLOR: Record<string, string> = {
  Fire: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Earth: 'text-green-500 bg-green-500/10 border-green-500/20',
  Air: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  Water: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
}

const MODALITY_COLOR: Record<string, string> = {
  Cardinal: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  Fixed:    'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Mutable:  'text-violet-400 bg-violet-400/10 border-violet-400/20',
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

export const revalidate = 3600

export default function SkyTodayPage() {
  const entry = getTodayEntry()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-16 px-4 border-b border-border/60">
          <div className="max-w-5xl mx-auto">
            <p className="font-sans text-xs tracking-[0.45em] uppercase text-primary mb-4">
              Ephemeris · 2026–2028
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight">
              The Sky<br />Today
            </h1>
            {entry && (
              <p className="font-serif text-xl text-muted-foreground mt-4">
                {formatDate(entry.date)}
              </p>
            )}
            <p className="font-sans text-sm text-muted-foreground mt-3 max-w-lg leading-relaxed">
              Exact planetary sign positions drawn from our 2026–2028 astronomical ephemeris. Updated daily.
            </p>
          </div>

          {/* Decorative large glyph */}
          <span className="absolute right-8 top-20 font-serif text-[160px] text-primary/5 select-none leading-none hidden lg:block" aria-hidden="true">
            ☽
          </span>
        </section>

        {/* ── Planet cards ────────────────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            {entry ? (
              <div className="flex flex-col gap-4">
                {PLANET_META.map(({ key, symbol, label, nature, color, borderColor, description }) => {
                  const sign = entry.positions[key]
                  const element = sign ? SIGN_ELEMENTS[sign] : ''
                  const modality = sign ? SIGN_MODALITIES[sign] : ''
                  const glyph = sign ? SIGN_GLYPHS[sign] : '?'
                  const elemClass = element ? ELEMENT_COLOR[element] : ''
                  const modClass = modality ? MODALITY_COLOR[modality] : ''
                  const keywords = sign ? SIGN_KEYWORDS[sign] : ''

                  return (
                    <div
                      key={key}
                      className={`grid grid-cols-[auto_1fr] md:grid-cols-[80px_1fr_1fr] gap-4 md:gap-8 p-5 md:p-6 rounded-lg bg-card border ${borderColor} hover:border-primary/40 transition-colors duration-200 items-start`}
                    >
                      {/* Planet symbol block */}
                      <div className="flex flex-col items-center gap-1 w-12 md:w-auto">
                        <span className={`font-serif text-4xl md:text-5xl leading-none ${color}`} aria-hidden="true">
                          {symbol}
                        </span>
                        <span className="font-sans text-[9px] tracking-widest uppercase text-muted-foreground">
                          {label}
                        </span>
                      </div>

                      {/* Planet info */}
                      <div className="flex flex-col gap-2">
                        <div>
                          <p className={`font-sans text-[10px] tracking-widest uppercase font-semibold ${color}`}>
                            {nature}
                          </p>
                          <p className="font-sans text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {description}
                          </p>
                        </div>
                        {keywords && (
                          <p className="font-sans text-[10px] text-muted-foreground italic">
                            {keywords}
                          </p>
                        )}
                      </div>

                      {/* Sign block */}
                      <div className="col-span-2 md:col-span-1 flex flex-col items-start md:items-end gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-3xl text-muted-foreground/50" aria-hidden="true">
                            {glyph}
                          </span>
                          <p className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                            {sign ?? '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {element && (
                            <span className={`font-sans text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border ${elemClass}`}>
                              {element}
                            </span>
                          )}
                          {modality && (
                            <span className={`font-sans text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm border ${modClass}`}>
                              {modality}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-muted-foreground">No ephemeris data available for today.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA strip ───────────────────────────────────────────── */}
        <section className="py-16 px-4 border-t border-border/60 bg-card">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-2">Next Step</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                See where the planets fall in your chart
              </h3>
              <p className="font-sans text-sm text-muted-foreground mt-1 leading-relaxed">
                Cast your birth chart and compare today&apos;s sky to your natal positions.
              </p>
            </div>
            <Link
              href="/astrology/birth-chart"
              className="shrink-0 font-sans text-sm tracking-widest uppercase px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 rounded-sm"
            >
              Cast My Chart
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
