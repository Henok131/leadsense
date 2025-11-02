/**
 * LeadCard Component
 * Draggable card representing a single lead in the Kanban board
 */

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Building, TrendingUp, User, Mail, Calendar } from 'lucide-react'
import { getBadgeColor, getScoreGradient } from '../../lib/helpers'

export default function LeadCard({ lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'lead',
      lead,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const scoreGradient = getScoreGradient(lead?.score || 0)

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${date.getDate()} ${months[date.getMonth()]}`
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-card p-4 mb-3 cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform duration-200 hover:shadow-lg hover:shadow-primary/20 animate-fadeInUp group"
    >
      {/* Header with Name and Score */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 flex-1 pr-2">
          {lead.name || 'Unnamed Lead'}
        </h4>
        {lead.score !== null && lead.score !== undefined && (
          <div className="flex-shrink-0">
            <span
              className="text-xs font-extrabold"
              style={{ color: scoreGradient.color }}
            >
              {lead.score}
            </span>
          </div>
        )}
      </div>

      {/* Company */}
      {lead.company && (
        <div className="flex items-center gap-2 mb-2 text-gray-300 text-xs">
          <Building className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{lead.company}</span>
        </div>
      )}

      {/* Email */}
      {lead.email && (
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs">
          <Mail className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
      )}

      {/* Category Badge */}
      {lead.category && (
        <div className="mb-3">
          <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getBadgeColor(lead.category)}`}>
            {lead.category}
          </span>
        </div>
      )}

      {/* Tags */}
      {formatTags(lead.tags) && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 line-clamp-2">
            {formatTags(lead.tags)}
          </p>
        </div>
      )}

      {/* Footer with date and assigned user */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(lead.created_at)}</span>
        </div>
        {lead.assigned_to && (
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <User className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{lead.assigned_to}</span>
          </div>
        )}
      </div>
    </div>
  )
}

