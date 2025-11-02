/**
 * Settings Page - Ultra Simple Test Version with Error Handling
 */

import { useEffect } from 'react'

export default function Settings() {
  useEffect(() => {
    console.log('✅ Settings component mounted and rendering!')
    return () => {
      console.log('Settings component unmounting')
    }
  }, [])

  try {
    console.log('Settings: About to render JSX')
    return (
      <div className="min-h-screen bg-dark pt-20 pb-8" style={{ backgroundColor: '#0b1020' }}>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-5xl font-extrabold gradient-text mb-8" style={{ color: '#78c8ff' }}>
            Settings Page
          </h1>
          <div className="glass-card p-8" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px'
          }}>
            <p className="text-white text-xl mb-4" style={{ color: '#ffffff', fontSize: '20px' }}>
              ✅ Settings page is working!
            </p>
            <p className="text-gray-300" style={{ color: '#9ca3af' }}>
              This is a test to verify the page renders correctly.
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('❌ Settings component error:', error)
    return (
      <div className="min-h-screen bg-dark pt-20 pb-8" style={{ padding: '40px', backgroundColor: '#0b1020' }}>
        <div style={{ color: 'white' }}>
          <h1>Settings Error</h1>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }
}
