// Modal-style help overlay opened with `?`. Plain Tailwind, click outside
// or press Escape to close.

const ROWS = [
  { keys: ['Space'], action: 'Play / pause' },
  { keys: ['→'], action: 'Step forward' },
  { keys: ['←'], action: 'Step back' },
  { keys: ['R'], action: 'Reset to start' },
  { keys: ['G'], action: 'Generate new input' },
  { keys: ['1', '2', '4', '8'], action: 'Set playback speed' },
  { keys: ['?'], action: 'Toggle this help' },
  { keys: ['Esc'], action: 'Close this help' },
]

export default function KeyboardHelp({ open, onClose }) {
  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-ink/30"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-rule max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between border-b border-rule pb-2 mb-4">
          <h2 className="font-serif text-lg text-ink">Keyboard shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs text-muted hover:text-ink transition-colors"
          >
            close
          </button>
        </div>
        <table className="w-full font-mono text-xs">
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.action} className="align-baseline">
                <td className="py-1.5 pr-4">
                  {row.keys.map((k, i) => (
                    <span key={k}>
                      <kbd className="inline-block min-w-[1.6em] px-1.5 py-0.5 border border-ink text-ink text-center">
                        {k}
                      </kbd>
                      {i < row.keys.length - 1 ? (
                        <span className="text-muted mx-1">/</span>
                      ) : null}
                    </span>
                  ))}
                </td>
                <td className="py-1.5 text-muted">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
