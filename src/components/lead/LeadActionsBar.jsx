/**
 * LeadActionsBar Component
 * Action buttons for lead management (Save, Cancel, Delete)
 */

import { Save, X, Trash2, Loader2 } from 'lucide-react'

export default function LeadActionsBar({ onSave, onCancel, onDelete, isLoading = false, hasChanges = false }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 via-white/[0.02] to-transparent border-t border-white/10 backdrop-blur-sm">
      {/* Left side - Delete button (if needed) */}
      <div>
        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent border border-red-500/20 hover:border-red-500/40"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        )}
      </div>

      {/* Right side - Cancel and Save buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
        >
          <X className="w-4 h-4" />
          <span className="text-sm font-semibold">Cancel</span>
        </button>

        <button
          onClick={onSave}
          disabled={isLoading || !hasChanges}
          className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-semibold">Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span className="text-sm font-semibold">Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Changes indicator */}
      {hasChanges && !isLoading && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
          Unsaved changes
        </div>
      )}
    </div>
  )
}

