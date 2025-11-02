/**
 * NotificationSettings Component
 * Email and notification preferences
 */

import { Bell, Mail } from 'lucide-react'
import NotificationToggle from '../../components/NotificationToggle'

export default function NotificationSettings({ notificationsSettings, setNotificationsSettings }) {
  const handleToggle = (key) => {
    setNotificationsSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold gradient-text">Email & Notifications</h2>
      </div>

      <div className="space-y-4">
        {/* Weekly Reports */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Weekly Reports
            </label>
            <p className="text-xs text-gray-400">Receive weekly summary emails</p>
          </div>
          <NotificationToggle
            value={notificationsSettings.weekly}
            onChange={() => handleToggle('weekly')}
          />
        </div>

        {/* Task Reminders */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Task Reminders
            </label>
            <p className="text-xs text-gray-400">Get reminded about pending tasks</p>
          </div>
          <NotificationToggle
            value={notificationsSettings.reminders}
            onChange={() => handleToggle('reminders')}
          />
        </div>

        {/* AI Summary Emails */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              AI Summary Emails
            </label>
            <p className="text-xs text-gray-400">Receive AI-generated insights</p>
          </div>
          <NotificationToggle
            value={notificationsSettings.summaries}
            onChange={() => handleToggle('summaries')}
          />
        </div>
      </div>
    </div>
  )
}

