/**
 * LanguageSettings Component
 * Language and timezone preferences with i18n
 */

import { Globe } from 'lucide-react'
// import { useTranslation } from 'react-i18next'
import { getLanguages, getTimezones } from '../../lib/settings'

export default function LanguageSettings({ language, setLanguage, timezone, setTimezone }) {
  // const { i18n } = useTranslation()
  const languages = getLanguages()
  const timezones = getTimezones()

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    // i18n.changeLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
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
            onChange={(e) => handleLanguageChange(e.target.value)}
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
  )
}

