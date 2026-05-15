import { useMemo, useState } from 'react'

import { bubbleSort, bubbleSortMeta } from '../algorithms/sorting/bubbleSort.js'
import { mergeSort, mergeSortMeta } from '../algorithms/sorting/mergeSort.js'
import { quickSort, quickSortMeta } from '../algorithms/sorting/quickSort.js'

import { usePlayback } from '../hooks/usePlayback.js'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js'
import PlaybackControls from '../components/PlaybackControls.jsx'
import SortVisualizer from '../components/SortVisualizer.jsx'
import StatsBadge from '../components/StatsBadge.jsx'
import { SORTING_FIELDS } from '../components/StatsBadge.fields.js'
import KeyboardHelp from '../components/KeyboardHelp.jsx'

const RUNNERS = [
  { id: 'bubble', meta: bubbleSortMeta, fn: bubbleSort },
  { id: 'merge', meta: mergeSortMeta, fn: mergeSort },
  { id: 'quick', meta: quickSortMeta, fn: quickSort },
]

const PRESETS = [
  { id: 'random', label: 'Random' },
  { id: 'sorted', label: 'Sorted' },
  { id: 'reversed', label: 'Reversed' },
  { id: 'few', label: 'Few unique' },
]

const MAX_VALUE = 100
const MAX_SIZE = 40
const MIN_SIZE = 8

function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function makeArray(size, seed, preset) {
  const r = rng(seed)
  switch (preset) {
    case 'sorted':
      return Array.from({ length: size }, (_, i) =>
        Math.round(3 + (i / Math.max(1, size - 1)) * (MAX_VALUE - 3))
      )
    case 'reversed':
      return Array.from({ length: size }, (_, i) =>
        Math.round(
          3 + ((size - 1 - i) / Math.max(1, size - 1)) * (MAX_VALUE - 3)
        )
      )
    case 'few': {
      const buckets = [20, 45, 70, 95]
      return Array.from(
        { length: size },
        () => buckets[Math.floor(r() * 4)]
      )
    }
    default:
      return Array.from(
        { length: size },
        () => 3 + Math.floor(r() * (MAX_VALUE - 3))
      )
  }
}

// "Race" playback uses the longest step array as the canonical length —
// shorter algorithms simply hold their final frame once they're done.
function useRacePlayback(stepLists) {
  const longest = stepLists.reduce(
    (m, s) => (s.length > m ? s.length : m),
    0
  )
  const synthetic = useMemo(
    // Synthesize a placeholder array purely so usePlayback knows the total.
    () => Array.from({ length: longest }, () => null),
    [longest]
  )
  return usePlayback(synthetic)
}

export default function SortRace() {
  const [size, setSize] = useState(24)
  const [seed, setSeed] = useState(1)
  const [preset, setPreset] = useState('random')

  const input = useMemo(
    () => makeArray(size, seed, preset),
    [size, seed, preset]
  )
  const runs = useMemo(
    () => RUNNERS.map((r) => ({ ...r, steps: r.fn(input) })),
    [input]
  )
  const playback = useRacePlayback(runs.map((r) => r.steps))
  const { showHelp, setShowHelp } = useKeyboardShortcuts(playback, {
    onGenerate: () => setSeed((s) => s + 1),
  })

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 pb-32 lg:pb-8">
      <div className="mb-8 flex items-baseline justify-between border-b border-rule pb-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
            sorting · comparison
          </div>
          <h1 className="font-serif text-3xl text-ink mt-1">Race three sorts</h1>
          <p className="font-sans text-sm text-muted mt-2 max-w-xl">
            Same random input fed to all three algorithms. Step or play to
            watch how the operation counts diverge.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="ink-tag hover:bg-ink hover:text-bg transition-colors hidden sm:inline-flex"
        >
          ? shortcuts
        </button>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
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

        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span>input</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              className={`px-2 py-1 border border-ink transition-colors ${
                p.id === preset
                  ? 'bg-ink text-bg'
                  : 'bg-transparent text-ink hover:bg-ink hover:text-bg'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-rule border border-rule">
        {runs.map((r) => {
          const stepIdx = Math.min(playback.index, r.steps.length - 1)
          const step = r.steps[stepIdx]
          const done = stepIdx >= r.steps.length - 1
          return (
            <div key={r.id} className="bg-surface p-5 flex flex-col">
              <div className="flex items-baseline justify-between mb-3 border-b border-rule pb-2">
                <h2 className="font-serif text-lg text-ink">{r.meta.name}</h2>
                <span
                  className={`font-mono text-[11px] ${
                    done ? 'text-good' : 'text-muted'
                  }`}
                >
                  {done ? 'done' : `${stepIdx + 1} / ${r.steps.length}`}
                </span>
              </div>
              <div className="mb-3 flex justify-between items-center">
                <span className="font-mono text-[11px] text-muted">
                  {r.meta.time}
                </span>
                <StatsBadge
                  steps={r.steps}
                  index={stepIdx}
                  fields={SORTING_FIELDS}
                />
              </div>
              <SortVisualizer step={step} max={MAX_VALUE} />
            </div>
          )
        })}
      </div>

      {/* Desktop playback row */}
      <div className="hidden lg:flex justify-end mt-5">
        <div className="bg-surface border border-rule p-5 w-80">
          <PlaybackControls
            {...playback}
            onGenerate={() => setSeed((s) => s + 1)}
          />
        </div>
      </div>

      {/* Sticky mobile playback bar */}
      <div className="lg:hidden fixed left-0 right-0 bottom-0 border-t border-rule bg-surface px-4 py-3 z-30">
        <PlaybackControls
          {...playback}
          onGenerate={() => setSeed((s) => s + 1)}
        />
      </div>

      <KeyboardHelp open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}
