/**
 * CommentsPanel Component
 * Main panel for displaying and managing comments
 */

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, X } from 'lucide-react'
import { fetchComments, addComment, subscribeComments, parseMentions } from '../../lib/comments'
import CommentItem from './CommentItem'

export default function CommentsPanel({ leadId, currentUserId = 'admin', currentUserName = 'Admin' }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const commentsEndRef = useRef(null)

  useEffect(() => {
    loadComments()

    // Subscribe to realtime updates
    const subscription = subscribeComments(leadId, (payload) => {
      console.log('📡 Comment update:', payload.eventType)
      loadComments()
      scrollToBottom()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [leadId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const data = await fetchComments(leadId)
      setComments(data || [])
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const parentId = replyingTo ? replyingTo.id : null
    const success = await addComment(leadId, currentUserId, currentUserName, newComment, parentId)

    if (success) {
      setNewComment('')
      setReplyingTo(null)
      loadComments()
      scrollToBottom()
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e)
    }
    if (e.key === 'Escape' && replyingTo) {
      setReplyingTo(null)
      setNewComment('')
    }
  }

  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold gradient-text">Comments</h2>
          {comments.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold">
              {comments.reduce((count, c) => {
                return count + 1 + (c.replies?.length || 0)
              }, 0)}
            </span>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="mb-6 max-h-[600px] overflow-y-auto pr-2 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onReply={setReplyingTo}
              onUpdate={loadComments}
            />
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Reply Indicator */}
      {replyingTo && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-between">
          <span className="text-sm text-primary">
            Replying to <span className="font-semibold">{replyingTo.user_name}</span>
          </span>
          <button
            onClick={() => {
              setReplyingTo(null)
              setNewComment('')
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              replyingTo
                ? `Reply to ${replyingTo.user_name}...`
                : 'Type your comment... (Ctrl+Enter to post)'
            }
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows="3"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Tip: Use @username to mention someone
          </p>
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="flex items-center gap-2 px-5 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition-all duration-200 font-semibold text-sm shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {replyingTo ? 'Reply' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

