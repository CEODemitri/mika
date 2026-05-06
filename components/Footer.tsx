import Link from 'next/link'

const footerLinks = [
  {
    heading: 'Astrology',
    links: [
      { label: 'Birth Chart', href: '/astrology/birth-chart' },
      { label: 'Zodiac Signs', href: '/astrology/zodiac-signs' },
      { label: 'Planets & Houses', href: '/astrology/planets' },
      { label: 'Transits', href: '/astrology/transits' },
    ],
  },
  {
    heading: 'Moon',
    links: [
      { label: 'Moon Phases', href: '/moon/phases' },
      { label: 'Lunar Calendar', href: '/moon/calendar' },
      { label: 'Lunar Rituals', href: '/moon/rituals' },
    ],
  },
  {
    heading: 'Mythology',
    links: [
      { label: 'Greek Myths', href: '/mythology/greek' },
      { label: 'Roman Myths', href: '/mythology/roman' },
      { label: 'Celestial Lore', href: '/mythology/celestial-lore' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-deep-navy border-t border-white/10 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-gold">
              MIKA
            </Link>
            <p className="font-sans text-xs text-star-silver leading-relaxed">
              For Kosmonauts. Navigating the celestial sphere one orbit at a time.
            </p>
          </div>

          {/* Nav columns */}
          {footerLinks.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h4 className="font-sans text-xs text-gold tracking-[0.3em] uppercase font-semibold">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-star-silver hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-star-silver/60 tracking-wide">
            &copy; {new Date().getFullYear()} Mika: For Kosmonauts. All rights we were born with.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="font-sans text-xs text-star-silver/60 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
