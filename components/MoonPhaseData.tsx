import React from 'react';
import MoonPhaseDisplay from './MoonPhaseDisplay';
import { getMoonPhase } from '@/lib/getMoonPhase';

export default async function MoonPhaseData() {
  let data = null;

  try {
    data = await getMoonPhase();
  } catch (error) {
    console.error('Error fetching moon phase data:', error);
  }

  if (!data) {
    return <div className="text-muted-foreground text-sm py-4 text-center">Moon phase data unavailable.</div>;
  }

  return <MoonPhaseDisplay data={data} />;
}
