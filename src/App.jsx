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
  console.log('📱 App.jsx: Settings component:', Settings)
  console.log('📱 App.jsx: Dashboard component:', Dashboard)
  
  // Test render of Settings directly
  if (window.location.pathname === '/settings') {
    console.log('📱 App.jsx: Settings route matched!')
  }
  
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
              <Route path="/settings" element={
                <div style={{ padding: '80px 20px 20px 20px', backgroundColor: '#0b1020', minHeight: '100vh', color: 'white' }}>
                  <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#78c8ff' }}>SETTINGS INLINE</h1>
                  <p style={{ fontSize: '24px', color: '#ffffff' }}>✅ Settings working with inline JSX!</p>
                </div>
              } />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/pipeline" element={<LeadPipeline />} />
              {/* Test route */}
              <Route path="/test-settings" element={
                <div style={{ padding: '80px 20px 20px 20px', backgroundColor: '#0b1020', minHeight: '100vh', color: 'white' }}>
                  <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#78c8ff' }}>TEST SETTINGS INLINE</h1>
                  <p style={{ fontSize: '24px', color: '#ffffff' }}>✅ Test Settings working with inline JSX!</p>
                </div>
              } />
            </Routes>
          </ErrorBoundary>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App


