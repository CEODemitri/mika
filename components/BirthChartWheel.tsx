'use client'

const SIGNS = [
  { name: 'Aries', symbol: '♈' },
  { name: 'Taurus', symbol: '♉' },
  { name: 'Gemini', symbol: '♊' },
  { name: 'Cancer', symbol: '♋' },
  { name: 'Leo', symbol: '♌' },
  { name: 'Virgo', symbol: '♍' },
  { name: 'Libra', symbol: '♎' },
  { name: 'Scorpio', symbol: '♏' },
  { name: 'Sagittarius', symbol: '♐' },
  { name: 'Capricorn', symbol: '♑' },
  { name: 'Aquarius', symbol: '♒' },
  { name: 'Pisces', symbol: '♓' },
]

const PLANET_PLACEMENTS = [
  { symbol: '☉', angle: 30, r: 110 },
  { symbol: '☽', angle: 75, r: 110 },
  { symbol: '☿', angle: 15, r: 110 },
  { symbol: '♀', angle: 45, r: 110 },
  { symbol: '♂', angle: 120, r: 110 },
  { symbol: '♃', angle: 200, r: 110 },
  { symbol: '♄', angle: 270, r: 110 },
]

function polarToXY(angleDeg: number, r: number, cx = 160, cy = 160) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(startDeg: number, endDeg: number, r: number, cx = 160, cy = 160) {
  const start = polarToXY(endDeg, r, cx, cy)
  const end = polarToXY(startDeg, r, cx, cy)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

export default function BirthChartWheel() {
  const cx = 160
  const cy = 160
  const outerR = 145
  const midR = 120
  const innerR = 85
  const coreR = 52

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 320 320"
        width="320"
        height="320"
        aria-label="Natal birth chart wheel"
        className="drop-shadow-[0_0_24px_rgba(var(--gold-rgb,212,175,55),0.15)]"
      >
        <defs>
          <radialGradient id="wheelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(230,40%,10%)" />
            <stop offset="100%" stopColor="hsl(230,45%,5%)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx={cx} cy={cy} r={outerR} fill="url(#wheelGrad)" stroke="hsl(42,72%,58%)" strokeWidth="0.8" strokeOpacity="0.5" />

        {/* House ring dividers (12 spokes) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30
          const outer = polarToXY(angle, outerR, cx, cy)
          const inner = polarToXY(angle, coreR, cx, cy)
          return (
            <line
              key={`spoke-${i}`}
              x1={outer.x} y1={outer.y}
              x2={inner.x} y2={inner.y}
              stroke="hsl(42,72%,58%)" strokeWidth="0.5" strokeOpacity="0.35"
            />
          )
        })}

        {/* Middle ring */}
        <circle cx={cx} cy={cy} r={midR} fill="none" stroke="hsl(42,72%,58%)" strokeWidth="0.5" strokeOpacity="0.4" />
        {/* Inner ring */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="hsl(42,72%,58%)" strokeWidth="0.5" strokeOpacity="0.25" />
        {/* Core */}
        <circle cx={cx} cy={cy} r={coreR} fill="hsl(230,50%,7%)" stroke="hsl(42,72%,58%)" strokeWidth="0.8" strokeOpacity="0.6" />

        {/* Zodiac sign symbols in outer ring */}
        {SIGNS.map((sign, i) => {
          const midAngle = i * 30 + 15
          const pos = polarToXY(midAngle, (outerR + midR) / 2, cx, cy)
          return (
            <text
              key={sign.name}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fill="hsl(42,72%,68%)"
              fontFamily="serif"
              opacity="0.9"
              filter="url(#glow)"
            >
              {sign.symbol}
            </text>
          )
        })}

        {/* House numbers in inner segment */}
        {Array.from({ length: 12 }).map((_, i) => {
          const midAngle = i * 30 + 15
          const pos = polarToXY(midAngle, (innerR + coreR) / 2, cx, cy)
          return (
            <text
              key={`house-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="7.5"
              fill="hsl(220,20%,65%)"
              fontFamily="sans-serif"
              opacity="0.6"
            >
              {i + 1}
            </text>
          )
        })}

        {/* Planet glyphs in middle ring */}
        {PLANET_PLACEMENTS.map((p, i) => {
          const pos = polarToXY(p.angle, (midR + innerR) / 2, cx, cy)
          return (
            <text
              key={`planet-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9"
              fill="hsl(220,20%,85%)"
              fontFamily="serif"
              filter="url(#glow)"
            >
              {p.symbol}
            </text>
          )
        })}

        {/* Centre cross (axes) */}
        {[0, 90].map((angle, i) => {
          const a = polarToXY(angle, coreR - 5, cx, cy)
          const b = polarToXY(angle + 180, coreR - 5, cx, cy)
          return (
            <line key={`axis-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="hsl(42,72%,58%)" strokeWidth="0.6" strokeOpacity="0.5" />
          )
        })}

        {/* Centre glyph */}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          fontSize="18" fill="hsl(42,72%,58%)" fontFamily="serif" filter="url(#glow)" opacity="0.7">
          ✦
        </text>
      </svg>

      {/* Subtle rotating ring animation */}
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .wheel-spin { animation: spin-slow 80s linear infinite; transform-origin: center; }
      `}</style>
    </div>
  )
}
