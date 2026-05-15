import { useMemo } from 'react'
import { layoutTree } from '../algorithms/tree/bstTraversals.js'

const NODE_R = 18
const X_GAP = 46
const Y_GAP = 70
const PAD = 28

export default function TreeVisualizer({ root, step }) {
  const layout = useMemo(() => layoutTree(root), [root])

  const visitedSet = new Set(step?.visited ?? [])
  const currentId = step?.currentId ?? null

  const widthPx = layout.width * X_GAP + PAD * 2
  const heightPx = layout.height * Y_GAP + PAD * 2

  const toPx = (n) => ({
    x: n.x * X_GAP + PAD,
    y: n.y * Y_GAP + PAD,
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${widthPx} ${heightPx}`}
          width={widthPx}
          height={heightPx}
          className="max-w-full"
          role="img"
          aria-label="Binary search tree"
        >
          {/* Edges first so nodes draw over them */}
          {layout.edges.map((e, i) => {
            const x1 = e.x1 * X_GAP + PAD
            const y1 = e.y1 * Y_GAP + PAD
            const x2 = e.x2 * X_GAP + PAD
            const y2 = e.y2 * Y_GAP + PAD
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#1A1A1A"
                strokeWidth="1"
              />
            )
          })}

          {layout.nodes.map((n) => {
            const { x, y } = toPx(n)
            const isCurrent = n.id === currentId
            const isVisited = visitedSet.has(n.id)
            const fill = isCurrent
              ? '#A8412B'
              : isVisited
                ? '#4A6B3A'
                : '#FBF9F4'
            const textFill =
              isCurrent || isVisited ? '#FBF9F4' : '#1A1A1A'
            return (
              <g
                key={n.id}
                style={{ transition: 'fill 200ms ease-out' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_R}
                  fill={fill}
                  stroke="#1A1A1A"
                  strokeWidth="1.25"
                  style={{ transition: 'fill 200ms ease-out' }}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, IBM Plex Mono, monospace"
                  fontSize="12"
                  fill={textFill}
                >
                  {n.value}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Visit-order strip */}
      <div className="mt-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
          Visit order
        </div>
        <div className="font-mono text-sm text-ink min-h-[1.5em] break-words">
          {step?.result?.length ? step.result.join(', ') : '—'}
        </div>
      </div>
    </div>
  )
}
