'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'

// ---------------------------------------------------------------------------
// Crater data — lat/lon in degrees (Moon IAU coords), converted to map %
// Lunar map: lon 0 = center, lat 0 = equator. Image is 0–360 lon, -90 to 90 lat.
// We use the NASA/USGS LRO WAC mosaic served via tiles.
// ---------------------------------------------------------------------------
type Crater = {
  id: string
  name: string
  lat: number   // degrees, positive = north
  lon: number   // degrees, 0–360 (east-positive)
  diameter: string
  depth: string
  type: string
  notes: string
}

const CRATERS: Crater[] = [
  { id: 'tycho',      name: 'Tycho',        lat: -43.3, lon: 348.8, diameter: '85 km',   depth: '4.8 km', type: 'Impact crater', notes: 'Prominent ray system visible during full moon.' },
  { id: 'copernicus', name: 'Copernicus',   lat:  9.7,  lon: 339.9, diameter: '93 km',   depth: '3.8 km', type: 'Impact crater', notes: 'Central peaks and terraced walls; ~800 Ma old.' },
  { id: 'aristarchus',name: 'Aristarchus',  lat:  23.7, lon: 312.5, diameter: '40 km',   depth: '3.7 km', type: 'Impact crater', notes: 'Brightest crater on the near side.' },
  { id: 'clavius',    name: 'Clavius',      lat: -58.4, lon: 345.5, diameter: '225 km',  depth: '3.5 km', type: 'Walled plain',  notes: 'One of the largest craters on the near side.' },
  { id: 'plato',      name: 'Plato',        lat:  51.6, lon: 350.7, diameter: '101 km',  depth: '1.0 km', type: 'Walled plain',  notes: 'Flat dark floor; ancient flooded basin.' },
  { id: 'kepler',     name: 'Kepler',       lat:  8.1,  lon: 322.0, diameter: '32 km',   depth: '2.6 km', type: 'Impact crater', notes: 'Bright ray crater, ~1 Ga old.' },
  { id: 'mare_tranq', name: 'Mare Tranquillitatis', lat: 8.5, lon: 31.4, diameter: '873 km', depth: '—', type: 'Mare', notes: 'Apollo 11 landing site (1969).' },
  { id: 'mare_seren', name: 'Mare Serenitatis', lat: 28.0, lon: 17.5, diameter: '674 km', depth: '—', type: 'Mare', notes: 'Apollo 17 landed on its southern edge.' },
  { id: 'schickard',  name: 'Schickard',    lat: -44.3, lon: 305.5, diameter: '227 km',  depth: '1.5 km', type: 'Walled plain',  notes: 'Ancient flooded crater near the limb.' },
  { id: 'petavius',   name: 'Petavius',     lat: -25.1, lon: 60.4,  diameter: '177 km',  depth: '3.3 km', type: 'Impact crater', notes: 'Contains a prominent central mountain ridge.' },
]

// Overlay definitions
type Overlay = {
  id: string
  label: string
  color: string        // Tailwind border/text color class
  dotColor: string     // CSS color for SVG dots
  icon: string
  description: string
}

const OVERLAYS: Overlay[] = [
  { id: 'craters',       label: 'Craters',       color: 'text-amber-400   border-amber-400/50',   dotColor: '#f59e0b', icon: '○', description: 'Named impact craters & basins' },
  { id: 'zodiac',        label: 'Zodiac Belt',    color: 'text-violet-400  border-violet-400/50',  dotColor: '#a78bfa', icon: '♈', description: 'Ecliptic zodiac projection' },
  { id: 'constellations',label: 'Constellations', color: 'text-sky-400     border-sky-400/50',     dotColor: '#38bdf8', icon: '✦', description: 'Background constellation map' },
  { id: 'planets',       label: 'Planets',        color: 'text-rose-400    border-rose-400/50',    dotColor: '#fb7185', icon: '⊕', description: 'Current planetary positions' },
]

// Convert crater lat/lon → percentage on a 0-360 lon, -90 to 90 lat map image
// For the near side we only show 270–90 longitude (wrapping), center ~0 lon
function craterToPercent(lat: number, lon: number): { x: number; y: number } | null {
  // Normalize lon to -180..180
  let lo = lon > 180 ? lon - 360 : lon
  // Near-side visible: roughly -100 to 100 lon
  if (lo < -95 || lo > 95) return null
  const x = ((lo + 90) / 180) * 100   // 0% = -90 lon, 100% = +90 lon
  const y = ((90 - lat) / 180) * 100  // 0% = north pole, 100% = south pole
  return { x, y }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type LeaderLineProps = { x: number; y: number; crater: Crater; onClose: () => void }
function LeaderLine({ x, y, crater, onClose }: LeaderLineProps) {
  // Decide panel direction based on position
  const panelLeft = x > 60
  const panelTop  = y > 55

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {/* Dot at crater */}
        <circle cx={`${x}%`} cy={`${y}%`} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
        {/* Leader line */}
        <line
          x1={`${x}%`} y1={`${y}%`}
          x2={`${panelLeft ? x - 14 : x + 14}%`}
          y2={`${panelTop  ? y - 12 : y + 12}%`}
          stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2"
        />
      </svg>

      {/* Info panel */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left:   panelLeft ? `${x - 40}%` : `${x + 2}%`,
          top:    panelTop  ? `${y - 38}%` : `${y + 4}%`,
          transform: 'translate(-0%,-0%)',
        }}
      >
        <div className="relative bg-background/95 backdrop-blur-sm border border-primary/40 rounded-sm shadow-xl w-56 p-3">
          {/* Close */}
          <button
            className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-sm hover:bg-muted transition-colors"
            onClick={onClose}
            aria-label="Close crater info"
          >
            &times;
          </button>
          <p className="font-serif text-base font-bold text-foreground pr-4">{crater.name}</p>
          <p className="font-sans text-[10px] tracking-widest uppercase text-primary mb-2">{crater.type}</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2">
            <div>
              <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-wide">Diameter</p>
              <p className="font-sans text-xs text-foreground">{crater.diameter}</p>
            </div>
            <div>
              <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-wide">Depth</p>
              <p className="font-sans text-xs text-foreground">{crater.depth}</p>
            </div>
          </div>
          <p className="font-sans text-[10px] text-muted-foreground leading-relaxed">{crater.notes}</p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main MoonMap component
// ---------------------------------------------------------------------------
export default function MoonMap() {
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set(['craters']))
  const [selectedCrater, setSelectedCrater] = useState<Crater | null>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef<{ mx: number; my: number; tx: number; ty: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleOverlay = (id: string) => {
    setActiveOverlays(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Zoom on wheel
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setTransform(t => {
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const next = Math.min(Math.max(t.scale * delta, 1), 6)
      return { ...t, scale: next }
    })
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    dragStart.current = { mx: e.clientX, my: e.clientY, tx: transform.x, ty: transform.y }
  }, [transform])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return
    const dx = e.clientX - dragStart.current.mx
    const dy = e.clientY - dragStart.current.my
    setTransform(t => ({ ...t, x: dragStart.current!.tx + dx, y: dragStart.current!.ty + dy }))
  }, [isDragging])

  const onMouseUp = useCallback(() => { setIsDragging(false) }, [])

  // Touch support
  const lastTouch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!lastTouch.current) return
    const dx = e.touches[0].clientX - lastTouch.current.x
    const dy = e.touches[0].clientY - lastTouch.current.y
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }))
  }

  // Click on map to check crater proximity
  const onMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isDragging) return
    const rect = containerRef.current.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    if (!activeOverlays.has('craters')) return
    // Find nearest crater within 3% radius
    let best: Crater | null = null
    let bestDist = 4
    for (const c of CRATERS) {
      const pos = craterToPercent(c.lat, c.lon)
      if (!pos) continue
      const dist = Math.hypot(pos.x - px, pos.y - py)
      if (dist < bestDist) { bestDist = dist; best = c }
    }
    if (best) setSelectedCrater(best)
    else setSelectedCrater(null)
  }, [isDragging, activeOverlays])

  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 })

  return (
    <div className="relative w-full" style={{ height: '100vh' }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
        {/* Title */}
        <div className="flex items-center gap-3">
          <span className="font-serif text-sm font-bold tracking-widest text-primary">MOON MAP</span>
          <span className="hidden sm:block font-sans text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
            Lunar Surface Explorer
          </span>
        </div>

        {/* Overlay toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {OVERLAYS.map(ov => (
            <button
              key={ov.id}
              onClick={() => toggleOverlay(ov.id)}
              title={ov.description}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border font-sans text-[10px] tracking-wide uppercase transition-colors duration-150 whitespace-nowrap ${
                activeOverlays.has(ov.id)
                  ? `${ov.color} bg-background`
                  : 'text-muted-foreground border-border/40 bg-transparent'
              }`}
            >
              <span className="text-xs leading-none" aria-hidden="true">{ov.icon}</span>
              <span className="hidden sm:inline">{ov.label}</span>
            </button>
          ))}
        </div>

        {/* Exit + reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetView}
            className="font-sans text-[10px] tracking-wide uppercase text-muted-foreground hover:text-foreground border border-border/40 px-2.5 py-1 rounded-sm transition-colors duration-150"
            aria-label="Reset map view"
          >
            Reset
          </button>
          {/* Celestial X exit */}
          <Link
            href="/"
            className="flex items-center justify-center w-7 h-7 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-150 font-sans text-sm font-bold"
            aria-label="Exit moon map"
          >
            &times;
          </Link>
        </div>
      </div>

      {/* ── Map canvas ──────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden bg-black select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'crosshair' }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => { lastTouch.current = null }}
        onClick={onMapClick}
      >
        {/* Transform layer */}
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
          }}
        >
          {/* Moon image — NASA LRO WAC Near Side Mosaic (public domain) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg"
            alt="NASA LRO Moon surface mosaic"
            className="w-full h-full object-cover"
            draggable={false}
            crossOrigin="anonymous"
            style={{ display: 'block', minHeight: '100%' }}
          />

          {/* Crater overlay dots */}
          {activeOverlays.has('craters') && CRATERS.map(c => {
            const pos = craterToPercent(c.lat, c.lon)
            if (!pos) return null
            const isSelected = selectedCrater?.id === c.id
            return (
              <button
                key={c.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 20 }}
                onClick={e => { e.stopPropagation(); setSelectedCrater(isSelected ? null : c) }}
                aria-label={`${c.name} crater`}
              >
                <span
                  className="block rounded-full border-2 transition-all duration-150"
                  style={{
                    width:  isSelected ? 14 : 10,
                    height: isSelected ? 14 : 10,
                    background: isSelected ? '#f59e0b' : 'transparent',
                    borderColor: '#f59e0b',
                    boxShadow: isSelected ? '0 0 8px #f59e0b88' : 'none',
                  }}
                />
              </button>
            )
          })}

          {/* Zodiac overlay — placeholder ecliptic band */}
          {activeOverlays.has('zodiac') && (
            <div
              className="absolute left-0 right-0 border border-violet-400/40"
              style={{ top: '47%', height: '6%', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.06), transparent)', pointerEvents: 'none', zIndex: 15 }}
            >
              <span className="absolute right-2 top-0.5 font-sans text-[9px] tracking-widest uppercase text-violet-400/70">Ecliptic</span>
            </div>
          )}

          {/* Constellations overlay — placeholder grid */}
          {activeOverlays.has('constellations') && (
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 14, pointerEvents: 'none' }}>
              {[['18%','22%','35%','40%'],['60%','18%','75%','30%'],['42%','65%','58%','72%'],['20%','58%','30%','50%']].map(([x1,y1,x2,y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf840" strokeWidth="0.8" strokeDasharray="3 4" />
              ))}
              {[['26%','31%'],['67%','24%'],['50%','68%'],['25%','54%']].map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="2.5" fill="#38bdf8" fillOpacity="0.4" />
              ))}
            </svg>
          )}

          {/* Planets overlay — placeholder positions */}
          {activeOverlays.has('planets') && (
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 16, pointerEvents: 'none' }}>
              {[
                { label:'♃', cx:'72%', cy:'44%' },
                { label:'♄', cx:'55%', cy:'38%' },
                { label:'♂', cx:'38%', cy:'51%' },
              ].map(p => (
                <g key={p.label}>
                  <circle cx={p.cx} cy={p.cy} r="6" fill="#fb718520" stroke="#fb7185" strokeWidth="1" />
                  <text x={p.cx} y={p.cy} textAnchor="middle" dominantBaseline="central" fill="#fb7185" fontSize="8" fontFamily="serif">{p.label}</text>
                </g>
              ))}
            </svg>
          )}

          {/* Leader line for selected crater */}
          {selectedCrater && (() => {
            const pos = craterToPercent(selectedCrater.lat, selectedCrater.lon)
            if (!pos) return null
            return (
              <LeaderLine
                x={pos.x}
                y={pos.y}
                crater={selectedCrater}
                onClose={() => setSelectedCrater(null)}
              />
            )
          })()}
        </div>
      </div>

      {/* ── Bottom hint bar ─────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 py-2 bg-background/70 backdrop-blur-sm border-t border-border/30">
        <p className="font-sans text-[10px] text-muted-foreground tracking-wide">
          Scroll to zoom &middot; Drag to pan &middot; Click crater dot for details
        </p>
        <p className="font-sans text-[9px] text-muted-foreground tracking-wide hidden sm:block">
          Imagery: NASA LRO WAC &mdash; Public Domain
        </p>
      </div>

    </div>
  )
}
