'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-24 px-4 bg-deep-navy text-center" id="newsletter">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
        <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans font-medium">
          Stay Aligned
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white text-balance">
          Cosmic Updates, Delivered
        </h2>
        <p className="font-sans text-star-silver text-base leading-relaxed">
          Weekly moon cycles, planetary transits, mythology deep-dives, and astrological insights — straight to your inbox.
        </p>

        {submitted ? (
          <p className="font-sans text-gold text-base tracking-wide">
            You&apos;re on the list. The stars will find you.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm flex-col sm:flex-row gap-3"
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-md bg-white/5 border border-white/15 text-white placeholder:text-white/30 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 font-sans tracking-wide uppercase text-sm"
            >
              Subscribe
            </Button>
          </form>
        )}

        <p className="font-sans text-xs text-star-silver/60">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
