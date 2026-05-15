# DSA Field Guide

[![ci](https://github.com/Sachinrajawat/dsa-field-guide/actions/workflows/ci.yml/badge.svg)](https://github.com/Sachinrajawat/dsa-field-guide/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-1A1A1A.svg)](LICENSE)

A quiet, single-page React app that visualizes classic algorithms — sorted,
searched, traversed — with playback controls. Frontend-only.

> Live demo: <https://dsa-field-guide.vercel.app>
> Repo: <https://github.com/Sachinrajawat/dsa-field-guide>

## What's inside

- **Sorting** — Bubble, Merge, Quick, plus a **race mode** that runs all three
  on the same input side-by-side. Bars animate as the array is reordered.
  Includes worst-case input presets (Sorted / Reversed / Few unique) so you
  can show *why* quicksort is O(n²) on already-sorted input.
- **Pathfinding** — BFS and Dijkstra on a 4-connected grid. Click and drag to
  paint walls; for Dijkstra, you can also paint heavy cells (weight 5).
  One-click **maze generator** (recursive backtracker).
- **Trees** — A binary search tree walked in pre-, in-, or post-order.

Each algorithm is a **pure function** that returns an array of step
snapshots; the UI replays the snapshots like a video. That keeps the
algorithms unit-testable and gives you scrubbable step-back / step-forward
playback for free.

### Quality-of-life

- **Pseudocode line highlighting** — the line currently being executed is
  highlighted while playback runs.
- **Live operation counters** — comparisons, swaps, writes, cells visited,
  path length, total cost — derived from the steps array, not stat-tracking
  inside the algorithms.
- **Keyboard shortcuts** — `Space` play/pause, `←/→` step, `R` reset,
  `G` generate, `1/2/4/8` speed, `?` help overlay.
- **Mobile** — pseudocode collapses behind a `<details>`; playback controls
  pin to the bottom.

## Stack

- Vite + React (JS, no TypeScript)
- TailwindCSS 3 with a custom palette and three Google fonts
- `react-router-dom` for routing, `lucide-react` for icons
- Native CSS transitions for animation — no Framer Motion or other
  animation libraries
- `node:test` for unit tests — no Jest

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle in /dist
npm run preview      # serve the production bundle
npm test             # node:test runs the algorithm unit tests
npm run lint
```

## Folder layout

```
src/
  algorithms/
    sorting/      bubbleSort, mergeSort, quickSort
    pathfinding/  bfs, dijkstra, maze
    tree/         bstTraversals
  components/     SortVisualizer, GridVisualizer, TreeVisualizer,
                  PlaybackControls, AlgorithmInfo, PseudocodePanel,
                  StatsBadge, KeyboardHelp, AlgorithmPage,
                  Navbar, Layout
  hooks/          usePlayback, useKeyboardShortcuts
  pages/          Home, Sorting, SortRace, Pathfinding, Trees
  App.jsx, main.jsx
```

## Architecture in one paragraph

Each algorithm is a pure function `(input) → Step[]`. A step is a snapshot
of everything the visualizer needs to render that moment — for sorting, the
full array plus which indices are being compared/swapped/marked-sorted, plus
a `line` field pointing into the algorithm's pseudocode. The `usePlayback`
hook owns a step cursor and a timer; visualizer components are pure
projections of `step`. CSS transitions on `height` and `background-color`
do all the animation; React just slams in the new snapshot. Operation
counts are derived by scanning `steps[0..index]` — algorithms don't track
stats themselves.

## Deploy

The app is a plain Vite SPA. The bundled `vercel.json` adds a
`source: /(.*) → destination: /` rewrite so deep links like
`/sorting/quick` resolve correctly.

```bash
npx vercel
```

## License

MIT — see [LICENSE](LICENSE).
