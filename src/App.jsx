import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import LeadDetailView from './pages/leads/LeadDetailView'
import LeadPipeline from './pages/kanban/LeadPipeline'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <NavBar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pipeline" element={<LeadPipeline />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leads/:id" element={<LeadDetailView />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

