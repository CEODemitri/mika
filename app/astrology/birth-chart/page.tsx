import { Navbar } from '@/components/navbar'
import Footer from '@/components/Footer'
import BirthChartCalculator from '@/components/BirthChartCalculator'
import BirthChartWheel from '@/components/BirthChartWheel'

export const metadata = {
  title: 'Birth Chart — Mika',
  description: 'Cast your natal chart. Discover the cosmic blueprint written in the stars at the moment of your birth.',
}

export default function BirthChartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16 overflow-hidden">

        {/* ── Scroll of the Heavens — Hero ──────────────────────────── */}
        <section className="relative border-b border-border/60 overflow-hidden">
          {/* Parchment texture layer */}
          <div className="parchment-texture absolute inset-0 pointer-events-none z-0" />

          {/* Floating rune letters */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
            {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((g, i) => (
              <span
                key={i}
                className="absolute font-serif font-bold opacity-[0.06] text-primary"
                style={{
                  fontSize: `${60 + (i % 3) * 30}px`,
                  top: `${10 + ((i * 37) % 80)}%`,
                  left: `${(i * 8.3) % 95}%`,
                  transform: `rotate(${(i * 17) % 60 - 30}deg)`,
                }}
              >
                {g}
              </span>
            ))}
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            {/* Ornamental top line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-primary/40" />
              <span className="font-sans text-[10px] tracking-[0.6em] uppercase text-primary">
                Natal Codex / Astrology
              </span>
              <div className="h-px w-20 bg-primary/40" />
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance mb-4">
              The Book of Your
              <br />
              <span className="text-primary italic">Stars</span>
            </h1>
            <p className="font-sans text-muted-foreground text-base max-w-xl mx-auto leading-relaxed mb-8">
              Your birth chart is the cosmic manuscript written the moment you entered the world. Enter your details below — and let the celestial archive reveal what was written for you.
            </p>

            {/* Decorative rune border */}
            <div className="flex items-center justify-center gap-3 text-primary/40 font-sans text-xs tracking-widest">
              <span>✦</span><span>✦</span><span>✦</span>
            </div>
          </div>
        </section>

        {/* ── The Great Hall — Calculator + Wheel ───────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Form — The Sorting Quill */}
            <div className="spellbook-panel relative rounded-sm overflow-hidden">
              <div className="spellbook-header px-8 py-5 border-b border-primary/20">
                <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-primary mb-1">Chapter I</p>
                <h2 className="font-serif text-2xl font-bold text-foreground">The Sorting Quill</h2>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  Inscribe your birth details. The stars demand precision.
                </p>
              </div>
              <div className="p-8">
                <BirthChartCalculator />
              </div>
            </div>

            {/* Right: Wheel — The Celestial Orb */}
            <div className="flex flex-col gap-6">
              <div className="spellbook-panel rounded-sm overflow-hidden">
                <div className="spellbook-header px-8 py-5 border-b border-primary/20">
                  <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-primary mb-1">Chapter II</p>
                  <h2 className="font-serif text-2xl font-bold text-foreground">The Celestial Orb</h2>
                  <p className="font-sans text-xs text-muted-foreground mt-1">
                    Your natal wheel — cast and illuminated.
                  </p>
                </div>
                <div className="p-8 flex items-center justify-center">
                  <BirthChartWheel />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Great Library — Planet & House Meanings ───────────── */}
        <section className="border-t border-border/60 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-16 bg-primary/30" />
                <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-primary">
                  Chapter III
                </span>
                <div className="h-px w-16 bg-primary/30" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
                The Great Library
              </h2>
              <p className="mt-4 font-sans text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                Every planet, every house — a chapter in your living manuscript. Study the glyphs below to decode your chart.
              </p>
            </div>

            {/* Planets grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PLANETS.map((p) => (
                <div key={p.name} className="spellbook-card p-5 rounded-sm group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl text-primary" role="img" aria-label={p.name}>{p.symbol}</span>
                    <div>
                      <p className="font-serif text-base font-semibold text-foreground">{p.name}</p>
                      <p className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground">{p.domain}</p>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>

            {/* Houses */}
            <div className="mt-14">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-8 text-center">The Twelve Houses</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {HOUSES.map((h) => (
                  <div key={h.number} className="spellbook-card p-4 rounded-sm text-center">
                    <span className="font-serif text-2xl font-bold text-primary/60">{h.number}</span>
                    <p className="font-serif text-sm font-semibold text-foreground mt-1">{h.title}</p>
                    <p className="font-sans text-[11px] text-muted-foreground mt-1 leading-snug">{h.keywords}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

// ── Static data ───────────────────────────────────────────────────────────────

const PLANETS = [
  { name: 'Sun', symbol: '☉', domain: 'Identity', description: 'Your core self, ego, and the conscious will to shine and create.' },
  { name: 'Moon', symbol: '☽', domain: 'Emotion', description: 'Your emotional nature, instincts, memories, and inner world.' },
  { name: 'Mercury', symbol: '☿', domain: 'Mind', description: 'Thought, communication, learning, and the way you process information.' },
  { name: 'Venus', symbol: '♀', domain: 'Love', description: 'Attraction, beauty, relationships, and what you value most.' },
  { name: 'Mars', symbol: '♂', domain: 'Drive', description: 'Action, desire, courage, and the engine of your ambition.' },
  { name: 'Jupiter', symbol: '♃', domain: 'Expansion', description: 'Growth, philosophy, luck, and where life hands you abundance.' },
  { name: 'Saturn', symbol: '♄', domain: 'Structure', description: 'Discipline, karma, limitations, and the lessons that shape you.' },
  { name: 'Uranus', symbol: '♅', domain: 'Awakening', description: 'Revolution, originality, sudden change, and collective awakening.' },
  { name: 'Neptune', symbol: '♆', domain: 'Dreams', description: 'Imagination, spirituality, illusion, and transcendent longing.' },
  { name: 'Pluto', symbol: '♇', domain: 'Transformation', description: 'Death and rebirth, power, and the deep forces of metamorphosis.' },
  { name: 'Chiron', symbol: '⚷', domain: 'Wounds', description: 'Your deepest wound — and the healing gift you offer the world.' },
  { name: 'Ascendant', symbol: 'AC', domain: 'Persona', description: 'Your rising sign — the mask you wear, first impressions you make.' },
]

const HOUSES = [
  { number: 'I', title: 'Self', keywords: 'Identity, appearance, beginnings' },
  { number: 'II', title: 'Value', keywords: 'Resources, money, possessions' },
  { number: 'III', title: 'Mind', keywords: 'Communication, siblings, local' },
  { number: 'IV', title: 'Home', keywords: 'Roots, family, private life' },
  { number: 'V', title: 'Joy', keywords: 'Creativity, love, pleasure' },
  { number: 'VI', title: 'Service', keywords: 'Health, work, daily routines' },
  { number: 'VII', title: 'Union', keywords: 'Partnerships, contracts, others' },
  { number: 'VIII', title: 'Depth', keywords: 'Transformation, shared resources' },
  { number: 'IX', title: 'Quest', keywords: 'Philosophy, travel, higher mind' },
  { number: 'X', title: 'Legacy', keywords: 'Career, status, public image' },
  { number: 'XI', title: 'Tribe', keywords: 'Community, hopes, friendships' },
  { number: 'XII', title: 'Unseen', keywords: 'Hidden realms, solitude, karma' },
]
