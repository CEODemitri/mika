import MoonPhaseDisplay from './MoonPhaseDisplay'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getMoonPhaseData() {
  const res = await fetch(`${apiUrl}/api/moon-phase`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch moon phase data')
  }
  return res.json()
}

export default async function MoonPhaseData() {
  const data = await getMoonPhaseData()

  return <MoonPhaseDisplay data={data} />
};