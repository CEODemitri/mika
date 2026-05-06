import Link from 'next/link'

const zodiacSigns = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 – May 20', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 – Jun 20', element: 'Air' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 – Jul 22', element: 'Water' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 – Oct 22', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 – Nov 21', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 – Feb 18', element: 'Air' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 – Mar 20', element: 'Water' },
]

const elementColors: Record<string, string> = {
  Fire: 'text-orange-400 border-orange-400/30',
  Earth: 'text-green-500 border-green-500/30',
  Air: 'text-sky-400 border-sky-400/30',
  Water: 'text-blue-400 border-blue-400/30',
}

const features = [
  {
    title: 'Birth Chart',
    desc: 'Understand the planetary positions at the moment of your birth and what they reveal about your personality, life path, and purpose.',
    href: '/astrology/birth-chart',
    icon: '☽',
  },
  {
    title: 'Planets & Houses',
    desc: 'Each of the twelve houses governs a different area of life. Learn how planetary placements shape your world.',
    href: '/astrology/planets',
    icon: '♄',
  },
  {
    title: 'Transits & Cycles',
    desc: 'Planetary transits mark the rhythms of growth and challenge. Track ongoing transits and their influence in your chart.',
    href: '/astrology/transits',
    icon: '⟳',
  },
]

export default function AstrologySection() {
  return (
    <section className="py-24 px-4 bg-card" id="astrology">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans font-medium mb-3">
            The Celestial Art
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
            Astrology
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed max-w-lg mx-auto font-sans">
            A 4,000-year-old language written in the sky. Decode your chart, explore the zodiac, and follow the movements of the planets.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group flex flex-col gap-4 p-6 bg-background border border-border rounded-lg hover:border-gold transition-colors duration-200"
            >
              <span className="text-3xl text-gold font-serif" aria-hidden="true">
                {f.icon}
              </span>
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                {f.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
              <span className="text-gold text-sm font-sans mt-auto">
                Explore &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Zodiac grid */}
        <div>
          <h3 className="font-serif text-2xl text-center text-foreground mb-8">
            The Twelve Signs
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {zodiacSigns.map((sign) => (
              <Link
                key={sign.name}
                href={`/astrology/zodiac-signs/${sign.name.toLowerCase()}`}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-md bg-background border hover:border-gold transition-colors group ${elementColors[sign.element]}`}
              >
                <span className="text-2xl font-serif" aria-hidden="true">
                  {sign.symbol}
                </span>
                <p className="text-xs font-semibold text-foreground text-center group-hover:text-gold transition-colors font-sans">
                  {sign.name}
                </p>
                <p className="text-xs text-muted-foreground text-center font-sans hidden sm:block">
                  {sign.dates}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
