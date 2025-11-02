/**
 * LeadColumn Component
 * Droppable column that displays leads for a specific status
 */

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import LeadCard from './LeadCard'

const STATUS_COLORS = {
  'New': 'from-blue-500/20 to-cyan-500/10',
  'In Review': 'from-yellow-500/20 to-amber-500/10',
  'Contacted': 'from-purple-500/20 to-violet-500/10',
  'Converted': 'from-green-500/20 to-emerald-500/10',
}

const STATUS_BORDER_COLORS = {
  'New': 'border-blue-500/30',
  'In Review': 'border-yellow-500/30',
  'Contacted': 'border-purple-500/30',
  'Converted': 'border-green-500/30',
}

export default function LeadColumn({ title, status, leads }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div
        className={`sticky top-0 z-10 glass-card-premium p-4 mb-4 rounded-2xl border-2 transition-all duration-200 ${
          isOver ? 'scale-[1.02] border-primary/50 shadow-lg shadow-primary/20' : STATUS_BORDER_COLORS[status] || 'border-white/20'
        }`}
      >
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${STATUS_COLORS[status] || 'from-gray-500/20 to-gray-500/10'} opacity-50`} />
        <div className="relative z-10 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-bold">
            {leads.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto transition-all duration-200 min-h-[200px] ${
          isOver ? 'bg-gradient-to-b from-primary/5 to-transparent' : ''
        }`}
      >
        <SortableContext
          items={leads.map(lead => lead.id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No leads
            </div>
          ) : (
            leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}

