import { Routes, Route, Navigate } from 'react-router-dom'
import TopNav from './components/layout/TopNav.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewRun from './pages/NewRun.jsx'
import Queue from './pages/Queue.jsx'
import History from './pages/History.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewRun />} />
          <Route path="/queue/:batchId" element={<Queue />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
