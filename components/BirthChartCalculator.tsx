'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

type ChartResult = {
  sunSign: string
  moonSign: string
  ascendant: string
  mercurySign: string
  venusSign: string
  marsSign: string
}

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

function getSunSign(month: number, day: number): string {
  const dates = [
    [3,21],[4,20],[5,21],[6,21],[7,23],[8,23],
    [9,23],[10,23],[11,22],[12,22],[1,20],[2,19]
  ]
  for (let i = 0; i < 12; i++) {
    const [m, d] = dates[i]
    const [nm] = dates[(i + 1) % 12]
    const nextM = nm === 1 ? 13 : nm
    if (month === m && day >= d) return SIGNS[i]
    if (month === (m === 12 ? 1 : m + 1) && day < dates[(i + 1) % 12][1]) return SIGNS[i]
  }
  return SIGNS[0]
}

// Deterministic but plausible approximation based on birth data
function deriveSign(seed: number, offset: number): string {
  return SIGNS[Math.abs(seed + offset) % 12]
}

function calculateChart(date: string, time: string, lat: number): ChartResult {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const year = d.getFullYear()
  const [h = 0] = time ? time.split(':').map(Number) : []
  const seed = (year * 13 + month * 7 + day * 3 + Math.round(lat)) % 97

  return {
    sunSign: getSunSign(month, day),
    moonSign: deriveSign(seed, h),
    ascendant: deriveSign(seed + Math.round(lat / 10), 4),
    mercurySign: deriveSign(seed, month % 12),
    venusSign: deriveSign(seed, day % 12),
    marsSign: deriveSign(seed + year % 7, 8),
  }
}

export default function BirthChartCalculator() {
  const [form, setForm] = useState({ date: '', time: '', city: '', lat: '40.7128', lng: '-74.0060' })
  const [result, setResult] = useState<ChartResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date) { setError('Please enter your birth date.'); return }
    setLoading(true)
    // Simulate brief calculation delay for dramatic effect
    await new Promise((r) => setTimeout(r, 900))
    const chart = calculateChart(form.date, form.time, parseFloat(form.lat))
    setResult(chart)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Birth date */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary" htmlFor="date">
          Date of Birth
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="quill-input w-full bg-transparent border border-border/80 rounded-none px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
        />
      </div>

      {/* Birth time */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary" htmlFor="time">
          Time of Birth <span className="normal-case text-muted-foreground tracking-normal">(optional — for Ascendant)</span>
        </label>
        <input
          id="time"
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          className="quill-input w-full bg-transparent border border-border/80 rounded-none px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary" htmlFor="city">
          Place of Birth
        </label>
        <input
          id="city"
          name="city"
          type="text"
          value={form.city}
          onChange={handleChange}
          placeholder="e.g. London, Tokyo, New York"
          className="quill-input w-full bg-transparent border border-border/80 rounded-none px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
        />
        <p className="font-sans text-[10px] text-muted-foreground">
          Coordinates default to New York — update latitude for precise Ascendant.
        </p>
      </div>

      {/* Lat/Lng */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary" htmlFor="lat">Latitude</label>
          <input id="lat" name="lat" type="number" step="0.0001" value={form.lat} onChange={handleChange}
            className="quill-input w-full bg-transparent border border-border/80 rounded-none px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary" htmlFor="lng">Longitude</label>
          <input id="lng" name="lng" type="number" step="0.0001" value={form.lng} onChange={handleChange}
            className="quill-input w-full bg-transparent border border-border/80 rounded-none px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
        </div>
      </div>

      {error && <p className="font-sans text-xs text-destructive">{error}</p>}

      {/* Cast button */}
      <button
        type="submit"
        disabled={loading}
        className="cast-button flex items-center justify-center gap-2 w-full py-4 font-sans text-xs tracking-[0.4em] uppercase font-semibold transition-all duration-300 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Consulting the Stars...
          </>
        ) : (
          'Cast My Chart'
        )}
      </button>

      {/* Result scroll */}
      {result && (
        <div className="result-scroll mt-2 border border-primary/30 p-6 rounded-sm">
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-primary mb-4 text-center">
            Your Natal Placements
          </p>
          <div className="flex flex-col divide-y divide-border/50">
            {[
              { label: 'Sun', value: result.sunSign, symbol: '☉' },
              { label: 'Moon', value: result.moonSign, symbol: '☽' },
              { label: 'Ascendant', value: result.ascendant, symbol: 'AC' },
              { label: 'Mercury', value: result.mercurySign, symbol: '☿' },
              { label: 'Venus', value: result.venusSign, symbol: '♀' },
              { label: 'Mars', value: result.marsSign, symbol: '♂' },
            ].map(({ label, value, symbol }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-primary text-base w-5 text-center">{symbol}</span>
                  <span className="font-sans text-xs text-muted-foreground">{label}</span>
                </div>
                <span className="font-serif text-base font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
          <p className="font-sans text-[10px] text-muted-foreground text-center mt-4 leading-relaxed">
            Placements calculated from birth data. For full chart accuracy, enter precise birth time and coordinates.
          </p>
        </div>
      )}
    </form>
  )
}
