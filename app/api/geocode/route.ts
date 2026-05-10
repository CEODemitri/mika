import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Query too short.' }, { status: 400 })
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`
    const res = await fetch(url, {
      headers: {
        // Nominatim requires a valid User-Agent identifying the app
        'User-Agent': 'Mika-Astrology/1.0 (mika-astrology-app)',
        'Accept-Language': 'en',
      },
      next: { revalidate: 3600 }, // cache results for 1 hour
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Geocoding service unavailable.' }, { status: 502 })
    }

    const data = await res.json()

    // Shape the response to only what we need
    const results = (data as any[])
      .filter((r) => r.lat && r.lon)
      .slice(0, 5)
      .map((r) => ({
        display_name: r.display_name,
        city:
          r.address?.city ||
          r.address?.town ||
          r.address?.village ||
          r.address?.county ||
          r.address?.state ||
          r.name ||
          '',
        state: r.address?.state || '',
        country: r.address?.country || '',
        country_code: r.address?.country_code?.toUpperCase() || '',
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
      }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error('[v0] Geocode error:', err)
    return NextResponse.json({ error: 'Failed to fetch location.' }, { status: 500 })
  }
}
