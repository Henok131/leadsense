/**
 * Lead Service Module
 * Provides CRUD operations for leads in Supabase
 */

import { supabase } from './supabaseClient'

/**
 * Fetch a single lead by ID
 * @param {string} id - Lead UUID
 * @returns {Promise<object|null>} Lead object or null if not found
 */
export async function getLead(id) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Error fetching lead:', error)
      throw error
    }

    console.log('✅ Fetched lead:', data?.name || 'Unknown')
    return data
  } catch (error) {
    console.error('❌ Failed to get lead:', error)
    return null
  }
}

/**
 * Update a lead's fields
 * @param {string} id - Lead UUID
 * @param {object} payload - Fields to update (category, score, internal_notes, etc.)
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function updateLead(id, payload) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update({
        ...payload,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('❌ Error updating lead:', error)
      throw error
    }

    console.log('✅ Updated lead:', data?.[0]?.name || 'Unknown')
    return true
  } catch (error) {
    console.error('❌ Failed to update lead:', error)
    return false
  }
}

/**
 * Delete a lead by ID
 * @param {string} id - Lead UUID
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function deleteLead(id) {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error deleting lead:', error)
      throw error
    }

    console.log('✅ Deleted lead:', id)
    return true
  } catch (error) {
    console.error('❌ Failed to delete lead:', error)
    return false
  }
}

/**
 * Fetch all leads with optional filters
 * @param {object} filters - Optional filters (status, category, etc.)
 * @returns {Promise<array>} Array of leads
 */
export async function getAllLeads(filters = {}) {
  try {
    let query = supabase.from('leads').select('*')

    // Apply filters if provided
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching leads:', error)
      throw error
    }

    console.log('✅ Fetched', data?.length || 0, 'leads')
    return data || []
  } catch (error) {
    console.error('❌ Failed to get leads:', error)
    return []
  }
}

