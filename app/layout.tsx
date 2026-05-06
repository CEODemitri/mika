import type { Metadata, Viewport } from 'next'
import { Livvic, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const livvic = Livvic({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-livvic',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mika — For Kosmonauts',
  description:
    'Explore astrology, moon phases, mythology, and the eternal language of the stars. Your guide to the celestial sphere.',
  keywords: [
    'astrology',
    'moon phases',
    'zodiac',
    'mythology',
    'birth chart',
    'lunar calendar',
    'cosmic',
    'celestial',
  ],
  openGraph: {
    title: 'Mika — For Kosmonauts',
    description: 'Navigate the cosmos. Astrology, moon phases, and celestial mythology.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050914' },
    { media: '(prefers-color-scheme: light)', color: '#f0f1f7' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${livvic.variable} ${cormorant.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
