import { Link, NavLink } from 'react-router-dom'

const NAV = [
  { to: '/sorting/bubble', label: 'Sorting' },
  { to: '/pathfinding/bfs', label: 'Pathfinding' },
  { to: '/trees', label: 'Trees' },
]

export default function Navbar() {
  return (
    <header className="border-b border-rule bg-bg sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-baseline justify-between gap-6">
        <Link
          to="/"
          className="font-serif italic text-xl text-ink leading-none hover:text-accent transition-colors"
        >
          DSA Field Guide
        </Link>
        <nav className="flex items-baseline gap-5 font-sans text-sm">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? 'text-ink border-b border-ink'
                    : 'text-muted hover:text-ink'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
