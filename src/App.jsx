import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'
import Analytics from './pages/Analytics'
import NavBar from './components/NavBar'
import LeadPipeline from './pages/kanban/LeadPipeline'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/pipeline" element={<LeadPipeline />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


