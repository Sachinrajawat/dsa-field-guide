// Renders a single sort step. Pure projection — no algorithm logic here.
// CSS transitions on `height` and `background-color` give the animation;
// React just slams in the new snapshot.

const STATE_CLASS = {
  default: 'bg-surface border-ink',
  comparing: 'bg-warn border-ink',
  active: 'bg-accent border-ink',
  pivot: 'bg-accent border-ink',
  sorted: 'bg-good border-ink',
}

export default function SortVisualizer({ step, max }) {
  if (!step) return null
  const {
    array,
    comparing = [],
    active = [],
    sortedIndices = [],
    pivotIndex,
    rangeStart,
    rangeEnd,
  } = step

  const sortedSet = new Set(sortedIndices)
  const compSet = new Set(comparing)
  const activeSet = new Set(active)
  const inRange =
    rangeStart != null && rangeEnd != null
      ? (i) => i >= rangeStart && i <= rangeEnd
      : null

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-end gap-[3px] min-h-[260px]">
        {array.map((value, i) => {
          let state = 'default'
          if (sortedSet.has(i)) state = 'sorted'
          else if (i === pivotIndex) state = 'pivot'
          else if (activeSet.has(i)) state = 'active'
          else if (compSet.has(i)) state = 'comparing'

          const opacity = inRange && !inRange(i) && state === 'default' ? 0.45 : 1
          const h = (value / max) * 100

          return (
            <div
              key={i}
              className={`flex-1 border ${STATE_CLASS[state]} transition-[height,background-color] duration-200 ease-out`}
              style={{ height: `${Math.max(h, 1.5)}%`, opacity }}
              title={String(value)}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] text-muted">
        <Swatch className="bg-surface border border-ink" label="default" />
        <Swatch className="bg-warn border border-ink" label="comparing" />
        <Swatch className="bg-accent border border-ink" label="active / pivot" />
        <Swatch className="bg-good border border-ink" label="sorted" />
      </div>
    </div>
  )
}

function Swatch({ className, label }) {
  return (
    <span className="ink-tag">
      <span className={`inline-block w-2 h-2 mr-1.5 ${className}`} />
      {label}
    </span>
  )
}
