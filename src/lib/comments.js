/**
 * Comments Service
 * Handles Supabase operations for comments and collaboration
 */

import { supabase } from './supabaseClient'

/**
 * Fetch all comments for a lead
 * @param {string} leadId - Lead ID
 * @returns {Promise<Array>} Array of comments with nested replies
 */
export async function fetchComments(leadId) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('❌ Error fetching comments:', error)
      return []
    }

    // Build threaded structure
    const commentsMap = new Map()
    const rootComments = []

    // First pass: create map of all comments
    data.forEach(comment => {
      commentsMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: build tree structure
    data.forEach(comment => {
      const commentWithReplies = commentsMap.get(comment.id)
      if (comment.parent_id) {
        const parent = commentsMap.get(comment.parent_id)
        if (parent) {
          parent.replies.push(commentWithReplies)
        }
      } else {
        rootComments.push(commentWithReplies)
      }
    })

    console.log('✅ Fetched comments:', rootComments.length, 'threads')
    return rootComments
  } catch (error) {
    console.error('❌ Unexpected error in fetchComments:', error)
    return []
  }
}

/**
 * Add a new comment
 * @param {string} leadId - Lead ID
 * @param {string} userId - User identifier
 * @param {string} userName - User display name
 * @param {string} text - Comment text
 * @param {number|null} parentId - Parent comment ID for replies
 * @returns {Promise<object|null>} Created comment or null
 */
export async function addComment(leadId, userId, userName, text, parentId = null) {
  try {
    console.log('🔄 Adding comment:', { leadId, userId, userName, parentId })

    const { data, error } = await supabase
      .from('comments')
      .insert({
        lead_id: leadId,
        user_id: userId,
        user_name: userName,
        text,
        parent_id: parentId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error adding comment:', error)
      return null
    }

    console.log('✅ Comment added successfully')
    return data
  } catch (error) {
    console.error('❌ Unexpected error in addComment:', error)
    return null
  }
}

/**
 * Update a comment
 * @param {number} id - Comment ID
 * @param {string} text - New comment text
 * @returns {Promise<boolean>} Success status
 */
export async function updateComment(id, text) {
  try {
    console.log('🔄 Updating comment:', id)

    const { error } = await supabase
      .from('comments')
      .update({
        text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('❌ Error updating comment:', error)
      return false
    }

    console.log('✅ Comment updated successfully')
    return true
  } catch (error) {
    console.error('❌ Unexpected error in updateComment:', error)
    return false
  }
}

/**
 * Delete a comment
 * @param {number} id - Comment ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteComment(id) {
  try {
    console.log('🔄 Deleting comment:', id)

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error deleting comment:', error)
      return false
    }

    console.log('✅ Comment deleted successfully')
    return true
  } catch (error) {
    console.error('❌ Unexpected error in deleteComment:', error)
    return false
  }
}

/**
 * Subscribe to comments for realtime updates
 * @param {string} leadId - Lead ID
 * @param {Function} callback - Callback function to handle updates
 * @returns {object} Subscription object with unsubscribe method
 */
export function subscribeComments(leadId, callback) {
  console.log('🔄 Subscribing to comments realtime updates for lead:', leadId)

  const channel = supabase
    .channel(`comments-${leadId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `lead_id=eq.${leadId}`
      },
      (payload) => {
        console.log('📡 Comment update received:', payload.eventType)
        callback(payload)
      }
    )
    .subscribe()

  return {
    unsubscribe: () => {
      console.log('🔌 Unsubscribing from comments updates')
      supabase.removeChannel(channel)
    }
  }
}

/**
 * Parse mentions from text (@username)
 * @param {string} text - Comment text
 * @returns {Array} Array of mentioned usernames
 */
export function parseMentions(text) {
  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1])
  }

  return mentions
}

/**
 * Highlight mentions in text
 * @param {string} text - Comment text
 * @returns {JSX.Element} Text with highlighted mentions
 */
export function highlightMentions(text) {
  const parts = []
  let lastIndex = 0
  const mentionRegex = /@(\w+)/g
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.substring(lastIndex, match.index), type: 'text' })
    }
    parts.push({ text: `@${match[1]}`, type: 'mention', username: match[1] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.substring(lastIndex), type: 'text' })
  }

  return parts
}

