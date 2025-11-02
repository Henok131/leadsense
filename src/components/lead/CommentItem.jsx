/**
 * CommentItem Component
 * Renders individual comment with replies, actions, and mentions
 */

import { useState } from 'react'
import { MessageSquare, Edit, Trash2, Reply, User as UserIcon } from 'lucide-react'
import { updateComment, deleteComment, highlightMentions } from '../../lib/comments'

export default function CommentItem({ comment, currentUserId, onReply, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(comment.text)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = async () => {
    const success = await updateComment(comment.id, editedText)
    if (success) {
      setIsEditing(false)
      if (onUpdate) onUpdate()
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    setIsDeleting(true)
    const success = await deleteComment(comment.id)
    if (success && onUpdate) {
      onUpdate()
    }
    setIsDeleting(false)
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    
    return date.toLocaleDateString()
  }

  const parts = highlightMentions(comment.text)

  return (
    <div className="mb-4 animate-fadeInUp">
      {/* Comment Body */}
      <div className="glass-card p-4 hover:shadow-lg transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{comment.user_name}</p>
              <p className="text-xs text-gray-400">{formatDate(comment.created_at)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReply(comment)}
              className="p-1.5 text-gray-400 hover:text-primary hover:bg-white/10 rounded transition-colors"
              title="Reply"
            >
              <Reply className="w-4 h-4" />
            </button>
            {comment.user_id === currentUserId && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-white/10 rounded transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 gradient-bg text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedText(comment.text)
                }}
                className="px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-white text-sm leading-relaxed">
            {parts.map((part, idx) => {
              if (part.type === 'mention') {
                return (
                  <span key={idx} className="text-primary font-semibold hover:underline">
                    {part.text}
                  </span>
                )
              }
              return <span key={idx}>{part.text}</span>
            })}
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-3 space-y-3 border-l-2 border-white/10 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

