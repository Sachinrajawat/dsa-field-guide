// Merge sort: top-down, with an auxiliary array. We emit a step for each
// write into the main array during merge so the user can see the merge
// happen position-by-position, plus a "range" step when entering a merge
// so the active sub-array is highlighted.
//
// Step shape (same superset as bubbleSort, plus rangeStart/rangeEnd):
//   { type, array, comparing, active, sortedIndices, rangeStart?, rangeEnd? }

export function mergeSort(input) {
  const arr = [...input]
  const aux = [...arr]
  const sorted = new Set()

  const L = { GUARD: 2, MID: 3, LEFT: 4, RIGHT: 5, MERGE: 6 }

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

  function merge(lo, mid, hi) {
    for (let k = lo; k <= hi; k++) aux[k] = arr[k]

    let i = lo
    let j = mid + 1
    for (let k = lo; k <= hi; k++) {
      let chosen
      if (i > mid) chosen = aux[j++]
      else if (j > hi) chosen = aux[i++]
      else if (aux[j] < aux[i]) chosen = aux[j++]
      else chosen = aux[i++]
      arr[k] = chosen
      steps.push({
        type: 'set',
        array: [...arr],
        comparing: [],
        active: [k],
        sortedIndices: [...sorted],
        rangeStart: lo,
        rangeEnd: hi,
        line: L.MERGE,
      })
    }
  }

  function sort(lo, hi) {
    if (lo >= hi) return
    const mid = Math.floor((lo + hi) / 2)
    sort(lo, mid)
    sort(mid + 1, hi)
    steps.push({
      type: 'compare',
      array: [...arr],
      comparing: [],
      active: [],
      sortedIndices: [...sorted],
      rangeStart: lo,
      rangeEnd: hi,
      line: L.MERGE,
    })
    merge(lo, mid, hi)
    if (lo === 0 && hi === arr.length - 1) {
      for (let k = 0; k < arr.length; k++) sorted.add(k)
      steps.push({
        type: 'mark-sorted',
        array: [...arr],
        comparing: [],
        active: [],
        sortedIndices: [...sorted],
        line: -1,
      })
    }
  }

  sort(0, arr.length - 1)

  steps.push({
    type: 'done',
    array: [...arr],
    comparing: [],
    active: [],
    sortedIndices: arr.map((_, i) => i),
    line: -1,
  })

  return steps
}

export const mergeSortMeta = {
  id: 'merge',
  name: 'Merge sort',
  category: 'sorting',
  time: 'O(n log n)',
  space: 'O(n)',
  description:
    'Divide the array in halves, sort each recursively, then merge the two sorted halves into one. Stable and predictably fast — even on adversarial inputs.',
  pseudocode: `// merge sort
function sort(lo, hi):
  if lo >= hi: return
  mid := (lo + hi) / 2
  sort(lo, mid)
  sort(mid + 1, hi)
  merge(lo, mid, hi)`,
}
