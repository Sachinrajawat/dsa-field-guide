# DSA Field Guide

A quiet, single-page React app that visualizes classic algorithms — sorted,
searched, traversed — with playback controls. Frontend-only.

> Live demo: <https://dsa-field-guide.vercel.app>
> Repo: <https://github.com/Sachinrajawat/dsa-field-guide>

## What's inside

- **Sorting** — Bubble, Merge, Quick. Bars animate as the array is reordered.
- **Pathfinding** — BFS and Dijkstra on a 4-connected grid. Click and drag to
  paint walls; for Dijkstra, you can also paint heavy cells (weight 5).
- **Trees** — A binary search tree walked in pre-, in-, or post-order.

Each algorithm is a **pure function** that returns an array of step
snapshots; the UI replays the snapshots like a video. That keeps the
algorithms unit-testable and gives you scrubbable step-back / step-forward
playback for free.

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
    sorting/      bubbleSort.js, mergeSort.js, quickSort.js
    pathfinding/  bfs.js, dijkstra.js
    tree/         bstTraversals.js
  components/     SortVisualizer, GridVisualizer, TreeVisualizer,
                  PlaybackControls, AlgorithmInfo, PseudocodePanel,
                  AlgorithmPage, Navbar, Layout
  hooks/          usePlayback.js
  pages/          Home, Sorting, Pathfinding, Trees
  App.jsx, main.jsx
```

## Deploy

The app is a plain Vite SPA, so any static host works. For Vercel:

```bash
npx vercel
```

…and let it pick up the `vite` framework preset. No environment variables
are required.
