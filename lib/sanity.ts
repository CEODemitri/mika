import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ── Queries ──────────────────────────────────────────────────────────────────

export const blogListQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  category,
  excerpt,
  publishedAt,
  readTime,
  coverImage,
  "author": author->name
}`

export const blogPostQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  category,
  excerpt,
  publishedAt,
  readTime,
  coverImage,
  body,
  "author": author->name
}`

export const birthChartContentQuery = `*[_type == "birthChartContent"][0] {
  heading,
  subheading,
  introText,
  houseDescriptions,
  planetDescriptions,
  aspectDescriptions
}`
