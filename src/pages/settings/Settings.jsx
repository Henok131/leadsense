/**
 * Settings Page
 * Advanced user preferences and configuration panel with tabs
 * Route: /settings
 */

import { useState, useEffect } from 'react'
import { Save, Settings as SettingsIcon, Palette, Globe, Key, CreditCard, Shield, Sparkles, Bell, Download, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ThemeSettings from './ThemeSettings'
import LanguageSettings from './LanguageSettings'
import APIKeySettings from './APIKeySettings'
import BillingSettings from './BillingSettings'
import AIPreferences from './AIPreferences'
import NotificationSettings from './NotificationSettings'
import SecuritySettings from './SecuritySettings'
import { 
  getUserSettings, 
  saveUserSettings, 
  getDefaultSettings 
} from '../../lib/settings'

const TABS = [
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'ai', label: 'AI', icon: Sparkles },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

export default function Settings() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('theme')
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
  const [billingEmail, setBillingEmail] = useState('')
  const [plan, setPlan] = useState('Free')
  const [autoRenew, setAutoRenew] = useState(false)
  const [aiPreferences, setAiPreferences] = useState({
    model: 'gpt-4',
    tokens: 1024,
    style: 'concise',
  })
  const [notificationsSettings, setNotificationsSettings] = useState({
    weekly: true,
    reminders: false,
    summaries: true,
  })
  const [sessionTimeout, setSessionTimeout] = useState(3600)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

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
        setTimezone(settings.timezone || 'UTC')
        setNotificationsEnabled(settings.notifications_enabled !== false)
        setApiKeys(settings.api_keys || {
          slack: '',
          flowise: '',
          openai: '',
        })
        setBillingEmail(settings.billing_email || '')
        setPlan(settings.plan || 'Free')
        setAutoRenew(settings.auto_renew || false)
        setAiPreferences(settings.ai_preferences || {
          model: 'gpt-4',
          tokens: 1024,
          style: 'concise',
        })
        setNotificationsSettings(settings.notifications_settings || {
          weekly: true,
          reminders: false,
          summaries: true,
        })
        setSessionTimeout(settings.session_timeout || 3600)
        setTwoFactorEnabled(settings.two_factor_enabled || false)
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
      setBillingEmail(defaults.billing_email)
      setPlan(defaults.plan)
      setAutoRenew(defaults.auto_renew)
      setAiPreferences(defaults.ai_preferences)
      setNotificationsSettings(defaults.notifications_settings)
      setSessionTimeout(defaults.session_timeout)
      setTwoFactorEnabled(defaults.two_factor_enabled)
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
        billing_email: billingEmail,
        plan,
        auto_renew: autoRenew,
        ai_preferences: aiPreferences,
        notifications_settings: notificationsSettings,
        session_timeout: sessionTimeout,
        two_factor_enabled: twoFactorEnabled,
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

  const handleExportData = () => {
    const data = {
      theme,
      language,
      timezone,
      notificationsEnabled,
      apiKeys: {
        slack: apiKeys.slack ? '[REDACTED]' : '',
        flowise: apiKeys.flowise ? '[REDACTED]' : '',
        openai: apiKeys.openai ? '[REDACTED]' : '',
      },
      billingEmail,
      plan,
      autoRenew,
      aiPreferences,
      notificationsSettings,
      sessionTimeout,
      twoFactorEnabled,
      exportedAt: new Date().toISOString(),
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leadsense-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('✅ Settings exported')
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  const activeTabInfo = TABS.find(tab => tab.id === activeTab)
  const ActiveIcon = activeTabInfo?.icon || SettingsIcon

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 flex items-center gap-3 shadow-lg animate-fadeIn">
          <Save className="w-5 h-5" />
          <span>{t('settings.saved')}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-extrabold gradient-text tracking-tight">
              {t('settings.title')}
            </h1>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
            title="Export all settings as JSON"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
        </div>
        <p className="text-muted-foreground">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="glass-card-premium p-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-6">
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
              {t('settings.save')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
