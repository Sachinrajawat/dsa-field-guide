// A small BST + the three depth-first traversal orders. The tree is built
// once, then traversal step-arrays are produced from the same root so the
// visualizer can flip between in / pre / post without rebuilding.

let nextId = 0

class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.id = nextId++
  }
}

export function buildBST(values) {
  nextId = 0
  let root = null
  function insert(node, value) {
    if (!node) return new Node(value)
    if (value < node.value) node.left = insert(node.left, value)
    else if (value > node.value) node.right = insert(node.right, value)
    return node
  }
  for (const v of values) root = insert(root, v)
  return root
}

// In-order x positions (counter), depth y positions. For a BST this layout
// guarantees no edges cross — values increase strictly left-to-right.
export function layoutTree(root) {
  if (!root) return { nodes: [], edges: [], width: 0, height: 0 }

  const positions = new Map()
  let counter = 0
  let maxDepth = 0

  function place(node, depth) {
    if (!node) return
    place(node.left, depth + 1)
    positions.set(node.id, { x: counter++, y: depth })
    if (depth > maxDepth) maxDepth = depth
    place(node.right, depth + 1)
  }
  place(root, 0)

  const nodes = []
  const edges = []
  function collect(node) {
    if (!node) return
    const pos = positions.get(node.id)
    nodes.push({ id: node.id, value: node.value, x: pos.x, y: pos.y })
    if (node.left) {
      const lp = positions.get(node.left.id)
      edges.push({ x1: pos.x, y1: pos.y, x2: lp.x, y2: lp.y })
      collect(node.left)
    }
    if (node.right) {
      const rp = positions.get(node.right.id)
      edges.push({ x1: pos.x, y1: pos.y, x2: rp.x, y2: rp.y })
      collect(node.right)
    }
  }
  collect(root)

  return { nodes, edges, width: counter, height: maxDepth + 1 }
}

export function bstTraverse(root, order) {
  const visited = []
  const result = []
  const steps = [{ type: 'init', currentId: null, visited: [], result: [] }]

  function visit(node) {
    visited.push(node.id)
    result.push(node.value)
    steps.push({
      type: 'visit',
      currentId: node.id,
      visited: [...visited],
      result: [...result],
    })
  }

  function dfs(node) {
    if (!node) return
    if (order === 'pre') visit(node)
    dfs(node.left)
    if (order === 'in') visit(node)
    dfs(node.right)
    if (order === 'post') visit(node)
  }
  dfs(root)

  steps.push({
    type: 'done',
    currentId: null,
    visited: [...visited],
    result: [...result],
  })
  return steps
}

export const bstMeta = {
  id: 'bst',
  name: 'BST traversals',
  category: 'tree',
  time: 'O(n)',
  space: 'O(h)',
  description:
    'Walk the binary search tree in three classical orders. In-order yields a sorted sequence; pre-order is useful for serialization; post-order for safe deletion.',
  pseudocode: `// depth-first traversals
function dfs(node):
  if node == null: return
  if order == "pre":  visit(node)
  dfs(node.left)
  if order == "in":   visit(node)
  dfs(node.right)
  if order == "post": visit(node)`,
}
