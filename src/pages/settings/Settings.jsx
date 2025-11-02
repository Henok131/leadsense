/**
 * Settings Page
 * User settings with tabs for Theme, Language, API Keys, Billing, AI Preferences, Notifications, and Security
 */

import { useState } from 'react'
import { Settings as SettingsIcon, Save, CheckCircle } from 'lucide-react'

// Simple test first - verify base rendering works
console.log('✅ Settings.jsx file loaded')
console.log('✅ Settings component function exists')

export default function Settings() {
  console.log('✅ Settings component function called - rendering started')

  try {
    const [activeTab, setActiveTab] = useState('theme')
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    console.log('✅ Settings component state initialized')

    // Try to import sub-components conditionally to isolate errors
    let ThemeSettings, LanguageSettings, APIKeySettings, BillingSettings, AIPreferences, NotificationSettings, SecuritySettings
    let getDefaultSettings

    try {
      const settingsLib = require('../../lib/settings')
      getDefaultSettings = settingsLib.getDefaultSettings
      console.log('✅ getDefaultSettings imported')
    } catch (e) {
      console.error('❌ Error importing getDefaultSettings:', e)
      // Fallback
      getDefaultSettings = () => ({
        theme: 'dark',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        api_keys: { slack: '', flowise: '', openai: '' },
        billing_email: '',
        plan: 'Free',
        auto_renew: false,
        ai_preferences: { model: 'gpt-4', tokens: 1024, style: 'concise' },
        notifications_settings: { weekly_reports: true, reminders: true, ai_emails: false },
        notifications_enabled: true,
        session_timeout: 3600,
        two_factor_enabled: false,
      })
    }

    try {
      ThemeSettings = require('./ThemeSettings').default
      LanguageSettings = require('./LanguageSettings').default
      APIKeySettings = require('./APIKeySettings').default
      BillingSettings = require('./BillingSettings').default
      AIPreferences = require('./AIPreferences').default
      NotificationSettings = require('./NotificationSettings').default
      SecuritySettings = require('./SecuritySettings').default
      console.log('✅ All Settings sub-components imported')
    } catch (e) {
      console.error('❌ Error importing Settings sub-components:', e)
      // Create fallback components
      const FallbackComponent = ({ title }) => (
        <div className="glass-card-premium p-6 animate-fadeInUp">
          <p className="text-white">{title} component loading...</p>
        </div>
      )
      ThemeSettings = () => <FallbackComponent title="Theme" />
      LanguageSettings = () => <FallbackComponent title="Language" />
      APIKeySettings = () => <FallbackComponent title="API Keys" />
      BillingSettings = () => <FallbackComponent title="Billing" />
      AIPreferences = () => <FallbackComponent title="AI Preferences" />
      NotificationSettings = () => <FallbackComponent title="Notifications" />
      SecuritySettings = () => <FallbackComponent title="Security" />
    }

    // Load settings from localStorage or use defaults
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('leadSense_settings')
        return saved ? JSON.parse(saved) : getDefaultSettings()
      } catch (e) {
        console.error('❌ Error loading settings from localStorage:', e)
        return getDefaultSettings()
      }
    }

    const initialSettings = loadSettings()

    // State management
    const [theme, setTheme] = useState(initialSettings.theme || 'dark')
    const [language, setLanguage] = useState(initialSettings.language || 'en')
    const [timezone, setTimezone] = useState(initialSettings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
    const [apiKeys, setApiKeys] = useState(initialSettings.api_keys || { slack: '', flowise: '', openai: '' })
    const [billingEmail, setBillingEmail] = useState(initialSettings.billing_email || '')
    const [plan, setPlan] = useState(initialSettings.plan || 'Free')
    const [autoRenew, setAutoRenew] = useState(initialSettings.auto_renew || false)
    const [aiPreferences, setAiPreferences] = useState(initialSettings.ai_preferences || { model: 'gpt-4', tokens: 1024, style: 'concise' })
    const [notificationsSettings, setNotificationsSettings] = useState(initialSettings.notifications_settings || { weekly_reports: true, reminders: true, ai_emails: false })
    const [notificationsEnabled, setNotificationsEnabled] = useState(initialSettings.notifications_enabled !== false)
    const [sessionTimeout, setSessionTimeout] = useState(initialSettings.session_timeout || 3600)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialSettings.two_factor_enabled || false)

    console.log('✅ Settings component state fully initialized')

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

      try {
        localStorage.setItem('leadSense_settings', JSON.stringify(updatedSettings))
        await new Promise(resolve => setTimeout(resolve, 500))
        setIsSaving(false)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } catch (e) {
        console.error('❌ Error saving settings:', e)
        setIsSaving(false)
      }
    }

    const TABS = [
      { id: 'theme', label: 'Theme', icon: '🎨' },
      { id: 'language', label: 'Language', icon: '🌍' },
      { id: 'api', label: 'API Keys', icon: '🔑' },
      { id: 'billing', label: 'Billing', icon: '💳' },
      { id: 'ai', label: 'AI Preferences', icon: '✨' },
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'security', label: 'Security', icon: '🛡️' },
    ]

    console.log('✅ Settings component about to render JSX')

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
  } catch (error) {
    console.error('❌ FATAL ERROR in Settings component:', error)
    console.error('❌ Error stack:', error.stack)
    
    // Render error fallback
    return (
      <div className="min-h-screen bg-dark pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-premium p-8 text-center">
            <h1 className="text-4xl font-bold text-red-400 mb-4">⚠️ Error Loading Settings</h1>
            <p className="text-white mb-4">{error.message}</p>
            <pre className="text-left text-xs text-gray-400 bg-black/30 p-4 rounded-lg overflow-auto">
              {error.stack}
            </pre>
          </div>
        </div>
      </div>
    )
  }
}
