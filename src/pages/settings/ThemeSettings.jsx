/**
 * ThemeSettings Component
 * Theme and appearance preferences
 */

import { Palette } from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'
import NotificationToggle from '../../components/NotificationToggle'

export default function ThemeSettings({ theme, setTheme, notificationsEnabled, setNotificationsEnabled }) {
  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold gradient-text">Theme & Notifications</h2>
      </div>

      <div className="space-y-6">
        <ThemeToggle value={theme} onChange={setTheme} />
        <NotificationToggle 
          value={notificationsEnabled} 
          onChange={setNotificationsEnabled}
          disabled={true}
        />
      </div>
    </div>
  )
}

