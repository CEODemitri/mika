export default function MoonPhaseDisplay({ data }: { data: any }) {
  const moonPhase: string = data?.moon?.phase_name ?? 'Unknown'
  const age: string | number = data?.moon?.age_days ?? '—'

  return (
    <div className="py-6 text-center">
      <p className="font-sans tracking-[0.6em] text-xs uppercase text-muted-foreground mb-3">
        Current Moon Phase
      </p>
      <h2 className="font-serif tracking-[0.3em] text-2xl md:text-4xl font-bold uppercase text-foreground">
        {moonPhase}
      </h2>
      <p className="font-sans tracking-[0.4em] text-sm uppercase text-primary mt-4">
        {age} Days In Phase
      </p>
    </div>
  )
}
