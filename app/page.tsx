import { Navbar } from '@/components/navbar'
import HeroSection from '@/components/HeroSection'
import MoonSection from '@/components/MoonSection'
import AstrologySection from '@/components/AstrologySection'
import PlanetaryPositionsSection from '@/components/PlanetaryPositionsSection'
import MythologySection from '@/components/MythologySection'
import BlogSection from '@/components/BlogSection'
import NewsletterSection from '@/components/NewsletterSection'
import Footer from '@/components/Footer'
import { client, blogListQuery } from '@/lib/sanity'
import type { Post } from '@/app/blog/page'

export const revalidate = 60

const FALLBACK_POSTS: Post[] = [
  {
    _id: 'f1',
    title: 'Surviving Mercury Retrograde: A Practical Guide',
    slug: { current: 'mercury-retrograde-guide' },
    category: 'Astrology',
    excerpt: "Mercury retrograde doesn't have to mean chaos. Here's how to use the slowdown to your advantage.",
    publishedAt: '2026-05-01T00:00:00Z',
    readTime: '5 min read',
    author: 'Mika Editorial',
  },
  {
    _id: 'f2',
    title: 'New Moon Ritual for Setting Powerful Intentions',
    slug: { current: 'new-moon-ritual' },
    category: 'Moon',
    excerpt: 'The new moon is a monthly reset — a moment of darkness that holds infinite potential.',
    publishedAt: '2026-04-22T00:00:00Z',
    readTime: '7 min read',
    author: 'Mika Editorial',
  },
  {
    _id: 'f3',
    title: 'Pluto in Aquarius: The Great Collective Reset',
    slug: { current: 'pluto-aquarius' },
    category: 'Transits',
    excerpt: 'For the first time in 225 years, Pluto enters Aquarius — a generational shift.',
    publishedAt: '2026-04-10T00:00:00Z',
    readTime: '9 min read',
    author: 'Mika Editorial',
  },
]

export default async function Home() {
  let posts: Post[] = []
  try {
    posts = await client.fetch(blogListQuery)
  } catch {
    posts = FALLBACK_POSTS
  }
  if (!posts?.length) posts = FALLBACK_POSTS

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MoonSection />
        <AstrologySection />
        <PlanetaryPositionsSection />
        <MythologySection />
        <BlogSection posts={posts.slice(0, 3)} />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
