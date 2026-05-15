import { useMemo, useState } from 'react'

import {
  buildBST,
  bstTraverse,
  bstMeta,
} from '../algorithms/tree/bstTraversals.js'

import { usePlayback } from '../hooks/usePlayback.js'
import AlgorithmPage from '../components/AlgorithmPage.jsx'
import TreeVisualizer from '../components/TreeVisualizer.jsx'
import StatsBadge from '../components/StatsBadge.jsx'
import { TREE_FIELDS } from '../components/StatsBadge.fields.js'

const ORDERS = [
  { id: 'in', label: 'In-order' },
  { id: 'pre', label: 'Pre-order' },
  { id: 'post', label: 'Post-order' },
]

function makeValues(seed) {
  // A modest set of values that produces a reasonably balanced BST.
  const base = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 65, 75, 90]
  // Shuffle by seed so users can regenerate.
  const out = base.slice()
  let s = (seed * 9301 + 49297) % 233280
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function Trees() {
  const [seed, setSeed] = useState(1)
  const [order, setOrder] = useState('in')

  const values = useMemo(() => makeValues(seed), [seed])
  const root = useMemo(() => buildBST(values), [values])
  const steps = useMemo(() => bstTraverse(root, order), [root, order])
  const playback = usePlayback(steps)

  return (
    <AlgorithmPage
      meta={bstMeta}
      playback={playback}
      onGenerate={() => setSeed((s) => s + 1)}
      topToolbar={
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span className="mr-1">traversal</span>
          {ORDERS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOrder(o.id)}
              className={`px-2 py-1 border border-ink transition-colors ${
                o.id === order
                  ? 'bg-ink text-bg'
                  : 'bg-transparent text-ink hover:bg-ink hover:text-bg'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-3 flex justify-end">
        <StatsBadge
          steps={steps}
          index={playback.index}
          fields={TREE_FIELDS}
        />
      </div>
      <TreeVisualizer root={root} step={playback.step} />
    </AlgorithmPage>
  )
}
