'use client'

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
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function BlogGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
      {posts.map((post, i) => (
        <BlogCard key={post._id} post={post} index={i} />
      ))}
    </div>
  )
}

function BlogCard({ post, index }: { post: Post; index: number }) {
  const symbol = CATEGORY_SYMBOLS[post.category] ?? '✦'

  return (
    <Link
      href={`/blog/${post.slug?.current ?? post.slug}`}
      className="blog-card group relative bg-card overflow-hidden block"
      style={{ minHeight: '340px' }}
    >
      {/* Base layer — visible by default */}
      <div className="relative z-10 flex flex-col justify-between h-full p-7 transition-opacity duration-500 group-hover:opacity-0">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary border border-primary/30 px-2 py-1">
            {post.category}
          </span>
          <span className="font-serif text-5xl font-bold text-foreground/10 leading-none tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Large symbol */}
        <div className="flex-1 flex items-center justify-center">
          <span className="text-7xl text-foreground/20 select-none">{symbol}</span>
        </div>

        {/* Bottom: title */}
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground leading-snug text-balance">
            {post.title}
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <span className="font-sans text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="font-sans text-xs text-muted-foreground">{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Eclipse overlay — appears on hover */}
      <div className="eclipse-overlay absolute inset-0 z-20 flex flex-col justify-between p-7 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {/* Eclipse radial vignette */}
        <div className="eclipse-radial absolute inset-0 pointer-events-none" />

        {/* Content on top of eclipse */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-serif text-xl text-primary">{symbol}</span>
            <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary/80">
              {post.category}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white leading-snug text-balance">
            {post.title}
          </h2>
        </div>

        <div className="relative z-10">
          <p className="font-sans text-sm text-white/80 leading-relaxed mb-6 line-clamp-4">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              {post.author && (
                <span className="font-sans text-xs text-white/50">{post.author}</span>
              )}
              <span className="font-sans text-xs text-white/50">{formatDate(post.publishedAt)} · {post.readTime}</span>
            </div>
            <span className="font-sans text-xs text-primary border border-primary/50 px-3 py-1.5 tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors">
              READ &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
