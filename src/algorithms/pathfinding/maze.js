// Recursive-backtracker maze. We model the grid as cells where ALL of
// them start as walls; the algorithm carves passages by knocking 2-step
// jumps into the wall set. Jumping by 2 keeps a wall between adjacent
// passage cells, producing the classic perfect maze.
//
// `start` and `end` are guaranteed to be carved (no walls).

function rng(seed) {
  let s = ((seed | 0) * 9301 + 49297) % 233280
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function shuffle(arr, r) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function generateMaze(rows, cols, start, end, seed = Date.now()) {
  const r = rng(seed)
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ wall: true, weight: 1 }))
  )

  function carve(cy, cx) {
    grid[cy][cx].wall = false
    const dirs = shuffle(
      [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2],
      ],
      r
    )
    for (const [dy, dx] of dirs) {
      const ny = cy + dy
      const nx = cx + dx
      if (ny <= 0 || ny >= rows - 1 || nx <= 0 || nx >= cols - 1) continue
      if (!grid[ny][nx].wall) continue
      // Knock down the wall between current and next.
      grid[cy + dy / 2][cx + dx / 2].wall = false
      carve(ny, nx)
    }
  }

  // Start carving from an odd-coord cell so the wall-grid pattern is consistent.
  const sy = 1
  const sx = 1
  carve(sy, sx)

  // Make sure start and end (and the cells one step in) are open so the
  // pathfinder isn't trapped at the entrance/exit.
  const open = (r0, c0) => {
    if (r0 >= 0 && r0 < rows && c0 >= 0 && c0 < cols) {
      grid[r0][c0].wall = false
    }
  }
  open(...start)
  open(start[0], start[1] + 1)
  open(start[0], start[1] - 1)
  open(...end)
  open(end[0], end[1] + 1)
  open(end[0], end[1] - 1)

  return grid
}
