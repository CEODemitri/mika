import { NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

const author = {
  _type: 'author',
  _id: 'author-mika',
  name: 'Mika Editorial',
  bio: 'Voices from the cosmic archive — astrologers, mythologists, and lunar observers.',
}

const posts = [
  {
    _type: 'post',
    _id: 'post-mercury-retrograde',
    title: 'Surviving Mercury Retrograde: A Practical Guide',
    slug: { _type: 'slug', current: 'mercury-retrograde-guide' },
    category: 'Astrology',
    excerpt:
      "Mercury retrograde doesn't have to mean chaos. Here's how to use the slowdown to your advantage and emerge clearer than ever.",
    readTime: '5 min read',
    publishedAt: '2026-05-01T00:00:00Z',
    author: { _type: 'reference', _ref: 'author-mika' },
    body: [
      {
        _type: 'block',
        _key: 'mr-block1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'mr-span1',
            marks: [],
            text: 'Three to four times a year, Mercury stations retrograde — appearing to move backwards from our vantage point on Earth. Communication misfires, contracts stall, and technology flickers. But rather than surrender to the chaos, we can learn to work with the current.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'mr-block2',
        style: 'h2',
        markDefs: [],
        children: [{ _type: 'span', _key: 'mr-span2', marks: [], text: 'The Art of the Slow Down' }],
      },
      {
        _type: 'block',
        _key: 'mr-block3',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'mr-span3',
            marks: [],
            text: 'Mercury governs the mind, speech, and movement. When it retrogrades, these domains ask for revision rather than initiation. Back up your files, re-read contracts before signing, and treat conversations as drafts. The "re-" words are your friends: reflect, review, revisit, restore.',
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    _id: 'post-new-moon-ritual',
    title: 'New Moon Ritual for Setting Powerful Intentions',
    slug: { _type: 'slug', current: 'new-moon-ritual' },
    category: 'Moon',
    excerpt:
      'The new moon is a monthly reset — a moment of darkness that holds infinite potential. Learn how to harness it with a simple, meaningful practice.',
    readTime: '7 min read',
    publishedAt: '2026-04-22T00:00:00Z',
    author: { _type: 'reference', _ref: 'author-mika' },
    body: [
      {
        _type: 'block',
        _key: 'nm-block1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'nm-span1',
            marks: [],
            text: 'In the ancient sky, the new moon was invisible — a secret between the earth and the heavens. This dark phase is the seed point of the lunar cycle, and it carries a quiet, potent energy ideal for planting intentions.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'nm-block2',
        style: 'h2',
        markDefs: [],
        children: [{ _type: 'span', _key: 'nm-span2', marks: [], text: 'Preparing Your Space' }],
      },
      {
        _type: 'block',
        _key: 'nm-block3',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'nm-span3',
            marks: [],
            text: "Choose a quiet corner, light a single candle, and prepare a journal. The ritual is less about elaborate ceremony and more about sincere presence. Write three intentions — not wishes, but commitments to action — that align with the new moon's sign.",
          },
        ],
      },
    ],
  },
  {
    _type: 'post',
    _id: 'post-pluto-aquarius',
    title: 'Pluto in Aquarius: The Great Collective Reset',
    slug: { _type: 'slug', current: 'pluto-aquarius' },
    category: 'Transits',
    excerpt:
      'For the first time in 225 years, Pluto enters Aquarius — a generational shift in power structures, technology, and what it means to belong.',
    readTime: '9 min read',
    publishedAt: '2026-04-10T00:00:00Z',
    author: { _type: 'reference', _ref: 'author-mika' },
    body: [
      {
        _type: 'block',
        _key: 'pa-block1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'pa-span1',
            marks: [],
            text: 'Pluto moves slowly — barely one degree per year — and its ingress into a new sign signals a civilisational inflection point. Aquarius rules networks, technology, collective consciousness, and the future. When the planet of death and rebirth enters this electric air sign, the social contract itself is renegotiated.',
          },
        ],
      },
      {
        _type: 'block',
        _key: 'pa-block2',
        style: 'h2',
        markDefs: [],
        children: [{ _type: 'span', _key: 'pa-span2', marks: [], text: 'Historical Echoes' }],
      },
      {
        _type: 'block',
        _key: 'pa-block3',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'pa-span3',
            marks: [],
            text: 'The last time Pluto transited Aquarius was between 1778 and 1798 — a period that encompassed the American and French Revolutions, the birth of the Enlightenment press, and the dawn of industrialisation. The theme was always the same: power to the people, dismantled and redistributed.',
          },
        ],
      },
    ],
  },
]

export async function POST() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const token = process.env.SANITY_API_READ_TOKEN

    if (!projectId) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_SANITY_PROJECT_ID is not set.' },
        { status: 500 }
      )
    }
    if (!token) {
      return NextResponse.json(
        { error: 'SANITY_API_READ_TOKEN is not set. A write-capable token is required to seed content.' },
        { status: 500 }
      )
    }

    // Seed author
    await writeClient.createOrReplace(author)

    // Seed posts
    for (const post of posts) {
      await writeClient.createOrReplace(post)
    }

    return NextResponse.json({ success: true, seeded: posts.length + 1 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
