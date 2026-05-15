// Dijkstra on a weighted 4-connected grid.
//   cell = { wall: bool, weight: number }
// Walls are impassable; weight is the cost to ENTER that cell.
// Default weight is 1; "heavy" cells use weight 5.
//
// Uses a binary min-heap keyed by tentative distance.
// Step shape mirrors BFS: { type, current, visited, frontier, path }.

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

const key = (r, c) => `${r},${c}`

class MinHeap {
  constructor() {
    this.heap = []
  }
  push(item) {
    this.heap.push(item)
    this._up(this.heap.length - 1)
  }
  pop() {
    if (this.heap.length === 0) return null
    const top = this.heap[0]
    const last = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = last
      this._down(0)
    }
    return top
  }
  size() {
    return this.heap.length
  }
  _up(i) {
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.heap[p][0] <= this.heap[i][0]) break
      ;[this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]]
      i = p
    }
  }
  _down(i) {
    const n = this.heap.length
    for (;;) {
      let s = i
      const l = i * 2 + 1
      const r = i * 2 + 2
      if (l < n && this.heap[l][0] < this.heap[s][0]) s = l
      if (r < n && this.heap[r][0] < this.heap[s][0]) s = r
      if (s === i) break
      ;[this.heap[s], this.heap[i]] = [this.heap[i], this.heap[s]]
      i = s
    }
  }
}

export function dijkstra(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length
  const startKey = key(...start)
  const endKey = key(...end)

  const dist = new Map([[startKey, 0]])
  const parent = new Map()
  const settled = new Set()
  const visitedOrder = []
  const pq = new MinHeap()
  pq.push([0, start])

  const L = { POP: 4, SETTLE: 6, NEIGHBOR: 8, RELAX: 11, PUSH: 14 }

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

  let found = false
  while (pq.size() > 0) {
    const [d, [r, c]] = pq.pop()
    const k = key(r, c)
    if (settled.has(k)) continue
    settled.add(k)
    visitedOrder.push(k)

    const frontier = pq.heap.map(([, [qr, qc]]) => key(qr, qc))
    steps.push({
      type: 'visit',
      current: k,
      visited: [...visitedOrder],
      frontier,
      path: null,
      line: L.SETTLE,
    })

    if (k === endKey) {
      found = true
      break
    }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr
      const nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const cell = grid[nr][nc]
      if (cell.wall) continue
      const nk = key(nr, nc)
      if (settled.has(nk)) continue
      const nd = d + (cell.weight ?? 1)
      if (nd < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, nd)
        parent.set(nk, k)
        pq.push([nd, [nr, nc]])
      }
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
      cost: dist.get(endKey),
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

export const dijkstraMeta = {
  id: 'dijkstra',
  name: 'Dijkstra',
  category: 'pathfinding',
  time: 'O((V + E) log V)',
  space: 'O(V)',
  description:
    'Generalizes BFS to weighted graphs by always settling the next-cheapest unsettled node. Heavy cells (weight 5) reroute the path; walls block it entirely.',
  pseudocode: `// Dijkstra (min-heap)
dist[start] := 0
pq.push((0, start))
while pq not empty:
  (d, cell) := pq.pop()
  if cell settled: continue
  settle(cell)
  if cell == end: break
  for neighbor in 4-adj(cell):
    if wall: continue
    nd := d + weight(neighbor)
    if nd < dist[neighbor]:
      dist[neighbor] := nd
      parent[neighbor] := cell
      pq.push((nd, neighbor))`,
}
