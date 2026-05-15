import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Sorting from './pages/Sorting.jsx'
import SortRace from './pages/SortRace.jsx'
import Pathfinding from './pages/Pathfinding.jsx'
import Trees from './pages/Trees.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sorting" element={<Navigate to="/sorting/bubble" replace />} />
          <Route path="/sorting/race" element={<SortRace />} />
          <Route path="/sorting/:algo" element={<Sorting />} />
          <Route
            path="/pathfinding"
            element={<Navigate to="/pathfinding/bfs" replace />}
          />
          <Route path="/pathfinding/:algo" element={<Pathfinding />} />
          <Route path="/trees" element={<Trees />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
