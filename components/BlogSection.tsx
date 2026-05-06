import Link from 'next/link'
import type { Post } from '@/app/blog/page'

const CATEGORY_SYMBOLS: Record<string, string> = {
  Astrology: '♈',
  Moon: '☽',
  Mythology: '⊕',
  Transits: '♄',
  Rituals: '✦',
  Guides: '◎',
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return iso }
}

export default function BlogSection({ posts }: { posts: Post[] }) {
  return (
    <section className="py-24 px-4 bg-card" id="blog">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="text-primary text-xs tracking-[0.4em] uppercase font-sans font-medium mb-3">
              From the Archive
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Latest from the Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-primary hover:opacity-70 text-sm font-sans tracking-wide underline underline-offset-4 transition-opacity whitespace-nowrap"
          >
            View All Posts &rarr;
          </Link>
        </div>

        {/* App-store style card grid with eclipse hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {posts.map((post, i) => {
            const symbol = CATEGORY_SYMBOLS[post.category] ?? '✦'
            return (
              <Link
                key={post._id}
                href={`/blog/${post.slug?.current ?? post.slug}`}
                className="blog-card group relative bg-card overflow-hidden block"
                style={{ minHeight: '300px' }}
              >
                {/* Default state */}
                <div className="relative z-10 flex flex-col justify-between h-full p-7 transition-opacity duration-500 group-hover:opacity-0">
                  <div className="flex items-start justify-between">
                    <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary border border-primary/30 px-2 py-1">
                      {post.category}
                    </span>
                    <span className="font-serif text-5xl font-bold text-foreground/10 leading-none tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-7xl text-foreground/20 select-none">{symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground leading-snug text-balance">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="font-sans text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="font-sans text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Eclipse overlay */}
                <div className="eclipse-overlay absolute inset-0 z-20 flex flex-col justify-between p-7 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="eclipse-radial absolute inset-0 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-serif text-lg text-primary">{symbol}</span>
                      <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary/80">{post.category}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white leading-snug text-balance">{post.title}</h3>
                  </div>
                  <div className="relative z-10">
                    <p className="font-sans text-sm text-white/80 leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs text-white/50">{formatDate(post.publishedAt)} · {post.readTime}</span>
                      <span className="font-sans text-xs text-primary border border-primary/50 px-3 py-1 tracking-widest">READ &rarr;</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
