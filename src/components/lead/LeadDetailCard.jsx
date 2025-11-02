/**
 * LeadDetailCard Component
 * Displays lead information in a card layout
 */

import { User, Mail, Phone, Building, Globe, TrendingUp, Tag, Calendar, Hash } from 'lucide-react'
import { getBadgeColor, getScoreGradient } from '../../lib/helpers'

export default function LeadDetailCard({ lead, onFieldChange }) {
  if (!lead) return null

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

  // Get score gradient
  const scoreGradient = getScoreGradient(lead.score || 0)

  return (
    <div className="glass-card-premium p-6 space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text">{lead.name || 'Unknown Lead'}</h2>
            {lead.email && <p className="text-sm text-gray-400">{lead.email}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">ID:</span>
          <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]">{lead.id}</span>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2 uppercase tracking-wider">
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
        <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2 uppercase tracking-wider">
          Scoring & Category
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Score Field (Editable) */}
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Score</p>
              <input
                type="number"
                min="0"
                max="100"
                value={lead.score ?? ''}
                onChange={(e) => onFieldChange('score', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Category Field (Editable) */}
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Category</p>
              <select
                value={lead.category || ''}
                onChange={(e) => onFieldChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-white text-black dark:bg-white dark:text-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
          </div>

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
          <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2 uppercase tracking-wider">
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

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300 border-b border-white/10 pb-2 uppercase tracking-wider">
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

          {lead.source && (
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Source</p>
                <p className="text-white text-sm">{lead.source}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

