/**
 * Settings Page
 * Advanced user preferences with auto-save, tabs (desktop) / accordion (mobile)
 * Route: /settings
 */

import { useState, useEffect, useRef } from 'react'
import { Save, Settings as SettingsIcon, Palette, Globe, Key, CreditCard, Shield, Sparkles, Bell, Download, ChevronDown, Check } from 'lucide-react'
// import { useTranslation } from 'react-i18next'
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
import { useIsMobile } from '../../lib/useMediaQuery'
import { useDebounce } from '../../lib/useDebounce'

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
  // const { t } = useTranslation()
  const t = (key) => {
    const translations = {
      'settings.title': 'Settings',
      'settings.subtitle': 'Manage your preferences and configuration',
      'settings.saved': 'Settings saved automatically!',
    }
    return translations[key] || key
  }
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('theme')
  const [expandedSections, setExpandedSections] = useState(new Set(['theme']))
  const [loading, setLoading] = useState(true)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const toastTimeoutRef = useRef(null)
  const hasInitializedRef = useRef(false)
  
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
    weekly_reports: true,
    reminders: true,
    ai_emails: false,
  })
  const [sessionTimeout, setSessionTimeout] = useState(3600)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Current user ID (for now, using 'admin' as default)
  const userId = 'admin'

  // Debounce all settings for auto-save (1 second delay)
  const debouncedSettings = useDebounce({
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
  }, 1000)

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  // Auto-save on debounced settings change
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      return
    }

    const autoSave = async () => {
      setAutoSaving(true)
      try {
        const success = await saveUserSettings(userId, debouncedSettings)
        if (success) {
          setLastSaved(new Date())
          setShowToast(true)
          if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current)
          }
          toastTimeoutRef.current = setTimeout(() => setShowToast(false), 2000)
        }
      } catch (error) {
        console.error('Failed to auto-save settings:', error)
      } finally {
        setAutoSaving(false)
      }
    }

    autoSave()
  }, [debouncedSettings, userId])

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
          weekly_reports: true,
          reminders: true,
          ai_emails: false,
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

  const toggleSection = (tabId) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(tabId)) {
        next.delete(tabId)
      } else {
        next.add(tabId)
      }
      return next
    })
    setActiveTab(tabId)
  }

  const handleExportData = async () => {
    try {
      // Fetch user data from Supabase (mock for now, can be enhanced with actual API)
      const settings = await getUserSettings(userId)
      const data = {
        ...settings,
        api_keys: {
          slack: settings.api_keys?.slack ? '[REDACTED]' : '',
          flowise: settings.api_keys?.flowise ? '[REDACTED]' : '',
          openai: settings.api_keys?.openai ? '[REDACTED]' : '',
        },
        exportedAt: new Date().toISOString(),
      }

      // Create JSON file
      const json = JSON.stringify(data, null, 2)
      
      // Create CSV
      const csvRows = []
      csvRows.push('Setting,Value')
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          csvRows.push(`${key},"${JSON.stringify(value).replace(/"/g, '""')}"`)
        } else {
          csvRows.push(`${key},"${String(value).replace(/"/g, '""')}"`)
        }
      })
      const csv = csvRows.join('\n')

      // Create ZIP using JSZip (if available) or download both files
      // For now, we'll create a simple approach: download JSON and CSV separately
      // In production, you'd use JSZip or call a backend API
      
      // Download JSON
      const jsonBlob = new Blob([json], { type: 'application/json' })
      const jsonUrl = URL.createObjectURL(jsonBlob)
      const jsonLink = document.createElement('a')
      jsonLink.href = jsonUrl
      jsonLink.download = `leadsense-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(jsonLink)
      jsonLink.click()
      document.body.removeChild(jsonLink)
      URL.revokeObjectURL(jsonUrl)

      // Download CSV
      setTimeout(() => {
        const csvBlob = new Blob([csv], { type: 'text/csv' })
        const csvUrl = URL.createObjectURL(csvBlob)
        const csvLink = document.createElement('a')
        csvLink.href = csvUrl
        csvLink.download = `leadsense-data-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(csvLink)
        csvLink.click()
        document.body.removeChild(csvLink)
        URL.revokeObjectURL(csvUrl)
      }, 300)

      console.log('✅ Settings exported as JSON and CSV')
    } catch (error) {
      console.error('Failed to export data:', error)
    }
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
          <Check className="w-5 h-5" />
          <span>Settings saved automatically!</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-extrabold gradient-text tracking-tight">
              {t('settings.title')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {autoSaving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                Saving...
              </div>
            )}
            {lastSaved && !autoSaving && (
              <div className="text-xs text-muted-foreground">
                Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              title="Export all settings as JSON/CSV"
            >
              <Download className="w-5 h-5" />
              {!isMobile && 'Export Data'}
            </button>
          </div>
        </div>
        <p className="text-muted-foreground">
          {t('settings.subtitle')} {!isMobile && <span className="text-xs">(Auto-saves after 1 second)</span>}
        </p>
      </div>

      {/* Desktop: Tabs | Mobile: Accordion */}
      {isMobile ? (
        // Mobile Accordion View
        <div className="space-y-4">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isExpanded = expandedSections.has(tab.id)
            return (
              <div key={tab.id} className="glass-card-premium overflow-hidden">
                <button
                  onClick={() => toggleSection(tab.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-white">{tab.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-white/10">
                    {tab.id === 'theme' && (
                      <ThemeSettings
                        theme={theme}
                        setTheme={setTheme}
                        notificationsEnabled={notificationsEnabled}
                        setNotificationsEnabled={setNotificationsEnabled}
                      />
                    )}
                    {tab.id === 'language' && (
                      <LanguageSettings
                        language={language}
                        setLanguage={setLanguage}
                        timezone={timezone}
                        setTimezone={setTimezone}
                      />
                    )}
                    {tab.id === 'api' && (
                      <APIKeySettings
                        apiKeys={apiKeys}
                        setApiKeys={setApiKeys}
                      />
                    )}
                    {tab.id === 'billing' && (
                      <BillingSettings
                        billingEmail={billingEmail}
                        setBillingEmail={setBillingEmail}
                        plan={plan}
                        autoRenew={autoRenew}
                        setAutoRenew={setAutoRenew}
                      />
                    )}
                    {tab.id === 'ai' && (
                      <AIPreferences
                        aiPreferences={aiPreferences}
                        setAiPreferences={setAiPreferences}
                      />
                    )}
                    {tab.id === 'notifications' && (
                      <NotificationSettings
                        notificationsSettings={notificationsSettings}
                        setNotificationsSettings={setNotificationsSettings}
                      />
                    )}
                    {tab.id === 'security' && (
                      <SecuritySettings
                        sessionTimeout={sessionTimeout}
                        setSessionTimeout={setSessionTimeout}
                        twoFactorEnabled={twoFactorEnabled}
                        setTwoFactorEnabled={setTwoFactorEnabled}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        // Desktop Tab View
        <>
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
        </>
      )}
    </div>
  )
}
