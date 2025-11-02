/**
 * NotificationToggle Component
 * Reusable switch component for notifications
 */

import { Bell, BellOff } from 'lucide-react'

export default function NotificationToggle({ value, onChange, disabled = false }) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!value)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-white">
        Notifications
      </label>
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark ${
          value ? 'bg-primary' : 'bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={`${value ? 'Disable' : 'Enable'} notifications`}
        title={disabled ? 'Coming soon' : undefined}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
            value ? 'translate-x-7' : 'translate-x-1'
          }`}
        >
          <span className="flex h-full w-full items-center justify-center">
            {value ? (
              <Bell className="h-4 w-4 text-primary" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
          </span>
        </span>
      </button>
      <span className={`text-sm ${disabled ? 'text-gray-500' : value ? 'text-gray-400' : 'text-gray-500'}`}>
        {value ? 'Enabled' : 'Disabled'}
        {disabled && (
          <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>
        )}
      </span>
    </div>
  )
}

