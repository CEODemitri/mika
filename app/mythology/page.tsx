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
      <main className="min-h-screen bg-background pt-16 overflow-hidden">

        {/* Hero */}
        <section className="relative border-b border-border/50 overflow-hidden">
          <div className="parchment-texture absolute inset-0 pointer-events-none z-0" />

          {/* Floating background glyphs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
            {['神','天','龍','月','星','霊','運','命','光','影','火','水'].map((kanji, i) => (
              <span
                key={i}
                className="absolute font-serif font-black text-foreground/[0.03]"
                style={{
                  fontSize: `${80 + (i % 4) * 40}px`,
                  top: `${5 + ((i * 41) % 85)}%`,
                  left: `${(i * 8.5) % 94}%`,
                  transform: `rotate(${(i * 13) % 40 - 20}deg)`,
                }}
              >
                {kanji}
              </span>
            ))}
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-primary/40" />
              <span className="font-sans text-[10px] tracking-[0.6em] uppercase text-primary">
                The Divine Archive
              </span>
              <div className="h-px w-16 bg-primary/40" />
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance mb-5">
              Pantheons of the
              <br />
              <span className="text-primary italic">Ancient World</span>
            </h1>
            <p className="font-sans text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
              Select a pantheon below to journey through its gods, titans, and legendary figures — each a living myth written in the stars.
            </p>
          </div>
        </section>

        {/* Carousel section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <MythologyCarousel />
        </section>

      </main>
      <Footer />
    </>
  )
}
