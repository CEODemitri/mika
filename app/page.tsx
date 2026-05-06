import { Navbar } from '@/components/navbar'
import HeroSection from '@/components/HeroSection'
import MoonSection from '@/components/MoonSection'
import AstrologySection from '@/components/AstrologySection'
import MythologySection from '@/components/MythologySection'
import BlogSection from '@/components/BlogSection'
import NewsletterSection from '@/components/NewsletterSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MoonSection />
        <AstrologySection />
        <MythologySection />
        <BlogSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
