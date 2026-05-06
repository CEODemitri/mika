import Link from 'next/link'

const mythCards = [
  {
    title: 'Selene & the Moon',
    category: 'Greek Mythology',
    excerpt:
      'Selene, the goddess of the moon, drove her silver chariot across the night sky, casting her gentle light upon the sleeping world below.',
    href: '/mythology/greek',
  },
  {
    title: 'Helios, the Sun God',
    category: 'Greek Mythology',
    excerpt:
      'Each dawn, Helios harnessed his fire-breathing horses to his golden chariot and rode across the vault of heaven, bringing light to gods and mortals alike.',
    href: '/mythology/greek',
  },
  {
    title: 'Saturn & the Golden Age',
    category: 'Roman Mythology',
    excerpt:
      'Saturn presided over a mythical golden age of peace and prosperity before the reign of Jupiter, his rule remembered in the festival of Saturnalia.',
    href: '/mythology/roman',
  },
  {
    title: 'Orion the Hunter',
    category: 'Celestial Lore',
    excerpt:
      'Placed among the stars as a memorial of his great deeds, Orion strides eternally across the winter sky, belt glittering with three bright stars.',
    href: '/mythology/celestial-lore',
  },
]

export default function MythologySection() {
  return (
    <section className="py-24 px-4 bg-background" id="mythology">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans font-medium mb-3">
              Ancient Sky Stories
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Mythology
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-sans">
            The ancients wrote their understanding of the cosmos in myth. Every constellation carries a story.
          </p>
        </div>

        {/* Myth cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {mythCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col gap-3 p-6 bg-card border border-border rounded-lg hover:border-gold transition-colors duration-200"
            >
              <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans font-medium">
                {card.category}
              </p>
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-gold transition-colors text-balance">
                {card.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed flex-1">
                {card.excerpt}
              </p>
              <span className="text-gold text-sm font-sans mt-2 self-start">
                Read More &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Browse all link */}
        <div className="text-center">
          <Link
            href="/mythology"
            className="inline-block border border-gold text-gold hover:bg-gold/10 px-8 py-2.5 text-sm font-sans tracking-wide uppercase rounded transition-colors"
          >
            Browse All Myths
          </Link>
        </div>
      </div>
    </section>
  )
}
