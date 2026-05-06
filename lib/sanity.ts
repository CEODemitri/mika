import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
})

// ── Queries ───────────────────────────────────────────────────────────────

export const blogListQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  category,
  excerpt,
  publishedAt,
  readTime,
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
