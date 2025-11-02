export function getBadgeColor(category) {
  switch (category) {
    case 'Hot':
      return 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20'
    case 'Warm':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-lg shadow-yellow-500/20'
    case 'Cold':
    default:
      return 'bg-gray-500/20 text-gray-300 border border-gray-500/30 shadow-lg shadow-gray-500/10'
  }
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString()
}

/**
 * Get gradient classes based on score value
 * @param {number} score - Score value (0-100)
 * @returns {object} Object with gradient classes and colors
 */
export function getScoreGradient(score) {
  if (score >= 80) {
    // Very High Score: green to emerald
    return {
      from: 'from-green-400',
      to: 'to-emerald-500',
      border: 'border-green-400/50',
      shadow: 'shadow-green-500/30',
      bgGradient: 'from-green-400 to-emerald-500',
      color: '#10b981' // emerald-500
    }
  } else if (score >= 60) {
    // High Score: cyan to blue
    return {
      from: 'from-cyan-400',
      to: 'to-blue-500',
      border: 'border-cyan-400/50',
      shadow: 'shadow-cyan-500/30',
      bgGradient: 'from-cyan-400 to-blue-500',
      color: '#3b82f6' // blue-500
    }
  } else if (score >= 40) {
    // Moderate Score: yellow to amber
    return {
      from: 'from-yellow-300',
      to: 'to-amber-400',
      border: 'border-yellow-400/50',
      shadow: 'shadow-yellow-500/30',
      bgGradient: 'from-yellow-300 to-amber-400',
      color: '#f59e0b' // amber-500
    }
  } else if (score >= 20) {
    // Low Score: orange to red
    return {
      from: 'from-orange-400',
      to: 'to-red-400',
      border: 'border-orange-400/50',
      shadow: 'shadow-orange-500/30',
      bgGradient: 'from-orange-400 to-red-400',
      color: '#ef4444' // red-500
    }
  } else {
    // Very Low Score: red to pink
    return {
      from: 'from-red-500',
      to: 'to-pink-500',
      border: 'border-red-500/50',
      shadow: 'shadow-red-500/30',
      bgGradient: 'from-red-500 to-pink-500',
      color: '#ec4899' // pink-500
    }
  }
}

