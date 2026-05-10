import { Navbar } from '@/components/navbar'
import Footer from '@/components/Footer'
import MythologyCarousel from '@/components/MythologyCarousel'

export const metadata = {
  title: 'Mythology — Mika',
  description: 'Explore the gods, titans, and legendary figures of world mythology. Choose a pantheon and journey through the divine.',
}

export default function MythologyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background overflow-hidden">

        {/* Page header */}
        <section className="relative pt-28 pb-10 px-4 sm:px-6 lg:px-8 border-b border-border/40 overflow-hidden">
          {/* Background glyphs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
            {['神','天','龍','月','星','霊','運','命','光','影'].map((kanji, i) => (
              <span
                key={i}
                className="absolute font-serif font-black text-foreground/[0.025]"
                style={{
                  fontSize: `${90 + (i % 3) * 50}px`,
                  top: `${(i * 37) % 90}%`,
                  left: `${(i * 11) % 95}%`,
                  transform: `rotate(${(i * 15) % 30 - 15}deg)`,
                }}
              >
                {kanji}
              </span>
            ))}
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary/40" />
              <span className="font-sans text-[10px] tracking-[0.6em] uppercase text-primary">
                The Divine Archive
              </span>
              <div className="h-px w-12 bg-primary/40" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              Pantheons of the{' '}
              <span className="text-primary italic">Ancient World</span>
            </h1>
            <p className="font-sans text-muted-foreground text-sm max-w-md mx-auto mt-4 leading-relaxed">
              Choose a pantheon below to journey through its gods and legendary figures — each a living myth written in the stars.
            </p>
          </div>
        </section>

        {/* Carousel — full width, 60-75% card area */}
        <section className="py-14 px-4 sm:px-6 lg:px-8">
          <MythologyCarousel />
        </section>

      </main>
      <Footer />
    </>
  )
}
