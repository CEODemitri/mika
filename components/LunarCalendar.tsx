'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ── Lunar phase calculation (Meeus algorithm approximation) ─────────────────
const SYNODIC_MONTH = 29.53058867

function julianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

// Returns moon age in days (0–29.53) for a given calendar date
function moonAge(year: number, month: number, day: number): number {
  const jd = julianDay(year, month, day)
  // Known new moon: Jan 6 2000 (JD 2451549.5)
  const knownNew = 2451549.5
  const daysSince = jd - knownNew
  return ((daysSince % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH
}

type PhaseInfo = { symbol: string; name: string; emoji: string }

function getPhaseInfo(age: number): PhaseInfo {
  if (age < 1.85)  return { symbol: '○', name: 'New Moon',         emoji: '🌑' }
  if (age < 7.38)  return { symbol: '◔', name: 'Waxing Crescent',  emoji: '🌒' }
  if (age < 9.22)  return { symbol: '◑', name: 'First Quarter',    emoji: '🌓' }
  if (age < 14.77) return { symbol: '◕', name: 'Waxing Gibbous',   emoji: '🌔' }
  if (age < 16.61) return { symbol: '●', name: 'Full Moon',        emoji: '🌕' }
  if (age < 22.15) return { symbol: '◖', name: 'Waning Gibbous',   emoji: '🌖' }
  if (age < 23.99) return { symbol: '◐', name: 'Last Quarter',     emoji: '🌗' }
  if (age < 29.53) return { symbol: '◗', name: 'Waning Crescent',  emoji: '🌘' }
  return { symbol: '○', name: 'New Moon', emoji: '🌑' }
}

// Is this a notable phase (new, quarter, full)?
function isKeyPhase(age: number): boolean {
  return age < 1.85 || (age >= 7.38 && age < 9.22) || (age >= 14.77 && age < 16.61) || (age >= 22.15 && age < 23.99)
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function LunarCalendar() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth()) // 0-indexed

  // ── Build calendar grid ──────────────────────────────────────────────────
  const { days, notableDays } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay() // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const days: Array<{
      day: number
      currentMonth: boolean
      isToday: boolean
      age: number
      phase: PhaseInfo
      isKey: boolean
    }> = []

    // Trailing days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      const prevMonth = viewMonth === 0 ? 12 : viewMonth
      const prevYear  = viewMonth === 0 ? viewYear - 1 : viewYear
      const age = moonAge(prevYear, prevMonth, d)
      days.push({ day: d, currentMonth: false, isToday: false, age, phase: getPhaseInfo(age), isKey: isKeyPhase(age) })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const age = moonAge(viewYear, viewMonth + 1, d)
      const isToday =
        today.getFullYear() === viewYear &&
        today.getMonth() === viewMonth &&
        today.getDate() === d
      days.push({ day: d, currentMonth: true, isToday, age, phase: getPhaseInfo(age), isKey: isKeyPhase(age) })
    }

    // Leading days from next month
    const remainder = 42 - days.length
    for (let d = 1; d <= remainder; d++) {
      const nextMonth = viewMonth === 11 ? 1 : viewMonth + 2
      const nextYear  = viewMonth === 11 ? viewYear + 1 : viewYear
      const age = moonAge(nextYear, nextMonth, d)
      days.push({ day: d, currentMonth: false, isToday: false, age, phase: getPhaseInfo(age), isKey: isKeyPhase(age) })
    }

    // Collect notable days for the schedule strip
    const notableDays = days
      .filter((d) => d.currentMonth && d.isKey)
      .map((d) => ({
        day: d.day,
        phase: d.phase,
        date: new Date(viewYear, viewMonth, d.day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      }))

    return { days, notableDays }
  }, [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="space-y-8">

      {/* ── Month navigator ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Prev — icon only */}
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex items-center justify-center w-9 h-9 rounded-sm border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Month + year label */}
        <div className="text-center">
          <span className="font-serif text-xl font-semibold text-foreground tracking-wide">
            {MONTH_NAMES[viewMonth]}
          </span>
          <span className="font-sans text-sm text-muted-foreground ml-2">
            {viewYear}
          </span>
        </div>

        {/* Next — icon only */}
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="flex items-center justify-center w-9 h-9 rounded-sm border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-150"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Day-of-week headers ──────────────────────────────────── */}
      <div className="grid grid-cols-7 gap-px">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center font-sans text-[10px] tracking-widest uppercase text-muted-foreground py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-7 gap-px bg-border/30 rounded-md overflow-hidden border border-border/40">
        {days.map((cell, idx) => (
          <div
            key={idx}
            className={`
              relative flex flex-col items-center justify-between
              min-h-[56px] sm:min-h-[72px] py-1.5 px-1 bg-card
              ${!cell.currentMonth ? 'opacity-30' : ''}
              ${cell.isToday ? 'ring-1 ring-inset ring-primary/60' : ''}
            `}
          >
            {/* Day number */}
            <span
              className={`font-sans text-[11px] sm:text-xs leading-none ${
                cell.isToday
                  ? 'text-primary font-bold'
                  : 'text-foreground/70'
              }`}
            >
              {cell.day}
            </span>

            {/* Phase symbol */}
            <span
              className={`text-base sm:text-lg leading-none mt-auto ${
                cell.isKey && cell.currentMonth
                  ? 'text-primary'
                  : 'text-muted-foreground/50'
              }`}
              title={cell.phase.name}
              aria-label={cell.phase.name}
            >
              {cell.phase.symbol}
            </span>
          </div>
        ))}
      </div>

      {/* ── Phase symbol legend ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {[
          { symbol: '○', label: 'New' },
          { symbol: '◑', label: 'First Qtr' },
          { symbol: '●', label: 'Full' },
          { symbol: '◐', label: 'Last Qtr' },
        ].map(({ symbol, label }) => (
          <span key={label} className="flex items-center gap-1.5 font-sans text-[11px] text-muted-foreground">
            <span className="text-primary text-sm">{symbol}</span>
            {label}
          </span>
        ))}
      </div>

      {/* ── Monthly key-phase schedule ───────────────────────────── */}
      {notableDays.length > 0 && (
        <div className="border border-border/50 rounded-md overflow-hidden">
          <div className="bg-muted px-4 py-2.5 border-b border-border/40">
            <h3 className="font-sans text-[11px] tracking-[0.4em] uppercase text-muted-foreground">
              Key Phases This Month
            </h3>
          </div>
          <ul className="divide-y divide-border/30">
            {notableDays.map(({ day, phase, date }) => (
              <li
                key={day}
                className="flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/50 transition-colors duration-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary text-lg leading-none w-5 text-center" aria-hidden="true">
                    {phase.symbol}
                  </span>
                  <div>
                    <p className="font-sans text-xs font-semibold text-foreground">
                      {phase.name}
                    </p>
                    <p className="font-sans text-[10px] text-muted-foreground mt-0.5">
                      {date}
                    </p>
                  </div>
                </div>
                <span className="font-serif text-2xl font-bold text-foreground/20 tabular-nums">
                  {String(day).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
