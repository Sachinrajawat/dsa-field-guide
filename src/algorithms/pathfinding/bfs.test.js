import { test } from 'node:test'
import assert from 'node:assert/strict'

import { bfs, shortestPath } from './bfs.js'

// Helper: turn a string grid into the cell-object form expected by bfs().
//   '.' = open, '#' = wall
function parseGrid(rows) {
  return rows.map((row) =>
    row.split('').map((ch) => ({
      wall: ch === '#',
      weight: 1,
    }))
  )
}

test('bfs finds the shortest path on an empty grid', () => {
  const grid = parseGrid(['....', '....', '....'])
  const path = shortestPath(grid, [0, 0], [2, 3])
  assert.ok(path)
  // Manhattan distance + 1 for the inclusive endpoints
  assert.equal(path.length, 6)
  assert.deepEqual(path[0], [0, 0])
  assert.deepEqual(path[path.length - 1], [2, 3])
})

test('bfs routes around walls', () => {
  // A "U-shape" wall forces a detour.
  //   . . . . .
  //   . # # # .
  //   . # S . .
  //   . # . . .
  //   . . . . .
  // Start at (2,2), end at (4,4); the only way out is south.
  const grid = parseGrid(['.....', '.###.', '.#...', '.#...', '.....'])
  const path = shortestPath(grid, [2, 2], [4, 4])
  assert.ok(path)
  for (const [r, c] of path) {
    assert.equal(grid[r][c].wall, false, `path crosses a wall at ${r},${c}`)
  }
  assert.deepEqual(path[0], [2, 2])
  assert.deepEqual(path[path.length - 1], [4, 4])
})

test('bfs returns no path when blocked', () => {
  const grid = parseGrid(['..#..', '..#..', '..#..'])
  const path = shortestPath(grid, [0, 0], [0, 4])
  assert.equal(path, null)
  const steps = bfs(grid, [0, 0], [0, 4])
  assert.equal(steps[steps.length - 1].type, 'no-path')
})

test('bfs first step is init with start in the frontier', () => {
  const grid = parseGrid(['...'])
  const steps = bfs(grid, [0, 0], [0, 2])
  assert.equal(steps[0].type, 'init')
  assert.deepEqual(steps[0].frontier, ['0,0'])
})
