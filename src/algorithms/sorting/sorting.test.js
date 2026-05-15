import { test } from 'node:test'
import assert from 'node:assert/strict'

import { bubbleSort } from './bubbleSort.js'
import { mergeSort } from './mergeSort.js'
import { quickSort } from './quickSort.js'

const CASES = [
  [],
  [1],
  [2, 1],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5],
  [10, 10, 10, 10],
]

function lastArrayOf(steps) {
  if (steps.length === 0) return []
  return steps[steps.length - 1].array
}

for (const [name, fn] of [
  ['bubbleSort', bubbleSort],
  ['mergeSort', mergeSort],
  ['quickSort', quickSort],
]) {
  test(`${name} produces a sorted final array`, () => {
    for (const input of CASES) {
      const expected = [...input].sort((a, b) => a - b)
      const steps = fn(input)
      const actual = lastArrayOf(steps)
      assert.deepEqual(actual, expected, `failed for input ${JSON.stringify(input)}`)
    }
  })

  test(`${name} does not mutate the input`, () => {
    const input = [4, 2, 5, 1, 3]
    const snapshot = [...input]
    fn(input)
    assert.deepEqual(input, snapshot)
  })

  test(`${name} marks every index as sorted in the final step`, () => {
    const input = [9, 7, 5, 3, 1, 2, 4, 6, 8]
    const steps = fn(input)
    const last = steps[steps.length - 1]
    assert.equal(last.type, 'done')
    const sortedSet = new Set(last.sortedIndices)
    for (let i = 0; i < input.length; i++) {
      assert.ok(sortedSet.has(i), `index ${i} missing from sortedIndices`)
    }
  })
}

test('bubbleSort emits at least one step for non-empty input', () => {
  const steps = bubbleSort([3, 1, 2])
  assert.ok(steps.length > 1)
  assert.equal(steps[0].type, 'init')
})
