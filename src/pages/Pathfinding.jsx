import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'

import { bfs, bfsMeta } from '../algorithms/pathfinding/bfs.js'
import { dijkstra, dijkstraMeta } from '../algorithms/pathfinding/dijkstra.js'

import { usePlayback } from '../hooks/usePlayback.js'
import AlgorithmPage from '../components/AlgorithmPage.jsx'
import GridVisualizer from '../components/GridVisualizer.jsx'

const ROWS = 14
const COLS = 22

const ALGOS = {
  bfs: { fn: bfs, meta: bfsMeta, supportsWeight: false },
  dijkstra: { fn: dijkstra, meta: dijkstraMeta, supportsWeight: true },
}

const VARIANT_LINKS = [
  { id: 'bfs', label: 'BFS' },
  { id: 'dijkstra', label: 'Dijkstra' },
]

const START = [Math.floor(ROWS / 2), 2]
const END = [Math.floor(ROWS / 2), COLS - 3]

function emptyGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ wall: false, weight: 1 }))
  )
}

export default function Pathfinding() {
  const { algo } = useParams()
  const navigate = useNavigate()
  const algorithm = ALGOS[algo]

  const [grid, setGrid] = useState(emptyGrid)
  const [brush, setBrush] = useState('wall')

  const steps = useMemo(
    () => (algorithm ? algorithm.fn(grid, START, END) : []),
    [algorithm, grid]
  )
  const playback = usePlayback(steps)

  const paint = useCallback((r, c, b) => {
    setGrid((prev) => {
      const next = prev.map((row) => row.slice())
      const cell = next[r][c]
      if (b === 'wall') {
        next[r][c] = { wall: !cell.wall, weight: cell.wall ? cell.weight : 1 }
      } else if (b === 'weight') {
        if (cell.wall) return prev
        next[r][c] = { wall: false, weight: cell.weight > 1 ? 1 : 5 }
      } else {
        next[r][c] = { wall: false, weight: 1 }
      }
      return next
    })
  }, [])

  if (!algorithm) return <Navigate to="/pathfinding/bfs" replace />

  const brushOptions = algorithm.supportsWeight
    ? ['wall', 'weight', 'clear']
    : ['wall', 'clear']

  return (
    <AlgorithmPage
      meta={algorithm.meta}
      playback={playback}
      onGenerate={() => setGrid(emptyGrid())}
      topToolbar={
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span>variant</span>
            {VARIANT_LINKS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => navigate(`/pathfinding/${v.id}`)}
                className={`px-2 py-1 border border-ink transition-colors ${
                  v.id === algo
                    ? 'bg-ink text-bg'
                    : 'bg-transparent text-ink hover:bg-ink hover:text-bg'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span>brush</span>
            {brushOptions.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBrush(b)}
                className={`px-2 py-1 border border-ink transition-colors ${
                  brush === b
                    ? 'bg-ink text-bg'
                    : 'bg-transparent text-ink hover:bg-ink hover:text-bg'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <p className="font-mono text-[11px] text-muted">
            click + drag to paint walls{algorithm.supportsWeight ? ' or weights' : ''}
          </p>
        </div>
      }
    >
      <GridVisualizer
        grid={grid}
        start={START}
        end={END}
        step={playback.step}
        brush={brush}
        onPaint={paint}
        disabled={playback.isPlaying}
      />

      <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] text-muted">
        <Swatch className="bg-surface border border-ink" label="open" />
        <Swatch className="bg-warn/60 border border-ink" label="frontier" />
        <Swatch className="bg-good/60 border border-ink" label="visited" />
        <Swatch className="bg-accent border border-ink" label="path" />
        <Swatch className="bg-ink border border-ink" label="wall" />
        {algorithm.supportsWeight && (
          <Swatch className="bg-rule border border-ink" label="weight 5" />
        )}
      </div>
    </AlgorithmPage>
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
