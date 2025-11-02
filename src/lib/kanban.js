/**
 * Kanban Pipeline Service
 * Handles Supabase operations for lead pipeline/board
 */

import { supabase } from './supabaseClient'

/**
 * Get all leads grouped by status
 * @returns {Promise<Array>} Array of leads
 */
export async function getLeadsByStatus() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching leads for kanban:', error)
      return []
    }

    console.log('✅ Fetched leads for kanban:', data?.length || 0, 'rows')
    return data || []
  } catch (error) {
    console.error('❌ Unexpected error in getLeadsByStatus:', error)
    return []
  }
}

/**
 * Update lead status
 * @param {string} id - Lead ID
 * @param {string} status - New status value
 * @returns {Promise<boolean>} Success status
 */
export async function updateLeadStatus(id, status) {
  try {
    console.log('🔄 Updating lead status:', { id, status })
    
    const { error } = await supabase
      .from('leads')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('❌ Error updating lead status:', error)
      return false
    }

    console.log('✅ Lead status updated successfully')
    return true
  } catch (error) {
    console.error('❌ Unexpected error in updateLeadStatus:', error)
    return false
  }
}

/**
 * Assign lead to a user
 * @param {string} id - Lead ID
 * @param {string} userId - User ID or email
 * @returns {Promise<boolean>} Success status
 */
export async function assignLead(id, userId) {
  try {
    console.log('🔄 Assigning lead:', { id, userId })
    
    const { error } = await supabase
      .from('leads')
      .update({ 
        assigned_to: userId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('❌ Error assigning lead:', error)
      return false
    }

    console.log('✅ Lead assigned successfully')
    return true
  } catch (error) {
    console.error('❌ Unexpected error in assignLead:', error)
    return false
  }
}

/**
 * Subscribe to leads table for realtime updates
 * @param {Function} callback - Callback function to handle updates
 * @returns {object} Subscription object with unsubscribe method
 */
export function subscribeLeads(callback) {
  console.log('🔄 Subscribing to leads realtime updates')
  
  const channel = supabase
    .channel('leads-kanban-updates')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'leads'
      },
      (payload) => {
        console.log('📡 Realtime update received:', payload.eventType)
        callback(payload)
      }
    )
    .subscribe()

  return {
    unsubscribe: () => {
      console.log('🔌 Unsubscribing from leads updates')
      supabase.removeChannel(channel)
    }
  }
}

