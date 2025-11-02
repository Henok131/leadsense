import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'
import Analytics from './pages/Analytics'
import NavBar from './components/NavBar'
import LeadPipeline from './pages/kanban/LeadPipeline'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  console.log('📱 App.jsx: Component rendering, current path:', window.location.pathname)
  
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-dark">
          <NavBar />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/pipeline" element={<LeadPipeline />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App


