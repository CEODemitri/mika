/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sanity packages ship ESM-only; Next.js must transpile them for the
  // production build to avoid "SyntaxError: Cannot use import statement"
  // client-side exceptions on the live site.
  transpilePackages: ['sanity', 'next-sanity', '@sanity/ui', '@sanity/icons'],
};

export default nextConfig;
