/**
 * LeadNotesPanel Component
 * Editable textarea for internal notes
 */

import { FileText } from 'lucide-react'

export default function LeadNotesPanel({ notes, onChange, isLoading = false }) {
  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Internal Notes</h3>
          <p className="text-xs text-muted-foreground">Private notes visible only to your team</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={notes || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add notes about this lead... (e.g., follow-up needed, special requirements, etc.)"
          disabled={isLoading}
          rows={8}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {(notes || '').length} characters
        </div>
      </div>

      {isLoading && (
        <div className="mt-3 flex items-center gap-2 text-primary text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          <span>Saving...</span>
        </div>
      )}
    </div>
  )
}

