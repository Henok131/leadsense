/**
 * Settings Page
 * User preferences and configuration panel
 * Route: /settings
 */

import { useState, useEffect } from 'react'
import { Save, Settings as SettingsIcon, Palette, Globe, Key, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../../components/ThemeToggle'
import NotificationToggle from '../../components/NotificationToggle'
import { 
  getUserSettings, 
  saveUserSettings, 
  getLanguages, 
  getTimezones,
  detectTimezone,
  getDefaultSettings
} from '../../lib/settings'

export default function Settings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  
  // Settings state
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('UTC')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [apiKeys, setApiKeys] = useState({
    slack: '',
    flowise: '',
    openai: '',
  })

  // Current user ID (for now, using 'admin' as default)
  const userId = 'admin'

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const settings = await getUserSettings(userId)
      
      if (settings) {
        setTheme(settings.theme || 'dark')
        setLanguage(settings.language || 'en')
        setTimezone(settings.timezone || detectTimezone() || 'UTC')
        setNotificationsEnabled(settings.notifications_enabled !== false)
        setApiKeys(settings.api_keys || {
          slack: '',
          flowise: '',
          openai: '',
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      // Use defaults on error
      const defaults = getDefaultSettings()
      setTheme(defaults.theme)
      setLanguage(defaults.language)
      setTimezone(defaults.timezone)
      setNotificationsEnabled(defaults.notifications_enabled)
      setApiKeys(defaults.api_keys)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const success = await saveUserSettings(userId, {
        theme,
        language,
        timezone,
        notifications_enabled: notificationsEnabled,
        api_keys: apiKeys,
      })

      if (success) {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleApiKeyChange = (key, value) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  const languages = getLanguages()
  const timezones = getTimezones()

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 flex items-center gap-3 shadow-lg animate-fadeIn">
          <Save className="w-5 h-5" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-5xl font-extrabold gradient-text tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage your preferences, theme, language, and API keys
        </p>
      </div>

      {/* Theme & Notifications Section */}
      <div className="glass-card-premium p-6 mb-6 animate-fadeInUp">
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

      {/* Language & Timezone Section */}
      <div className="glass-card-premium p-6 mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold gradient-text">Language & Timezone</h2>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-dark text-white">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-dark text-white">
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="glass-card-premium p-6 mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold gradient-text">API Keys</h2>
        </div>

        <div className="space-y-6">
          {/* Slack API Key */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Slack Webhook URL
            </label>
            <input
              type="password"
              value={apiKeys.slack}
              onChange={(e) => handleApiKeyChange('slack', e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Flowise API Key */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Flowise API Key
            </label>
            <input
              type="password"
              value={apiKeys.flowise}
              onChange={(e) => handleApiKeyChange('flowise', e.target.value)}
              placeholder="Enter your Flowise API key"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* OpenAI API Key */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKeys.openai}
              onChange={(e) => handleApiKeyChange('openai', e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200 font-semibold shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}

