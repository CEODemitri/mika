9 16
Unhandled Runtime Error

Error: Failed to parse URL from mika-sigma.vercel.app/api/moon-phase

Source
components/MoonPhaseData.tsx (6:21) @ fetch
4 |
5 | async function getMoonPhaseData() {

> 6 | const res = await fetch(`${apiUrl}/api/moon-phase`, { cache: 'no-store' });

    |                     ^

7 | if (!res.ok) {
8 | throw new Error('Failed to fetch moon phase data')
