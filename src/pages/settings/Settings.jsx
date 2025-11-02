/**
 * Settings Page - Rebuilt from scratch
 * Simple, working version with basic settings
 */

import { useState } from 'react'
import { Settings as SettingsIcon, Palette, Globe, Key, CreditCard, Shield, Sparkles, Bell } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('theme')
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('en')

  const tabs = [
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'ai', label: 'AI', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const activeTabInfo = tabs.find(tab => tab.id === activeTab)
  const ActiveIcon = activeTabInfo?.icon || SettingsIcon

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-extrabold gradient-text tracking-tight">
              Settings
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your preferences and configuration
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="glass-card-premium p-8">
          <div className="flex items-center gap-3 mb-6">
            <ActiveIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-white">
              {activeTabInfo?.label || 'Settings'}
            </h2>
          </div>

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="dark" className="bg-dark">Dark</option>
                  <option value="light" className="bg-dark">Light</option>
                  <option value="auto" className="bg-dark">Auto</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en" className="bg-dark">English</option>
                  <option value="fr" className="bg-dark">Français</option>
                  <option value="de" className="bg-dark">Deutsch</option>
                  <option value="es" className="bg-dark">Español</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <p className="text-gray-400">
                API key management coming soon...
              </p>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4">
              <p className="text-gray-400">
                Billing settings coming soon...
              </p>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <p className="text-gray-400">
                AI preferences coming soon...
              </p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <p className="text-gray-400">
                Notification settings coming soon...
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <p className="text-gray-400">
                Security settings coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
