import PseudocodePanel from './PseudocodePanel.jsx'
import AlgorithmInfo from './AlgorithmInfo.jsx'
import PlaybackControls from './PlaybackControls.jsx'
import KeyboardHelp from './KeyboardHelp.jsx'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js'

// Shared three-column layout used by every algorithm page.
//
//   [left]   pseudocode
//   [center] visualization (children)
//   [right]  info + playback controls
//
// On viewports < lg we collapse to a single column and pin the controls
// to the bottom of the screen so the user can always reach them.

export default function AlgorithmPage({
  meta,
  playback,
  onGenerate,
  topToolbar = null,
  children,
}) {
  const { showHelp, setShowHelp } = useKeyboardShortcuts(playback, {
    onGenerate,
  })

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 pb-32 lg:pb-8">
      {/* Page title — like a chapter header */}
      <div className="mb-8 flex items-baseline justify-between border-b border-rule pb-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {meta.category}
          </div>
          <h1 className="font-serif text-3xl text-ink mt-1">{meta.name}</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted">
          <span className="ink-tag">time {meta.time}</span>
          <span className="ink-tag">space {meta.space}</span>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="ink-tag hover:bg-ink hover:text-bg transition-colors"
            title="Keyboard shortcuts"
          >
            ? shortcuts
          </button>
        </div>
      </div>

      {topToolbar && <div className="mb-5">{topToolbar}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[15rem_1fr_18rem] gap-px bg-rule border border-rule">
        <div className="hidden lg:block">
          <PseudocodePanel
            code={meta.pseudocode}
            activeLine={playback.step?.line ?? -1}
          />
        </div>

        <div className="bg-surface p-5 sm:p-6 min-h-[360px] flex flex-col">
          {children}
        </div>

        <div className="bg-surface p-5 hidden lg:flex flex-col gap-6">
          <AlgorithmInfo meta={meta} />
          <PlaybackControls {...playback} onGenerate={onGenerate} />
        </div>
      </div>

      {/* Mobile: pseudocode below, info inline; controls pinned to bottom. */}
      <div className="lg:hidden mt-px border-x border-b border-rule bg-surface p-5">
        <AlgorithmInfo meta={meta} />
      </div>
      <details className="lg:hidden mt-px border-x border-b border-rule bg-surface">
        <summary className="cursor-pointer p-5 font-mono text-[11px] uppercase tracking-wider text-muted select-none">
          Pseudocode
        </summary>
        <div className="border-t border-rule">
          <PseudocodePanel
            code={meta.pseudocode}
            activeLine={playback.step?.line ?? -1}
          />
        </div>
      </details>

      {/* Sticky mobile playback bar */}
      <div className="lg:hidden fixed left-0 right-0 bottom-0 border-t border-rule bg-surface px-4 py-3 z-30">
        <PlaybackControls {...playback} onGenerate={onGenerate} />
      </div>

      <KeyboardHelp open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}
