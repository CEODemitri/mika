import Link from 'next/link'

const posts = [
  {
    slug: 'mercury-retrograde-guide',
    category: 'Astrology',
    title: 'Surviving Mercury Retrograde: A Practical Guide',
    excerpt:
      'Mercury retrograde doesn\'t have to mean chaos. Here\'s how to use the slowdown to your advantage and emerge clearer than ever.',
    date: 'May 1, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'new-moon-ritual',
    category: 'Moon',
    title: 'New Moon Ritual for Setting Powerful Intentions',
    excerpt:
      'The new moon is a monthly reset — a moment of darkness that holds infinite potential. Learn how to harness it with a simple, meaningful practice.',
    date: 'Apr 22, 2026',
    readTime: '7 min read',
  },
  {
    slug: 'pluto-aquarius',
    category: 'Transits',
    title: 'Pluto in Aquarius: The Great Collective Reset',
    excerpt:
      'For the first time in 225 years, Pluto enters Aquarius — a generational shift in power structures, technology, and what it means to belong.',
    date: 'Apr 10, 2026',
    readTime: '9 min read',
  },
]

export default function BlogSection() {
  return (
    <section className="py-24 px-4 bg-card" id="blog">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans font-medium mb-3">
              From the Archive
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Latest from the Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-gold hover:text-primary text-sm font-sans tracking-wide underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            View All Posts &rarr;
          </Link>
        </div>

        {/* Post list */}
        <div className="flex flex-col divide-y divide-border">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group grid md:grid-cols-[1fr_2fr_auto] gap-4 items-start py-8 hover:opacity-80 transition-opacity"
            >
              {/* Index + category */}
              <div className="flex md:flex-col gap-3 md:gap-1">
                <span className="text-muted-foreground font-sans text-xs tabular-nums">
                  0{i + 1}
                </span>
                <span className="text-gold font-sans text-xs tracking-widest uppercase">
                  {post.category}
                </span>
              </div>
              {/* Title + excerpt */}
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-gold transition-colors text-balance">
                  {post.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              {/* Meta */}
              <div className="flex md:flex-col items-end gap-2 md:gap-1 text-right whitespace-nowrap">
                <span className="font-sans text-xs text-muted-foreground">{post.date}</span>
                <span className="font-sans text-xs text-muted-foreground">{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
