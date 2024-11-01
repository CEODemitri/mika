'use client'

import { useState, useEffect } from 'react'

export default function MoonPhaseDisplay({ data }: { data: any }) {
  const [moonPhase, setMoonPhase] = useState(data.moon.phase_name)
  const [age, setAge] = useState(data.moon.age_days)

  useEffect(() => {
    console.log(data)
    console.log(data.moon.phase_name)
  }, [data])

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="tracking-[0.6em] text-xl md:text-3xl font-bold uppercase text-center hover:animate-bounce">{moonPhase}</h1>
      <h2 className="tracking-[0.6em] text-md md:text-xl uppercase text-center mt-8">{age} Days In Phase</h2>
    </div>
  )
}