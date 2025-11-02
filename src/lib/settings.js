/**
 * Settings Service
 * Handles Supabase operations for user settings and preferences
 */

import { supabase } from './supabaseClient'

/**
 * Save user settings
 * @param {string} userId - User ID (UUID or text identifier)
 * @param {object} data - Settings data
 * @returns {Promise<boolean>} Success status
 */
export async function saveUserSettings(userId, data) {
  try {
    console.log('🔄 Saving user settings:', { userId, data })

    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          id: userId,
          ...data,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )

    if (error) {
      console.error('❌ Error saving user settings:', error)
      return false
    }

    console.log('✅ User settings saved successfully')
    return true
  } catch (error) {
    console.error('❌ Unexpected error in saveUserSettings:', error)
    return false
  }
}

/**
 * Get user settings
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} User settings or null
 */
export async function getUserSettings(userId) {
  try {
    console.log('🔄 Fetching user settings:', userId)

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // If no settings found, return defaults
      if (error.code === 'PGRST116') {
        console.log('ℹ️ No settings found, returning defaults')
        return getDefaultSettings()
      }
      console.error('❌ Error fetching user settings:', error)
      return getDefaultSettings()
    }

    console.log('✅ Fetched user settings')
    return data || getDefaultSettings()
  } catch (error) {
    console.error('❌ Unexpected error in getUserSettings:', error)
    return getDefaultSettings()
  }
}

/**
 * Get default settings
 * @returns {object} Default settings
 */
export function getDefaultSettings() {
  // Auto-detect timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return {
    theme: 'dark',
    language: 'en',
    timezone: timezone || 'UTC',
    api_keys: {
      slack: '',
      flowise: '',
      openai: '',
    },
    notifications_enabled: true,
  }
}

/**
 * Auto-detect timezone
 * @returns {string} Timezone string
 */
export function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    console.error('Failed to detect timezone:', error)
    return 'UTC'
  }
}

/**
 * Get available languages
 * @returns {Array} Array of language options
 */
export function getLanguages() {
  return [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
  ]
}

/**
 * Get available timezones
 * @returns {Array} Array of timezone options
 */
export function getTimezones() {
  return [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'EST (Eastern Time)' },
    { value: 'America/Chicago', label: 'CST (Central Time)' },
    { value: 'America/Denver', label: 'MST (Mountain Time)' },
    { value: 'America/Los_Angeles', label: 'PST (Pacific Time)' },
    { value: 'Europe/London', label: 'GMT (London)' },
    { value: 'Europe/Berlin', label: 'CET (Central European Time)' },
    { value: 'Europe/Paris', label: 'CET (Paris)' },
    { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
    { value: 'Asia/Shanghai', label: 'CST (Shanghai)' },
    { value: 'Australia/Sydney', label: 'AEST (Sydney)' },
  ]
}

