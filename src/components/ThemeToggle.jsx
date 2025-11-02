/**
 * ThemeToggle Component
 * Toggle switch for dark/light mode
 */

import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle({ value, onChange }) {
  const isDark = value === 'dark'

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark'
    onChange(newTheme)
    
    // Update document class for immediate effect
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(newTheme)
    
    // Also persist to localStorage as fallback
    localStorage.setItem('theme', newTheme)
  }

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-white">
        Theme
      </label>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark ${
          isDark ? 'bg-primary' : 'bg-gray-600'
        }`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
            isDark ? 'translate-x-7' : 'translate-x-1'
          }`}
        >
          <span className="flex h-full w-full items-center justify-center">
            {isDark ? (
              <Moon className="h-4 w-4 text-primary" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-400" />
            )}
          </span>
        </span>
      </button>
      <span className="text-sm text-gray-400">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </div>
  )
}

