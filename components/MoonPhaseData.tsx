import React from 'react';
import MoonPhaseDisplay from './MoonPhaseDisplay'; // Adjust the import path as needed

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getMoonPhaseData() {
  const url = `${apiUrl}/api/moon-phase`;
  console.log('Fetching moon phase data from:', url); // Debugging line
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch moon phase data: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching moon phase data:', error);
    return null; // Return null or some default value in case of an error
  }
}

export default async function MoonPhaseData() {
  const data = await getMoonPhaseData();

  if (!data) {
    return <div>Error fetching moon phase data.</div>; // Handle error state
  }

  return <MoonPhaseDisplay data={data} />;
}
