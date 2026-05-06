'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Loader2, Database, Key, Globe } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/Footer'

type SeedStatus = 'idle' | 'loading' | 'success' | 'error'

export default function SetupPage() {
  const [seedStatus, setSeedStatus] = useState<SeedStatus>('idle')
  const [seedMessage, setSeedMessage] = useState('')

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  const checks = [
    {
      label: 'NEXT_PUBLIC_SANITY_PROJECT_ID',
      value: projectId,
      description: 'Your Sanity project ID from sanity.io/manage',
      icon: Globe,
    },
    {
      label: 'NEXT_PUBLIC_SANITY_DATASET',
      value: dataset,
      description: 'Dataset name — typically "production"',
      icon: Database,
    },
    {
      label: 'SANITY_API_READ_TOKEN',
      value: '(server-side only)',
      description: 'API token with at least viewer permissions',
      icon: Key,
    },
  ]

  async function handleSeed() {
    setSeedStatus('loading')
    setSeedMessage('')
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')
      setSeedStatus('success')
      setSeedMessage(`Successfully seeded ${data.seeded} documents into Sanity.`)
    } catch (err: unknown) {
      setSeedStatus('error')
      setSeedMessage(err instanceof Error ? err.message : 'Seeding failed.')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12 border-b border-border pb-8">
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-3">
              Sanity CMS / Setup
            </p>
            <h1 className="font-serif text-5xl font-bold text-foreground">
              Connection Status
            </h1>
            <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed">
              Verify your Sanity environment variables are configured and seed the three
              sample blog posts into your dataset with one click.
            </p>
          </div>

          {/* Env var checks */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Environment Variables
            </h2>
            <div className="flex flex-col gap-3">
              {checks.map(({ label, value, description, icon: Icon }) => {
                const ok = Boolean(value && value !== '(server-side only)')
                const isServerSide = value === '(server-side only)'
                return (
                  <div
                    key={label}
                    className="spellbook-card rounded-sm p-4 flex items-start gap-4"
                  >
                    <div className="mt-0.5 shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-foreground">{label}</p>
                      <p className="font-sans text-xs text-muted-foreground mt-0.5">
                        {description}
                      </p>
                      {value && !isServerSide && (
                        <p className="font-mono text-xs text-primary mt-1 truncate">
                          {value}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {isServerSide ? (
                        <CheckCircle className="w-4 h-4 text-primary opacity-50" />
                      ) : ok ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {(!projectId || !dataset) && (
              <div className="mt-4 p-4 border border-destructive/30 bg-destructive/5 rounded-sm">
                <p className="font-sans text-xs text-destructive leading-relaxed">
                  One or more public environment variables are missing. Add them in the
                  v0 project settings under <strong>Vars</strong>, then redeploy or
                  refresh the preview.
                </p>
              </div>
            )}
          </section>

          {/* Sanity setup instructions */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Sanity Dashboard Steps
            </h2>
            <ol className="flex flex-col gap-4">
              {[
                {
                  step: '01',
                  title: 'Open sanity.io/manage',
                  body: 'Log in and select your project, or create a new one. Copy the Project ID shown at the top.',
                },
                {
                  step: '02',
                  title: 'Create a dataset',
                  body: 'Go to Datasets → Add dataset. Name it "production" (or match your NEXT_PUBLIC_SANITY_DATASET value).',
                },
                {
                  step: '03',
                  title: 'Generate an API token',
                  body: 'Go to API → Tokens → Add API token. Give it Editor permissions so it can create/update documents. Paste the token into the SANITY_API_READ_TOKEN variable in v0 project settings.',
                },
                {
                  step: '04',
                  title: 'Set CORS origin',
                  body: 'Go to API → CORS origins → Add origin. Add your preview URL (e.g. https://your-project.v0.dev) and check "Allow credentials".',
                },
                {
                  step: '05',
                  title: 'Seed content below',
                  body: 'Once all variables are set, click "Seed Sample Content" to populate the three sample blog posts automatically.',
                },
              ].map(({ step, title, body }) => (
                <li key={step} className="flex gap-5 items-start">
                  <span className="font-serif text-4xl font-bold text-primary/20 leading-none shrink-0 w-10 text-right">
                    {step}
                  </span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">{title}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Seed button */}
          <section>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Seed Sample Content
            </h2>
            <p className="font-sans text-xs text-muted-foreground mb-6 leading-relaxed">
              This will create three blog posts (Mercury Retrograde, New Moon Ritual, Pluto
              in Aquarius) in your Sanity dataset using <code className="font-mono">createOrReplace</code> — 
              safe to run multiple times.
            </p>

            <button
              onClick={handleSeed}
              disabled={seedStatus === 'loading'}
              className="cast-button font-sans text-sm px-8 py-3 rounded-sm tracking-wide flex items-center gap-2 disabled:opacity-50 transition-all duration-200"
            >
              {seedStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              {seedStatus === 'loading' ? 'Seeding...' : 'Seed Sample Content'}
            </button>

            {seedStatus === 'success' && (
              <div className="mt-4 flex items-center gap-2 p-4 border border-primary/30 bg-primary/5 rounded-sm">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <p className="font-sans text-xs text-primary">{seedMessage}</p>
              </div>
            )}

            {seedStatus === 'error' && (
              <div className="mt-4 p-4 border border-destructive/30 bg-destructive/5 rounded-sm">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-destructive">Seeding failed</p>
                    <p className="font-sans text-xs text-destructive/80 mt-1">{seedMessage}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-2">
                      Ensure your <code className="font-mono">SANITY_API_READ_TOKEN</code> has
                      Editor or above permissions in your Sanity project settings, and that your dataset exists.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Quick links */}
          <section className="mt-12 pt-8 border-t border-border">
            <p className="font-sans text-xs text-muted-foreground mb-3 tracking-widest uppercase">
              Quick Links
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: 'https://sanity.io/manage', label: 'Sanity Dashboard' },
                { href: '/studio', label: 'Sanity Studio' },
                { href: '/blog', label: 'Blog Page' },
                { href: '/astrology/birth-chart', label: 'Birth Chart' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="font-sans text-xs px-4 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
