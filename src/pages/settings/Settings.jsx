/**
 * Settings Page
 * User settings with tabs for Theme, Language, API Keys, Billing, AI Preferences, Notifications, and Security
 */

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, CheckCircle } from 'lucide-react'
import ThemeSettings from './ThemeSettings'
import LanguageSettings from './LanguageSettings'
import APIKeySettings from './APIKeySettings'
import BillingSettings from './BillingSettings'
import AIPreferences from './AIPreferences'
import NotificationSettings from './NotificationSettings'
import SecuritySettings from './SecuritySettings'
import { getDefaultSettings } from '../../lib/settings'

const TABS = [
  { id: 'theme', label: 'Theme', icon: '🎨' },
  { id: 'language', label: 'Language', icon: '🌍' },
  { id: 'api', label: 'API Keys', icon: '🔑' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'ai', label: 'AI Preferences', icon: '✨' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'security', label: 'Security', icon: '🛡️' },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('theme')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('leadSense_settings')
    return saved ? JSON.parse(saved) : getDefaultSettings()
  })

  // State management
  const [theme, setTheme] = useState(settings.theme || 'dark')
  const [language, setLanguage] = useState(settings.language || 'en')
  const [timezone, setTimezone] = useState(settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [apiKeys, setApiKeys] = useState(settings.api_keys || { slack: '', flowise: '', openai: '' })
  const [billingEmail, setBillingEmail] = useState(settings.billing_email || '')
  const [plan, setPlan] = useState(settings.plan || 'Free')
  const [autoRenew, setAutoRenew] = useState(settings.auto_renew || false)
  const [aiPreferences, setAiPreferences] = useState(settings.ai_preferences || { model: 'gpt-4', tokens: 1024, style: 'concise' })
  const [notificationsSettings, setNotificationsSettings] = useState(settings.notifications_settings || { weekly_reports: true, reminders: true, ai_emails: false })
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notifications_enabled !== false)
  const [sessionTimeout, setSessionTimeout] = useState(settings.session_timeout || 3600)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(settings.two_factor_enabled || false)

  // Save to localStorage
  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    const updatedSettings = {
      theme,
      language,
      timezone,
      api_keys: apiKeys,
      billing_email: billingEmail,
      plan,
      auto_renew: autoRenew,
      ai_preferences: aiPreferences,
      notifications_settings: notificationsSettings,
      notifications_enabled: notificationsEnabled,
      session_timeout: sessionTimeout,
      two_factor_enabled: twoFactorEnabled,
      updated_at: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem('leadSense_settings', JSON.stringify(updatedSettings))
    setSettings(updatedSettings)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    setIsSaving(false)
    setSaveSuccess(true)

    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-extrabold gradient-text">Settings</h1>
          </div>
          <p className="text-gray-400 text-lg">Manage your account preferences and integrations</p>
        </div>

        {/* Save Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card-premium p-4 sticky top-24">
              <nav className="space-y-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/50 text-white shadow-lg shadow-primary/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'theme' && (
              <ThemeSettings
                theme={theme}
                setTheme={setTheme}
                notificationsEnabled={notificationsEnabled}
                setNotificationsEnabled={setNotificationsEnabled}
              />
            )}

            {activeTab === 'language' && (
              <LanguageSettings
                language={language}
                setLanguage={setLanguage}
                timezone={timezone}
                setTimezone={setTimezone}
              />
            )}

            {activeTab === 'api' && (
              <APIKeySettings
                apiKeys={apiKeys}
                setApiKeys={setApiKeys}
              />
            )}

            {activeTab === 'billing' && (
              <BillingSettings
                billingEmail={billingEmail}
                setBillingEmail={setBillingEmail}
                plan={plan}
                autoRenew={autoRenew}
                setAutoRenew={setAutoRenew}
              />
            )}

            {activeTab === 'ai' && (
              <AIPreferences
                aiPreferences={aiPreferences}
                setAiPreferences={setAiPreferences}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings
                notificationsSettings={notificationsSettings}
                setNotificationsSettings={setNotificationsSettings}
              />
            )}

            {activeTab === 'security' && (
              <SecuritySettings
                sessionTimeout={sessionTimeout}
                setSessionTimeout={setSessionTimeout}
                twoFactorEnabled={twoFactorEnabled}
                setTwoFactorEnabled={setTwoFactorEnabled}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
