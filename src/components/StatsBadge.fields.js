// Pre-built field lists for StatsBadge so pages don't redeclare them. Lives
// in a separate file from the component so HMR's "fast refresh only
// exports components" rule stays happy.

export const SORTING_FIELDS = [
  { id: 'compares', label: 'compares', types: ['compare'] },
  { id: 'swaps', label: 'swaps', types: ['swap'] },
  { id: 'writes', label: 'writes', types: ['set'] },
]

export const PATHFINDING_FIELDS = [
  { id: 'visited', label: 'visited', types: ['visit'] },
]

export const TREE_FIELDS = [
  { id: 'visits', label: 'visits', types: ['visit'] },
]
