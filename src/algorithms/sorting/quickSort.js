// Quick sort with Lomuto partition. The pivot at each level is the last
// element of the current sub-array; the visualizer marks it specially.

export function quickSort(input) {
  const arr = [...input]
  const n = arr.length
  const sorted = new Set()

  // Pseudocode line indices into quickSortMeta.pseudocode below.
  const L = {
    PARTITION_CALL: 3,
    LOOP: 10,
    IF: 11,
    INNER_SWAP: 13,
    PIVOT_SWAP: 14,
  }

  const steps = [
    {
      type: 'init',
      array: [...arr],
      comparing: [],
      active: [],
      sortedIndices: [],
      line: -1,
    },
  ]

  function partition(lo, hi) {
    const pivotIndex = hi
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      steps.push({
        type: 'compare',
        array: [...arr],
        comparing: [j, pivotIndex],
        active: [],
        pivotIndex,
        sortedIndices: [...sorted],
        line: L.IF,
      })
      if (arr[j] <= arr[pivotIndex]) {
        i++
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          steps.push({
            type: 'swap',
            array: [...arr],
            comparing: [],
            active: [i, j],
            pivotIndex,
            sortedIndices: [...sorted],
            line: L.INNER_SWAP,
          })
        }
      }
    }
    if (i + 1 !== hi) {
      ;[arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]
      steps.push({
        type: 'swap',
        array: [...arr],
        comparing: [],
        active: [i + 1, hi],
        pivotIndex: i + 1,
        sortedIndices: [...sorted],
        line: L.PIVOT_SWAP,
      })
    }
    sorted.add(i + 1)
    steps.push({
      type: 'mark-sorted',
      array: [...arr],
      comparing: [],
      active: [],
      sortedIndices: [...sorted],
      line: L.PARTITION_CALL,
    })
    return i + 1
  }

  function sort(lo, hi) {
    if (lo > hi) return
    if (lo === hi) {
      sorted.add(lo)
      steps.push({
        type: 'mark-sorted',
        array: [...arr],
        comparing: [],
        active: [],
        sortedIndices: [...sorted],
        line: -1,
      })
      return
    }
    const p = partition(lo, hi)
    sort(lo, p - 1)
    sort(p + 1, hi)
  }

  sort(0, n - 1)

  for (let k = 0; k < n; k++) sorted.add(k)
  steps.push({
    type: 'done',
    array: [...arr],
    comparing: [],
    active: [],
    sortedIndices: [...sorted],
    line: -1,
  })

  return steps
}

export const quickSortMeta = {
  id: 'quick',
  name: 'Quick sort',
  category: 'sorting',
  time: 'O(n log n) avg · O(n²) worst',
  space: 'O(log n)',
  description:
    'Pick a pivot, partition the array around it, then recurse on each side. Fast on average and in-place — but pathological pivots make it quadratic.',
  pseudocode: `// quick sort (Lomuto)
function sort(lo, hi):
  if lo >= hi: return
  p := partition(lo, hi)
  sort(lo, p - 1)
  sort(p + 1, hi)

function partition(lo, hi):
  pivot := a[hi]
  i := lo - 1
  for j := lo..hi-1
    if a[j] <= pivot
      i := i + 1
      swap(a[i], a[j])
  swap(a[i+1], a[hi])
  return i + 1`,
}
