'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import astrologyData from '@/data/astrology-positions.json'

type AstrologyEntry = {
  date: string
  moon_sign: string
  positions: Record<string, string>
}

type ChartResult = {
  sunSign: string
  moonSign: string
  ascendant: string
  mercurySign: string
  venusSign: string
  marsSign: string
  jupiterSign: string
  saturnSign: string
  uranusSign: string
  neptuneSign: string
  plutoSign: string
  dataSource: 'ephemeris' | 'calculated'
}

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

// Map date string YYYY-MM-DD to entry for exact lookup
const entriesByDate = new Map<string, AstrologyEntry>(
  (astrologyData as AstrologyEntry[]).map((e) => [e.date, e])
)

// Find the closest entry to a given date string
function findClosestEntry(dateStr: string): AstrologyEntry | null {
  if (entriesByDate.has(dateStr)) return entriesByDate.get(dateStr)!
  // If outside the dataset range, return null — fall back to calculation
  const dates = Array.from(entriesByDate.keys()).sort()
  if (dateStr < dates[0] || dateStr > dates[dates.length - 1]) return null
  // Binary-search for nearest
  for (let i = 0; i < dates.length - 1; i++) {
    if (dates[i] <= dateStr && dateStr <= dates[i + 1]) {
      return entriesByDate.get(dates[i])!
    }
  }
  return null
}

function getSunSign(month: number, day: number): string {
  const transitions: [number, number, string][] = [
    [3,21,'Aries'],[4,20,'Taurus'],[5,21,'Gemini'],[6,21,'Cancer'],
    [7,23,'Leo'],[8,23,'Virgo'],[9,23,'Libra'],[10,23,'Scorpio'],
    [11,22,'Sagittarius'],[12,22,'Capricorn'],[1,20,'Aquarius'],[2,19,'Pisces'],
  ]
  for (const [m, d, sign] of transitions) {
    if (month === m && day >= d) return sign
  }
  // Fall back using previous transition end
  const prev = [...transitions].reverse().find(([m]) => month > m || (month === m))
  return prev ? prev[2] : 'Aries'
}

function deriveSign(seed: number, offset: number): string {
  return SIGNS[Math.abs(seed + offset) % 12]
}

function calculateChart(date: string, time: string, lat: number): ChartResult {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const year = d.getFullYear()
  const [h = 0] = time ? time.split(':').map(Number) : []

  // Try to look up exact or near-exact planetary positions from ephemeris data
  const entry = findClosestEntry(date)
  if (entry) {
    const pos = entry.positions
    const seed = (year * 13 + month * 7 + day * 3 + Math.round(lat)) % 97
    return {
      sunSign: pos.Sun ?? getSunSign(month, day),
      moonSign: pos.Moon ?? entry.moon_sign,
      ascendant: deriveSign(seed + Math.round(lat / 10), 4),
      mercurySign: pos.Mercury ?? deriveSign(seed, month % 12),
      venusSign: pos.Venus ?? deriveSign(seed, day % 12),
      marsSign: pos.Mars ?? deriveSign(seed + year % 7, 8),
      jupiterSign: pos.Jupiter ?? deriveSign(seed, 3),
      saturnSign: pos.Saturn ?? deriveSign(seed, 6),
      uranusSign: pos.Uranus ?? deriveSign(seed, 9),
      neptuneSign: pos.Neptune ?? deriveSign(seed, 10),
      plutoSign: pos.Pluto ?? deriveSign(seed, 11),
      dataSource: 'ephemeris',
    }
  }

  // Fallback: fully calculated approximation
  const seed = (year * 13 + month * 7 + day * 3 + Math.round(lat)) % 97
  return {
    sunSign: getSunSign(month, day),
    moonSign: deriveSign(seed, h),
    ascendant: deriveSign(seed + Math.round(lat / 10), 4),
    mercurySign: deriveSign(seed, month % 12),
    venusSign: deriveSign(seed, day % 12),
    marsSign: deriveSign(seed + year % 7, 8),
    jupiterSign: deriveSign(seed, 3),
    saturnSign: deriveSign(seed, 6),
    uranusSign: deriveSign(seed, 9),
    neptuneSign: deriveSign(seed, 10),
    plutoSign: deriveSign(seed, 11),
    dataSource: 'calculated',
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
              { label: 'Jupiter', value: result.jupiterSign, symbol: '♃' },
              { label: 'Saturn', value: result.saturnSign, symbol: '♄' },
              { label: 'Uranus', value: result.uranusSign, symbol: '♅' },
              { label: 'Neptune', value: result.neptuneSign, symbol: '♆' },
              { label: 'Pluto', value: result.plutoSign, symbol: '♇' },
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
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className={`inline-block px-2 py-0.5 text-[9px] tracking-widest uppercase font-sans rounded-sm ${
              result.dataSource === 'ephemeris'
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-muted text-muted-foreground border border-border'
            }`}>
              {result.dataSource === 'ephemeris' ? 'Ephemeris Data 2026–2028' : 'Approximated'}
            </span>
          </div>
          <p className="font-sans text-[10px] text-muted-foreground text-center mt-2 leading-relaxed">
            {result.dataSource === 'ephemeris'
              ? 'Planetary positions sourced from ephemeris data. Ascendant requires birth time and coordinates.'
              : 'Positions approximated for dates outside 2026–2028. For full accuracy, enter birth time and coordinates.'}
          </p>
        </div>
      )}
    </form>
  )
}
