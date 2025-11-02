import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'
import Analytics from './pages/Analytics'
import NavBar from './components/NavBar'
import LeadPipeline from './pages/kanban/LeadPipeline'
import ErrorBoundary from './components/ErrorBoundary'
import Test from './pages/Test'

// Debug component to see route changes
function RouteDebugger() {
  const location = useLocation()
  
  console.log('🔍 Route Debugger:', {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    key: location.key,
    state: location.state,
  })
  
  return null
}

function App() {
  console.log('📱 App.jsx: Component rendering')
  console.log('📱 App.jsx: Current path:', window.location.pathname)
  console.log('📱 App.jsx: All components loaded:', {
    Landing: !!Landing,
    Dashboard: !!Dashboard,
    Reports: !!Reports,
    Settings: !!Settings,
    Analytics: !!Analytics,
    LeadPipeline: !!LeadPipeline,
    Test: !!Test,
  })
  
  return (
    <ErrorBoundary>
      <Router>
        <RouteDebugger />
        <div className="min-h-screen bg-dark">
          <NavBar />
          <ErrorBoundary>
            <Routes>
              <Route 
                path="/" 
                element={
                  <div>
                    {console.log('✅ Landing route matched')}
                    <Landing />
                  </div>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <div>
                    {console.log('✅ Dashboard route matched')}
                    <Dashboard />
                  </div>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <div>
                    {console.log('✅ Reports route matched')}
                    <Reports />
                  </div>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <div>
                    {console.log('✅ Settings route matched')}
                    <Settings />
                  </div>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <div>
                    {console.log('✅ Analytics route matched')}
                    <Analytics />
                  </div>
                } 
              />
              <Route 
                path="/pipeline" 
                element={
                  <div>
                    {console.log('✅ Pipeline route matched')}
                    <LeadPipeline />
                  </div>
                } 
              />
              <Route 
                path="/test" 
                element={
                  <div>
                    {console.log('✅ Test route matched')}
                    <Test />
                  </div>
                } 
              />
              {/* Catch-all route for debugging */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen bg-dark pt-20 pb-8 px-4">
                    <div className="max-w-7xl mx-auto">
                      <div className="glass-card-premium p-8">
                        <h1 className="text-4xl font-bold text-red-400 mb-4">⚠️ Route Not Found</h1>
                        <p className="text-white mb-4">Path: <code className="bg-black/30 px-2 py-1 rounded">{window.location.pathname}</code></p>
                        <p className="text-gray-400">This catch-all route should never be visible. If you see this, routing is broken.</p>
                        <div className="mt-6 space-y-2 text-gray-300">
                          <p>✅ React Router is working</p>
                          <p>✅ Routes are being matched</p>
                          <p>❌ But the specific route didn't match</p>
                        </div>
                      </div>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </ErrorBoundary>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
