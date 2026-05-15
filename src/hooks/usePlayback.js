import { useCallback, useEffect, useRef, useState } from 'react'



// Base interval at 1x speed. Higher speeds divide this.
// 500ms is comfortable for visual scanning at 1x.
const BASE_INTERVAL_MS = 500

/**
 * Generic playback driver. Owns the timer and a step cursor.
 * The hook is algorithm-agnostic: it just walks through any array.
 *
 *   const { step, index, total, isPlaying, speed,
 *           play, pause, stepForward, stepBack, reset, setSpeed } =
 *     usePlayback(steps)
 */
export function usePlayback(steps) {
  const total = steps?.length ?? 0
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const intervalRef = useRef(null)

  // Reset cursor + playing state DURING RENDER whenever the steps array
  // identity changes. Using useState (not useRef) for the snapshot is the
  // pattern documented in the React docs under "Adjusting state on prop
  // changes" — calling setState during render is fine; React discards the
  // in-progress render and re-runs with the new state.
  const [prevSteps, setPrevSteps] = useState(steps)
  if (prevSteps !== steps) {
    setPrevSteps(steps)
    setIndex(0)
    setIsPlaying(false)
  }

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (total === 0) return
    // If we're already at the end, rewind first; otherwise the play button
    // is a no-op and would feel broken.
    setIndex((i) => (i >= total - 1 ? 0 : i))
    setIsPlaying(true)
  }, [total])

  const pause = useCallback(() => setIsPlaying(false), [])

  const stepForward = useCallback(() => {
    setIsPlaying(false)
    setIndex((i) => Math.min(i + 1, Math.max(0, total - 1)))
  }, [total])

  const stepBack = useCallback(() => {
    setIsPlaying(false)
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setIndex(0)
  }, [])

  // Drive the timer when playing.
  useEffect(() => {
    if (!isPlaying) {
      clear()
      return
    }
    const tick = Math.max(40, Math.round(BASE_INTERVAL_MS / speed))
    intervalRef.current = setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= total) {
          // We hit the end: stop on the next microtask to avoid
          // tearing the controlled state.
          queueMicrotask(() => setIsPlaying(false))
          return total - 1
        }
        return i + 1
      })
    }, tick)
    return clear
  }, [isPlaying, speed, total, clear])

  return {
    step: steps?.[index],
    index,
    total,
    isPlaying,
    speed,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
  }
}
