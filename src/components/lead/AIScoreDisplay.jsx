/**
 * AIScoreDisplay Component
 * Displays AI score with confidence bar and explanation tooltip
 */

import { useState } from 'react'
import { Sparkles, Info, TrendingUp } from 'lucide-react'
import { getScoreGradient } from '../../lib/helpers'

export default function AIScoreDisplay({ aiScore, aiReason, isLoading = false }) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (isLoading) {
    return (
      <div className="glass-card-premium p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
            <div className="h-2 bg-white/5 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!aiScore && aiScore !== 0) {
    return (
      <div className="glass-card-premium p-4 border border-white/10">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm">AI score not available</span>
        </div>
      </div>
    )
  }

  const gradient = getScoreGradient(aiScore)
  const scorePercentage = Math.round(aiScore)

  return (
    <div className="glass-card-premium p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">AI Score</h3>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="relative"
            aria-label="Show explanation"
          >
            <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-2xl font-extrabold" style={{ color: gradient.color }}>
            {scorePercentage}
          </span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${scorePercentage}%`,
            background: gradient.gradient,
            boxShadow: `0 0 10px ${gradient.color}40`,
          }}
        />
      </div>

      {/* Tooltip with Reason */}
      {showTooltip && aiReason && (
        <div className="absolute top-full left-0 right-0 mt-2 z-10 glass-card-premium p-3 border border-primary/30 shadow-lg animate-fadeIn">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-white mb-1">AI Explanation</p>
              <p className="text-xs text-gray-300 leading-relaxed">{aiReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Inline Reason (for mobile) */}
      {!showTooltip && aiReason && (
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          <span className="font-semibold text-white">Why:</span> {aiReason}
        </p>
      )}

      {/* Score Category Badge */}
      <div className="flex items-center gap-2 mt-3">
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
          scorePercentage >= 81 ? 'bg-green-500/20 text-green-400' :
          scorePercentage >= 61 ? 'bg-yellow-500/20 text-yellow-400' :
          scorePercentage >= 31 ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {scorePercentage >= 81 ? 'Very Hot' :
           scorePercentage >= 61 ? 'Hot' :
           scorePercentage >= 31 ? 'Warm' : 'Cold'}
        </span>
        {scorePercentage >= 61 && (
          <span className="text-xs text-muted-foreground">High priority lead</span>
        )}
      </div>
    </div>
  )
}

