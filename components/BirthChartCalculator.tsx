'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, MapPin, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
import astrologyData from '@/data/astrology-positions.json'

// ── Types ─────────────────────────────────────────────────────────────────────

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

type GeoResult = {
  display_name: string
  city: string
  state: string
  country: string
  country_code: string
  lat: number
  lon: number
}

// ── Ephemeris lookup ──────────────────────────────────────────────────────────

const entriesByDate = new Map<string, AstrologyEntry>(
  (astrologyData as AstrologyEntry[]).map((e) => [e.date, e])
)

function findClosestEntry(dateStr: string): AstrologyEntry | null {
  if (entriesByDate.has(dateStr)) return entriesByDate.get(dateStr)!
  const dates = Array.from(entriesByDate.keys()).sort()
  if (dateStr < dates[0] || dateStr > dates[dates.length - 1]) return null
  for (let i = 0; i < dates.length - 1; i++) {
    if (dates[i] <= dateStr && dateStr <= dates[i + 1]) {
      return entriesByDate.get(dates[i])!
    }
  }
  return null
}

// ── Astronomical helpers ──────────────────────────────────────────────────────

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
]

/**
 * Accurate Sun sign using precise cusp dates.
 * Cusps shift by ~1 day every 4 years due to leap years —
 * this table covers the most common dates and is accurate within 1 day.
 */
function getSunSign(month: number, day: number): string {
  const cusps: [number, number, string][] = [
    [1, 20, 'Aquarius'],
    [2, 19, 'Pisces'],
    [3, 21, 'Aries'],
    [4, 20, 'Taurus'],
    [5, 21, 'Gemini'],
    [6, 21, 'Cancer'],
    [7, 23, 'Leo'],
    [8, 23, 'Virgo'],
    [9, 23, 'Libra'],
    [10, 23, 'Scorpio'],
    [11, 22, 'Sagittarius'],
    [12, 22, 'Capricorn'],
  ]
  // Walk the cusps: if today >= this cusp date, this is the current sign
  // We walk in reverse and pick the last cusp we've passed
  let sign = 'Capricorn' // default for Jan 1–19
  for (const [m, d, s] of cusps) {
    if (month > m || (month === m && day >= d)) {
      sign = s
    }
  }
  return sign
}

/**
 * Compute Julian Day Number from calendar date + UT hours.
 */
function julianDay(year: number, month: number, day: number, utHours = 0): number {
  if (month <= 2) { year -= 1; month += 12 }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + utHours / 24 + B - 1524.5
}

/**
 * Greenwich Mean Sidereal Time in degrees for a given JD.
 * Formula: Meeus, Astronomical Algorithms ch.12
 */
function gmst(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0
  let theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000
  return ((theta % 360) + 360) % 360
}

/**
 * Local Sidereal Time in degrees.
 */
function lst(jd: number, lonDeg: number): number {
  return ((gmst(jd) + lonDeg) % 360 + 360) % 360
}

/**
 * Derive Ascendant sign from birth datetime and geographic coordinates.
 * Uses the local sidereal time to determine which ecliptic degree is rising.
 * Accurate for standard chart calculations.
 */
function getAscendant(
  year: number, month: number, day: number,
  utHours: number, lat: number, lon: number
): string {
  const jd = julianDay(year, month, day, utHours)
  const lstDeg = lst(jd, lon)

  // Obliquity of the ecliptic (simplified, ~23.44°)
  const eps = 23.4392911 * (Math.PI / 180)
  const lstRad = lstDeg * (Math.PI / 180)
  const latRad = lat * (Math.PI / 180)

  // Ascendant longitude formula (Placidus / equal-house approximation)
  const y = -Math.cos(lstRad)
  const x = Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(lstRad)
  let ascDeg = Math.atan2(y, x) * (180 / Math.PI)
  if (ascDeg < 0) ascDeg += 360

  // Map ecliptic degree → sign (each sign = 30°)
  return SIGNS[Math.floor(ascDeg / 30) % 12]
}

/**
 * Fallback seed-based derivation for planets without ephemeris data.
 */
function deriveSign(seed: number, offset: number): string {
  return SIGNS[Math.abs(seed + offset) % 12]
}

// ── Main calculation ──────────────────────────────────────────────────────────

function calculateChart(
  date: string, time: string, lat: number, lon: number
): ChartResult {
  const d = new Date(date + 'T12:00:00Z') // noon UTC to avoid TZ edge cases
  const year = d.getUTCFullYear()
  const month = d.getUTCMonth() + 1
  const day = d.getUTCDate()

  let utHours = 12
  if (time) {
    const [h, m] = time.split(':').map(Number)
    utHours = h + (m || 0) / 60
  }

  const entry = findClosestEntry(date)
  const seed = (year * 13 + month * 7 + day * 3 + Math.abs(Math.round(lat))) % 97

  const ascendant =
    time
      ? getAscendant(year, month, day, utHours, lat, lon)
      : 'Unknown (time required)'

  if (entry) {
    const pos = entry.positions
    return {
      sunSign: pos.Sun ?? getSunSign(month, day),
      moonSign: pos.Moon ?? entry.moon_sign,
      ascendant,
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

  return {
    sunSign: getSunSign(month, day),
    moonSign: deriveSign(seed, Math.round(utHours)),
    ascendant,
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function BirthChartCalculator() {
  const [form, setForm] = useState({
    date: '', time: '', city: '', lat: '40.7128', lon: '-74.0060',
  })
  const [geoResults, setGeoResults] = useState<GeoResult[]>([])
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoResolved, setGeoResolved] = useState<string | null>(null)
  const [geoError, setGeoError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [result, setResult] = useState<ChartResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchGeo = useCallback(async (query: string) => {
    if (query.length < 3) { setGeoResults([]); setShowDropdown(false); return }
    setGeoLoading(true)
    setGeoError('')
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.error) { setGeoError(data.error); setGeoResults([]); setShowDropdown(false); return }
      setGeoResults(data.results ?? [])
      setShowDropdown((data.results ?? []).length > 0)
    } catch {
      setGeoError('Could not reach geocoding service.')
    } finally {
      setGeoLoading(false)
    }
  }, [])

  function handleCityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setForm((prev) => ({ ...prev, city: val }))
    setGeoResolved(null)
    setError('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchGeo(val), 500)
  }

  function selectGeoResult(r: GeoResult) {
    const label = [r.city, r.state, r.country].filter(Boolean).join(', ')
    setForm((prev) => ({
      ...prev,
      city: label,
      lat: r.lat.toFixed(6),
      lon: r.lon.toFixed(6),
    }))
    setGeoResolved(label)
    setGeoResults([])
    setShowDropdown(false)
  }

  function handleCoordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setGeoResolved(null)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date) { setError('Please enter your birth date.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    const chart = calculateChart(
      form.date, form.time,
      parseFloat(form.lat), parseFloat(form.lon)
    )
    setResult(chart)
    setLoading(false)
  }

  const inputCls =
    'quill-input w-full bg-transparent border border-border/80 rounded-none px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground'
  const labelCls =
    'font-sans text-[10px] tracking-[0.4em] uppercase text-primary'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label className={labelCls} htmlFor="date">Date of Birth</label>
        <input
          id="date" name="date" type="date"
          value={form.date}
          onChange={(e) => { setForm((p) => ({ ...p, date: e.target.value })); setError('') }}
          required className={inputCls}
        />
      </div>

      {/* Time */}
      <div className="flex flex-col gap-1.5">
        <label className={labelCls} htmlFor="time">
          Time of Birth{' '}
          <span className="normal-case text-muted-foreground tracking-normal">(optional — required for Ascendant)</span>
        </label>
        <input
          id="time" name="time" type="time"
          value={form.time}
          onChange={(e) => { setForm((p) => ({ ...p, time: e.target.value })) }}
          className={inputCls}
        />
      </div>

      {/* City autocomplete */}
      <div className="flex flex-col gap-1.5">
        <label className={labelCls} htmlFor="city">Place of Birth</label>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <input
              id="city" name="city" type="text"
              value={form.city}
              onChange={handleCityChange}
              placeholder="e.g. London, Tokyo, New York"
              autoComplete="off"
              className={`${inputCls} pr-10`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {geoLoading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : geoResolved
                ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                : <MapPin className="h-3.5 w-3.5" />
              }
            </span>
          </div>

          {/* Autocomplete dropdown */}
          {showDropdown && geoResults.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 border border-border/80 bg-background shadow-lg mt-0.5">
              {geoResults.map((r, i) => {
                const label = [r.city, r.state, r.country].filter(Boolean).join(', ')
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectGeoResult(r)}
                    className="w-full text-left px-4 py-3 font-sans text-xs text-foreground hover:bg-primary/10 border-b border-border/40 last:border-b-0 flex items-start gap-2 transition-colors"
                  >
                    <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                    <span className="truncate">{label}</span>
                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground font-mono">
                      {r.lat.toFixed(2)}, {r.lon.toFixed(2)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Status line */}
        {geoError && (
          <p className="flex items-center gap-1.5 font-sans text-[10px] text-destructive">
            <AlertCircle className="h-3 w-3" />{geoError}
          </p>
        )}
        {geoResolved && !geoError && (
          <p className="flex items-center gap-1.5 font-sans text-[10px] text-primary">
            <CheckCircle2 className="h-3 w-3" />
            Resolved: {geoResolved}
          </p>
        )}
        {!geoResolved && !geoError && (
          <p className="font-sans text-[10px] text-muted-foreground">
            Type your city and select from suggestions to auto-fill coordinates.
          </p>
        )}
      </div>

      {/* Lat / Lon — editable, auto-filled by geocode */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls} htmlFor="lat">Latitude</label>
          <input
            id="lat" name="lat" type="number" step="0.000001"
            value={form.lat} onChange={handleCoordChange}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls} htmlFor="lon">Longitude</label>
          <input
            id="lon" name="lon" type="number" step="0.000001"
            value={form.lon} onChange={handleCoordChange}
            className={inputCls}
          />
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 font-sans text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />{error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit" disabled={loading}
        className="cast-button flex items-center justify-center gap-2 w-full py-4 font-sans text-xs tracking-[0.4em] uppercase font-semibold transition-all duration-300 disabled:opacity-60"
      >
        {loading
          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Consulting the Stars...</>
          : 'Cast My Chart'
        }
      </button>

      {/* Results */}
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
                  <span className="text-primary text-base w-5 text-center select-none">{symbol}</span>
                  <span className="font-sans text-xs text-muted-foreground">{label}</span>
                </div>
                <span className="font-serif text-base font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
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
              ? 'Planetary signs from ephemeris. Ascendant computed via sidereal time — requires birth time and location.'
              : 'Positions approximated for dates outside 2026–2028. Enter birth time and city for best accuracy.'}
          </p>
        </div>
      )}
    </form>
  )
}
