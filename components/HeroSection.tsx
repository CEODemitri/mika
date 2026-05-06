import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-deep-navy text-center px-4">
      {/* Star field dots */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[
          { top: '8%', left: '12%', size: 'w-0.5 h-0.5', delay: '0s' },
          { top: '15%', left: '85%', size: 'w-1 h-1', delay: '0.5s' },
          { top: '22%', left: '55%', size: 'w-0.5 h-0.5', delay: '1s' },
          { top: '35%', left: '5%', size: 'w-1 h-1', delay: '1.5s' },
          { top: '40%', left: '92%', size: 'w-0.5 h-0.5', delay: '0.8s' },
          { top: '55%', left: '20%', size: 'w-0.5 h-0.5', delay: '2s' },
          { top: '60%', left: '70%', size: 'w-1 h-1', delay: '0.3s' },
          { top: '72%', left: '38%', size: 'w-0.5 h-0.5', delay: '1.2s' },
          { top: '80%', left: '80%', size: 'w-1 h-1', delay: '0.7s' },
          { top: '90%', left: '10%', size: 'w-0.5 h-0.5', delay: '1.8s' },
          { top: '5%', left: '45%', size: 'w-0.5 h-0.5', delay: '0.4s' },
          { top: '48%', left: '48%', size: 'w-1.5 h-1.5', delay: '0.9s' },
          { top: '28%', left: '75%', size: 'w-0.5 h-0.5', delay: '1.6s' },
          { top: '65%', left: '55%', size: 'w-0.5 h-0.5', delay: '2.2s' },
          { top: '18%', left: '30%', size: 'w-1 h-1', delay: '1.1s' },
        ].map((star, i) => (
          <span
            key={i}
            className={`absolute rounded-full bg-star-silver star-shimmer ${star.size}`}
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}
      </div>

      {/* Crescent moon SVG accent */}
      <div className="absolute top-24 right-16 md:right-32 opacity-20 pointer-events-none" aria-hidden="true">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path
            d="M60 40C60 51.046 51.046 60 40 60C28.954 60 20 51.046 20 40C20 28.954 28.954 20 40 20C35 25 32 32 32 40C32 48 35 55 40 60C34 58 60 52 60 40Z"
            fill="hsl(42, 72%, 58%)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
        <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans font-medium">
          Celestial Wisdom &nbsp;&bull;&nbsp; Cosmic Insight
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-balance text-white leading-tight">
          Navigate the
          <br />
          <span className="text-gold">Cosmos</span>
        </h1>

        <p className="font-sans text-base md:text-lg text-star-silver leading-relaxed max-w-xl text-pretty">
          Explore astrology, mythology, and the eternal language of the stars. Your guide to the celestial sphere — from moon phases to ancient sky lore.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 font-sans tracking-wide uppercase text-sm"
          >
            <Link href="/astrology">Explore Astrology</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10 px-8 py-3 font-sans tracking-wide uppercase text-sm"
          >
            <Link href="/moon">Moon Phases</Link>
          </Button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50" aria-hidden="true">
        <span className="text-xs text-star-silver tracking-[0.3em] uppercase font-sans">Scroll</span>
        <div className="w-px h-10 bg-star-silver" />
      </div>
    </section>
  )
}
