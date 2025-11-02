/**
 * Settings Page - Absolute Minimum Test
 */

console.log('Settings.jsx file loaded')

function Settings() {
  console.log('Settings component function called')
  
  return (
    <div style={{ padding: '80px 20px 20px 20px', backgroundColor: '#0b1020', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#78c8ff', marginBottom: '20px' }}>
        SETTINGS PAGE
      </h1>
      <div style={{ padding: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
        <p style={{ fontSize: '24px', color: '#ffffff', marginBottom: '10px' }}>
          ✅ Settings page is working!
        </p>
        <p style={{ fontSize: '16px', color: '#9ca3af' }}>
          If you see this, the component is rendering correctly.
        </p>
      </div>
    </div>
  )
}

export default Settings
