// Small mono badges showing live operation counts. The counts are derived
// from the steps array — we walk steps[0..index] and tally the step types
// the caller asks about. Keeping it derivation-only means algorithms don't
// need to track stats themselves.

import { useMemo } from 'react'

export default function StatsBadge({ steps, index, fields }) {
  const counts = useMemo(() => {
    const c = Object.fromEntries(fields.map((f) => [f.id, 0]))
    if (!steps) return c
    const stop = Math.min(index + 1, steps.length)
    for (let i = 0; i < stop; i++) {
      const t = steps[i].type
      for (const f of fields) {
        if (f.types.includes(t)) c[f.id]++
      }
    }
    return c
  }, [steps, index, fields])

  return (
    <div className="flex flex-wrap gap-2 font-mono text-xs">
      {fields.map((f) => (
        <span
          key={f.id}
          className="ink-tag tabular-nums"
          title={f.title ?? f.label}
        >
          <span className="text-muted mr-1.5">{f.label}</span>
          <span className="text-ink">{counts[f.id]}</span>
        </span>
      ))}
    </div>
  )
}

