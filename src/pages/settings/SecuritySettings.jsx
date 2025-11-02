/**
 * SecuritySettings Component
 * Security preferences and login metadata
 */

import { Shield, Lock, Clock, LogIn, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import NotificationToggle from '../../components/NotificationToggle'

export default function SecuritySettings({ sessionTimeout, setSessionTimeout, twoFactorEnabled, setTwoFactorEnabled }) {
  const [ipAddress, setIpAddress] = useState('Loading...')
  const [lastLogin, setLastLogin] = useState('Never')
  const [deviceInfo, setDeviceInfo] = useState('Unknown')

  useEffect(() => {
    // Fetch IP address
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress('Unable to fetch'))

    // Get device info from navigator
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    const device = `${platform} - ${userAgent.split(' ')[0]}`
    setDeviceInfo(device)

    // Get last login from localStorage (or Supabase in future)
    const lastLoginStr = localStorage.getItem('lastLogin')
    if (lastLoginStr) {
      setLastLogin(new Date(lastLoginStr).toLocaleString())
    }
  }, [])

  const SESSION_TIMEOUTS = [
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '1 hour' },
    { value: 7200, label: '2 hours' },
    { value: 86400, label: '24 hours' },
  ]

  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold gradient-text">Security</h2>
      </div>

      <div className="space-y-6">
        {/* 2FA Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Two-Factor Authentication (2FA)
            </label>
            <p className="text-xs text-gray-400">Coming soon</p>
          </div>
          <NotificationToggle
            value={twoFactorEnabled}
            onChange={setTwoFactorEnabled}
            disabled={true}
          />
        </div>

        {/* Session Timeout */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Session Timeout
          </label>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {SESSION_TIMEOUTS.map((timeout) => (
                <option key={timeout.value} value={timeout.value} className="bg-dark text-white">
                  {timeout.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Login Metadata */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Login Information</h3>
          
          {/* Last Login */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <LogIn className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Last Login</p>
              <p className="text-sm text-white">{lastLogin}</p>
            </div>
          </div>

          {/* IP Address */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">IP Address</p>
              <p className="text-sm text-white">{ipAddress}</p>
            </div>
          </div>

          {/* Device Info */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Device</p>
              <p className="text-sm text-white truncate">{deviceInfo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

