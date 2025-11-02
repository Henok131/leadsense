import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Main.jsx: Starting React app...')
console.log('🚀 Root element:', document.getElementById('root'))

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found!')
  }
  
  const root = ReactDOM.createRoot(rootElement)
  console.log('🚀 React root created successfully')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  
  console.log('🚀 React app rendered')
} catch (error) {
  console.error('❌ Failed to render React app:', error)
  document.body.innerHTML = `
    <div style="padding: 20px; color: white; background: #0b1020; min-height: 100vh;">
      <h1>Error Loading App</h1>
      <p>${error.message}</p>
      <pre style="background: #1a1a1a; padding: 10px; border-radius: 5px;">${error.stack}</pre>
    </div>
  `
}


