// Bubble sort, returned as an array of step snapshots that the UI
// replays. We capture `array` by VALUE (spread) on each step so the
// renderer can show any historical step without re-running the algorithm.
//
// Step shape:
//   {
//     type:           'init' | 'compare' | 'swap' | 'mark-sorted' | 'done',
//     array:          number[],
//     comparing:      number[],   // indices with the "comparing" highlight
//     active:         number[],   // indices being swapped/written
//     sortedIndices:  number[],   // indices known to be in final position
//   }

export function bubbleSort(input) {
  const arr = [...input]
  const n = arr.length
  const sorted = new Set()

  const steps = [
    {
      type: 'init',
      array: [...arr],
      comparing: [],
      active: [],
      sortedIndices: [],
    },
  ]

  for (let i = 0; i < n - 1; i++) {
    let swappedAny = false
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        array: [...arr],
        comparing: [j, j + 1],
        active: [],
        sortedIndices: [...sorted],
      })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swappedAny = true
        steps.push({
          type: 'swap',
          array: [...arr],
          comparing: [],
          active: [j, j + 1],
          sortedIndices: [...sorted],
        })
      }
    }
    sorted.add(n - i - 1)
    steps.push({
      type: 'mark-sorted',
      array: [...arr],
      comparing: [],
      active: [],
      sortedIndices: [...sorted],
    })
    if (!swappedAny) break
  }

  for (let k = 0; k < n; k++) sorted.add(k)
  steps.push({
    type: 'done',
    array: [...arr],
    comparing: [],
    active: [],
    sortedIndices: [...sorted],
  })

  return steps
}

export const bubbleSortMeta = {
  id: 'bubble',
  name: 'Bubble sort',
  category: 'sorting',
  time: 'O(n²)',
  space: 'O(1)',
  description:
    'Repeatedly swap adjacent elements that are out of order. The largest unsorted value bubbles to the end on each pass. Simple, in-place, and stable — but quadratic.',
  pseudocode: `// bubble sort
for i := 0..n-1
  for j := 0..n-i-2
    if a[j] > a[j+1]
      swap(a[j], a[j+1])`,
}
