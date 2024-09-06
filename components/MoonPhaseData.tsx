import MoonPhaseDisplay from './MoonPhaseDisplay'

async function getMoonPhaseData() {
  const res = await fetch('http://localhost:3000/api/moon-phase', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch moon phase data')
  }
  return res.json()
}

export default async function MoonPhaseData() {
  const data = await getMoonPhaseData()

  return <MoonPhaseDisplay data={data} />
}