// BFS on a 4-connected grid. Cells with `wall: true` are impassable.
// Weights are ignored for BFS (it treats every passable cell as cost 1).
//
// Step shape:
//   { type, current?: 'r,c', visited: 'r,c'[], frontier: 'r,c'[], path?: 'r,c'[] }
//
// Coordinates are encoded as "r,c" strings so they're cheap to put in Sets.

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

const key = (r, c) => `${r},${c}`

export function bfs(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const startKey = key(...start)
  const endKey = key(...end)

  const L = { POP: 4, END_CHECK: 5, NEIGHBOR: 7, PUSH: 10 }

  const steps = [
    {
      type: 'init',
      current: null,
      visited: [],
      frontier: [startKey],
      path: null,
      line: -1,
    },
  ]

  const visited = new Set([startKey])
  const visitedOrder = []
  const parent = new Map()
  const queue = [start]
  let found = false

  while (queue.length > 0) {
    const [r, c] = queue.shift()
    const k = key(r, c)
    visitedOrder.push(k)

    steps.push({
      type: 'visit',
      current: k,
      visited: [...visitedOrder],
      frontier: queue.map(([qr, qc]) => key(qr, qc)),
      path: null,
      line: L.POP,
    })

    if (k === endKey) {
      found = true
      break
    }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr
      const nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      if (grid[nr][nc].wall) continue
      const nk = key(nr, nc)
      if (visited.has(nk)) continue
      visited.add(nk)
      parent.set(nk, k)
      queue.push([nr, nc])
    }
  }

  if (found) {
    const path = []
    let cur = endKey
    while (cur && cur !== startKey) {
      path.unshift(cur)
      cur = parent.get(cur)
    }
    path.unshift(startKey)
    steps.push({
      type: 'path',
      current: null,
      visited: [...visitedOrder],
      frontier: [],
      path,
      line: -1,
    })
  } else {
    steps.push({
      type: 'no-path',
      current: null,
      visited: [...visitedOrder],
      frontier: [],
      path: null,
      line: -1,
    })
  }

  return steps
}

// Used by tests + the page to read out the shortest path from final step.
export function shortestPath(grid, start, end) {
  const steps = bfs(grid, start, end)
  const last = steps[steps.length - 1]
  if (last.type !== 'path') return null
  return last.path.map((k) => k.split(',').map(Number))
}

export const bfsMeta = {
  id: 'bfs',
  name: 'Breadth-first search',
  category: 'pathfinding',
  time: 'O(V + E)',
  space: 'O(V)',
  description:
    'Explore neighbors level by level using a FIFO queue. On an unweighted grid, BFS finds a shortest path — measured in number of steps — to every reachable cell.',
  pseudocode: `// BFS shortest-path
queue := [start]
visited := {start}
while queue not empty:
  cell := queue.shift()
  if cell == end: break
  for neighbor in 4-adj(cell):
    if not wall and not visited:
      visited.add(neighbor)
      parent[neighbor] := cell
      queue.push(neighbor)`,
}
