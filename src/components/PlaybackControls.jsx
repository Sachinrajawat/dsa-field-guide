import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'

const SPEEDS = [1, 2, 4, 8]

export default function PlaybackControls({
  isPlaying,
  speed,
  index,
  total,
  play,
  pause,
  stepForward,
  stepBack,
  reset,
  setSpeed,
  onGenerate,
}) {
  const atStart = index === 0
  const atEnd = total === 0 || index >= total - 1

  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2 flex items-baseline justify-between">
        <span>Playback</span>
        <span className="text-ink">
          {Math.min(index + 1, total)} / {total}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <button
          className="ink-btn"
          type="button"
          onClick={stepBack}
          disabled={atStart}
          aria-label="Step back"
          title="Step back"
        >
          <SkipBack size={14} strokeWidth={1.5} />
        </button>

        {isPlaying ? (
          <button
            className="ink-btn"
            type="button"
            onClick={pause}
            aria-label="Pause"
            title="Pause"
          >
            <Pause size={14} strokeWidth={1.5} />
            <span>Pause</span>
          </button>
        ) : (
          <button
            className="ink-btn"
            type="button"
            onClick={play}
            disabled={atEnd}
            aria-label="Play"
            title="Play"
          >
            <Play size={14} strokeWidth={1.5} />
            <span>Play</span>
          </button>
        )}

        <button
          className="ink-btn"
          type="button"
          onClick={stepForward}
          disabled={atEnd}
          aria-label="Step forward"
          title="Step forward"
        >
          <SkipForward size={14} strokeWidth={1.5} />
        </button>

        <button
          className="ink-btn"
          type="button"
          onClick={reset}
          aria-label="Reset"
          title="Reset"
        >
          <RotateCcw size={14} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 font-mono text-xs">
        <span className="text-muted mr-1">speed</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSpeed(s)}
            className={`px-2 py-1 border border-ink transition-colors ${
              s === speed
                ? 'bg-ink text-bg'
                : 'bg-transparent text-ink hover:bg-ink hover:text-bg'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {onGenerate && (
        <button
          type="button"
          onClick={onGenerate}
          className="ink-btn mt-4 w-full justify-center"
        >
          Generate new input
        </button>
      )}
    </div>
  )
}
