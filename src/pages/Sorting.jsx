import { useMemo, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'

import { bubbleSort, bubbleSortMeta } from '../algorithms/sorting/bubbleSort.js'
import { mergeSort, mergeSortMeta } from '../algorithms/sorting/mergeSort.js'
import { quickSort, quickSortMeta } from '../algorithms/sorting/quickSort.js'

import { usePlayback } from '../hooks/usePlayback.js'
import AlgorithmPage from '../components/AlgorithmPage.jsx'
import SortVisualizer from '../components/SortVisualizer.jsx'

const ALGOS = {
  bubble: { fn: bubbleSort, meta: bubbleSortMeta },
  merge: { fn: mergeSort, meta: mergeSortMeta },
  quick: { fn: quickSort, meta: quickSortMeta },
}

const VARIANT_LINKS = [
  { id: 'bubble', label: 'Bubble' },
  { id: 'merge', label: 'Merge' },
  { id: 'quick', label: 'Quick' },
]

const MAX_VALUE = 100
const MAX_SIZE = 50
const MIN_SIZE = 5

function makeArray(size, seed) {
  // Deterministic pseudo-random so refresh doesn't churn unrelated state.
  let s = (seed * 9301 + 49297) % 233280
  const out = []
  for (let i = 0; i < size; i++) {
    s = (s * 9301 + 49297) % 233280
    out.push(3 + Math.floor((s / 233280) * (MAX_VALUE - 3)))
  }
  return out
}

export default function Sorting() {
  const { algo } = useParams()
  const navigate = useNavigate()
  const algorithm = ALGOS[algo]

  const [size, setSize] = useState(20)
  const [seed, setSeed] = useState(1)

  const input = useMemo(() => makeArray(size, seed), [size, seed])
  const steps = useMemo(
    () => (algorithm ? algorithm.fn(input) : []),
    [algorithm, input]
  )
  const playback = usePlayback(steps)

  if (!algorithm) return <Navigate to="/sorting/bubble" replace />

  return (
    <AlgorithmPage
      meta={algorithm.meta}
      playback={playback}
      onGenerate={() => setSeed((s) => s + 1)}
      topToolbar={
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span>variant</span>
            {VARIANT_LINKS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => navigate(`/sorting/${v.id}`)}
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

          <label className="flex items-center gap-3 font-mono text-xs text-muted">
            <span>size</span>
            <input
              type="range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="accent-ink w-44"
            />
            <span className="text-ink w-6 text-right">{size}</span>
          </label>
        </div>
      }
    >
      <SortVisualizer step={playback.step} max={MAX_VALUE} />
    </AlgorithmPage>
  )
}
