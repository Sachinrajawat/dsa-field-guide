import { useEffect, useState } from 'react'

// Wires keyboard shortcuts to playback. Skips when the user is typing in
// an input/textarea so we don't hijack form fields. Also exposes
// `showHelp` / `setShowHelp` for a `?` overlay.

const TAG_BLOCKLIST = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function useKeyboardShortcuts(playback, { onGenerate } = {}) {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    function handle(e) {
      const t = e.target
      if (t && TAG_BLOCKLIST.has(t.tagName)) return
      if (t && t.isContentEditable) return

      switch (e.key) {
        case ' ': {
          e.preventDefault()
          if (playback.isPlaying) playback.pause()
          else playback.play()
          break
        }
        case 'ArrowRight':
          e.preventDefault()
          playback.stepForward()
          break
        case 'ArrowLeft':
          e.preventDefault()
          playback.stepBack()
          break
        case 'r':
        case 'R':
          playback.reset()
          break
        case 'g':
        case 'G':
          if (onGenerate) onGenerate()
          break
        case '?':
          setShowHelp((v) => !v)
          break
        case 'Escape':
          setShowHelp(false)
          break
        default:
          // Speed digit shortcuts: 1, 2, 4, 8.
          if (['1', '2', '4', '8'].includes(e.key)) {
            playback.setSpeed(Number(e.key))
          }
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [playback, onGenerate])

  return { showHelp, setShowHelp }
}
