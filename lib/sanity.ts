import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_READ_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  // Use token when available so we can read drafts and private datasets.
  // Disable CDN when using a token so requests bypass the edge cache.
  token: token ?? undefined,
  useCdn: !token,
})

// Write client — used only in server-side seed/mutation routes.
// Requires a Sanity token with Editor or Write permissions.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
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
