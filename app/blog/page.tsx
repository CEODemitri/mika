import { client, blogListQuery } from '@/lib/sanity'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/Footer'
import BlogGrid from '@/components/BlogGrid'

export const revalidate = 60

export default async function BlogPage() {
  let posts: Post[] = []
  try {
    posts = await client.fetch(blogListQuery)
  } catch {
    posts = fallbackPosts
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        {/* Page header */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Decorative vertical kanji-style lines */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            {['星', '月', '空', '光', '夢', '宙'].map((char, i) => (
              <span
                key={i}
                className="absolute font-serif text-[120px] font-bold opacity-[0.03] text-foreground leading-none"
                style={{ top: '50%', left: `${8 + i * 15}%`, transform: 'translateY(-50%)' }}
              >
                {char}
              </span>
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="font-sans text-xs tracking-[0.5em] uppercase text-primary mb-4">
                  天 Archive / Stellar Writings
                </p>
                <h1 className="font-serif text-6xl md:text-8xl font-bold text-foreground text-balance leading-none">
                  Blog
                </h1>
                <p className="mt-4 font-sans text-muted-foreground text-sm max-w-md leading-relaxed">
                  Dispatches from the celestial. Astrology, mythology, and the rhythms of the cosmos — explored with depth and wonder.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-sans text-xs text-muted-foreground tracking-widest">
                  {posts.length} ENTRIES
                </span>
                <div className="h-px w-16 bg-primary" />
              </div>
            </div>

            {/* Category filter row */}
            <div className="mt-10 flex flex-wrap gap-2">
              {['All', 'Astrology', 'Moon', 'Mythology', 'Transits', 'Rituals', 'Guides'].map((cat) => (
                <span
                  key={cat}
                  className="font-sans text-xs px-3 py-1.5 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer tracking-wide"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Blog grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <BlogGrid posts={posts.length ? posts : fallbackPosts} />
        </section>
      </main>
      <Footer />
    </>
  )
}

// ── Types ────────────────────────────────────────────────────────────────────
export type Post = {
  _id: string
  title: string
  slug: { current: string }
  category: string
  excerpt: string
  publishedAt: string
  readTime: string
  author?: string
}

// Fallback content shown while Sanity is not yet seeded
const fallbackPosts: Post[] = [
  {
    _id: 'fallback-1',
    title: 'Surviving Mercury Retrograde: A Practical Guide',
    slug: { current: 'mercury-retrograde-guide' },
    category: 'Astrology',
    excerpt:
      "Mercury retrograde doesn't have to mean chaos. Here's how to use the slowdown to your advantage and emerge clearer than ever.",
    publishedAt: '2026-05-01T00:00:00Z',
    readTime: '5 min read',
    author: 'Mika Editorial',
  },
  {
    _id: 'fallback-2',
    title: 'New Moon Ritual for Setting Powerful Intentions',
    slug: { current: 'new-moon-ritual' },
    category: 'Moon',
    excerpt:
      'The new moon is a monthly reset — a moment of darkness that holds infinite potential. Learn how to harness it with a simple, meaningful practice.',
    publishedAt: '2026-04-22T00:00:00Z',
    readTime: '7 min read',
    author: 'Mika Editorial',
  },
  {
    _id: 'fallback-3',
    title: 'Pluto in Aquarius: The Great Collective Reset',
    slug: { current: 'pluto-aquarius' },
    category: 'Transits',
    excerpt:
      'For the first time in 225 years, Pluto enters Aquarius — a generational shift in power structures, technology, and what it means to belong.',
    publishedAt: '2026-04-10T00:00:00Z',
    readTime: '9 min read',
    author: 'Mika Editorial',
  },
]
