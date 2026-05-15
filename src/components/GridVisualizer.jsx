import { useEffect, useMemo, useRef, useState } from 'react'

// Pathfinding grid. The grid TOPOLOGY (walls + weights + start + end) is
// owned by the page; the playback STEP just paints visit/frontier/path on top.
//
// Wall-drawing is mouse-driven: press → paint, drag → continue painting.
// The brush sets either `wall`, `weight`, or `clear` based on the page's
// active brush mode.

const key = (r, c) => `${r},${c}`

export default function GridVisualizer({
  grid,
  start,
  end,
  step,
  brush = 'wall',
  onPaint,
  disabled = false,
}) {
  const cols = grid[0].length
  const [drawing, setDrawing] = useState(false)
  const lastPainted = useRef(null)

  const visitedSet = useMemo(
    () => new Set(step?.visited ?? []),
    [step?.visited]
  )
  const frontierSet = useMemo(
    () => new Set(step?.frontier ?? []),
    [step?.frontier]
  )
  const pathSet = useMemo(() => new Set(step?.path ?? []), [step?.path])
  const currentKey = step?.current ?? null

  const startKey = key(...start)
  const endKey = key(...end)

  const paintCell = (r, c) => {
    if (disabled) return
    const k = key(r, c)
    if (k === startKey || k === endKey) return
    if (lastPainted.current === k) return
    lastPainted.current = k
    onPaint?.(r, c, brush)
  }

  // Stop drawing if the user releases anywhere on the page.
  useEffect(() => {
    if (!drawing) return
    const stop = () => {
      setDrawing(false)
      lastPainted.current = null
    }
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchend', stop)
    return () => {
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchend', stop)
    }
  }, [drawing])

  return (
    <div
      className="select-none touch-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: 0,
      }}
      role="grid"
      aria-label="Pathfinding grid"
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const k = key(r, c)
          const isStart = k === startKey
          const isEnd = k === endKey
          const isPath = pathSet.has(k)
          const isCurrent = k === currentKey
          const isVisited = visitedSet.has(k)
          const isFrontier = frontierSet.has(k)

          let bg = 'bg-surface'
          if (cell.wall) bg = 'bg-ink'
          else if (cell.weight && cell.weight > 1) bg = 'bg-rule'
          if (isVisited && !isPath) bg = 'bg-good/60'
          if (isFrontier && !isVisited) bg = 'bg-warn/60'
          if (isPath) bg = 'bg-accent'
          if (isCurrent) bg = 'bg-accent'

          return (
            <div
              key={k}
              role="gridcell"
              className={`relative aspect-square border border-rule ${bg} transition-colors duration-150 ${
                disabled ? '' : 'cursor-pointer'
              }`}
              onMouseDown={(e) => {
                e.preventDefault()
                setDrawing(true)
                paintCell(r, c)
              }}
              onMouseEnter={() => {
                if (drawing) paintCell(r, c)
              }}
              onTouchStart={(e) => {
                e.preventDefault()
                setDrawing(true)
                paintCell(r, c)
              }}
            >
              {isStart && (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-ink">
                  S
                </span>
              )}
              {isEnd && (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-ink">
                  E
                </span>
              )}
              {!isStart && !isEnd && cell.weight > 1 && !cell.wall && !isPath && (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-muted">
                  {cell.weight}
                </span>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
