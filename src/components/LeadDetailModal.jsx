import { useEffect } from 'react'
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  MessageSquare,
  Tag,
  TrendingUp,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { getBadgeColor } from '../lib/helpers'

export default function LeadDetailModal({ lead, onClose }) {
  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Format date/time
  const formatDateTime = (timestamp) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}:${minutes}`
  }

  // Format tags as comma-separated string
  const formatTags = (tags) => {
    if (!tags) return null
    if (Array.isArray(tags)) {
      const validTags = tags.filter(tag => tag && typeof tag === 'string' && tag.trim())
      return validTags.length > 0 ? validTags.join(', ') : null
    }
    return typeof tags === 'string' ? tags : null
  }

  // Get score badge color
  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-gray-400'
    if (score >= 75) return 'text-red-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-blue-400'
  }

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Show error if no lead
  if (!lead) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                {lead.name || 'Unknown Lead'}
              </h2>
              {lead.email && (
                <p className="text-sm text-gray-400 mt-1">{lead.email}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="text-white font-medium">{lead.name || '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-white font-medium break-all">{lead.email || '—'}</p>
                </div>
              </div>

              {lead.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-white font-medium">{lead.phone}</p>
                  </div>
                </div>
              )}

              {lead.company && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Company</p>
                    <p className="text-white font-medium">{lead.company}</p>
                  </div>
                </div>
              )}

              {lead.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Website</p>
                    <a
                      href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {lead.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scoring & Category */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">
              Scoring & Category
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score ?? '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  {lead.category ? (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(lead.category)}`}>
                      {lead.category}
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
              </div>

              {lead.status && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-white font-medium">{lead.status}</p>
                  </div>
                </div>
              )}

              {lead.interest_category && (
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Interest Category</p>
                    <p className="text-white font-medium">{lead.interest_category}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {formatTags(lead.tags) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">
                Tags
              </h3>
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white">{formatTags(lead.tags)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {lead.message && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">
                Message
              </h3>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="bg-white/5 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <p className="text-white whitespace-pre-wrap text-sm leading-relaxed">
                      {lead.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2">
              Metadata
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Created At</p>
                  <p className="text-white text-sm">{formatDateTime(lead.created_at)}</p>
                </div>
              </div>

              {lead.id && (
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Lead ID</p>
                    <p className="text-white text-sm font-mono">{lead.id}</p>
                  </div>
                </div>
              )}

              {lead.source && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Source</p>
                    <p className="text-white text-sm">{lead.source}</p>
                  </div>
                </div>
              )}

              {lead.deal_value && (
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Deal Value</p>
                    <p className="text-white text-sm font-medium">
                      ${parseFloat(lead.deal_value).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {lead.contact_preference && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Contact Preference</p>
                    <p className="text-white text-sm">{lead.contact_preference}</p>
                  </div>
                </div>
              )}

              {lead.utm_source && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">UTM Source</p>
                    <p className="text-white text-sm">{lead.utm_source}</p>
                  </div>
                </div>
              )}

              {lead.utm_campaign && (
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">UTM Campaign</p>
                    <p className="text-white text-sm">{lead.utm_campaign}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

