import { Link } from 'react-router-dom'

const TOC = [
  {
    name: 'Sorting',
    blurb:
      'Compare-and-swap on a row of bars. Watch elements settle into place.',
    items: [
      { name: 'Bubble sort', complexity: 'O(n²)', to: '/sorting/bubble' },
      {
        name: 'Merge sort',
        complexity: 'O(n log n)',
        to: '/sorting/merge',
      },
      {
        name: 'Quick sort',
        complexity: 'O(n log n) avg',
        to: '/sorting/quick',
      },
    ],
  },
  {
    name: 'Pathfinding',
    blurb:
      'Find a route through a 2-D grid. Draw your own walls; for Dijkstra, paint heavy cells too.',
    items: [
      {
        name: 'Breadth-first search',
        complexity: 'O(V + E)',
        to: '/pathfinding/bfs',
      },
      {
        name: 'Dijkstra',
        complexity: 'O((V + E) log V)',
        to: '/pathfinding/dijkstra',
      },
    ],
  },
  {
    name: 'Trees',
    blurb:
      'A binary search tree, walked three different ways. Same nodes, three different visit orders.',
    items: [{ name: 'BST traversals', complexity: 'O(n)', to: '/trees' }],
  },
]

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <p className="font-sans text-base text-muted max-w-2xl mb-14 leading-relaxed">
        A quiet field guide to classic algorithms — sorted, searched, traversed.
        Step through each one frame-by-frame, like a margin note. Pick an entry
        below.
      </p>

      <section>
        <h2 className="chapter-heading">
          <span>Contents</span>
          <span className="font-mono text-xs text-muted font-normal">
            {TOC.reduce((n, c) => n + c.items.length, 0)} entries · v0.1
          </span>
        </h2>

        <div className="space-y-12">
          {TOC.map((cat) => (
            <div key={cat.name}>
              <h3 className="font-serif text-xl text-ink mb-1">{cat.name}</h3>
              <p className="font-sans text-sm text-muted max-w-xl mb-4">
                {cat.blurb}
              </p>
              <ul className="border-y border-rule divide-y divide-rule">
                {cat.items.map((item) => (
                  <li
                    key={item.to}
                    className="flex items-baseline justify-between py-3"
                  >
                    <Link
                      to={item.to}
                      className="font-sans text-ink hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    <span className="font-mono text-xs text-muted">
                      {item.complexity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
