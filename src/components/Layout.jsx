import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div className="min-h-svh flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="border-t border-rule mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-baseline justify-between font-mono text-xs text-muted">
          <span>DSA Field Guide</span>
          <a
            href="https://github.com/Sachinrajawat/dsa-field-guide"
            className="hover:text-ink transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            @Sachinrajawat
          </a>
        </div>
      </footer>
    </div>
  )
}
