/**
 * Simple SVG-based sparkline component for mini trend visualization
 * @param {Array<number>} data - Array of numeric values
 * @param {string} color - Line color (hex or CSS color)
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 */
export default function Sparkline({ data = [], color = '#3b82f6', width = 80, height = 30 }) {
  if (!data || data.length === 0) {
    // Return a flat line if no data
    return (
      <svg width={width} height={height} className="overflow-visible">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeWidth="1.5" opacity="0.3" />
      </svg>
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1 // Avoid division by zero
  
  // Normalize data points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return { x, y }
  })

  // Create path string
  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Gradient definition */}
      <defs>
        <linearGradient id={`sparklineGradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path
        d={`${pathD} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#sparklineGradient-${color.replace('#', '')})`}
        opacity="0.3"
      />
      
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-fadeIn"
      />
      
      {/* Active dot */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="2.5"
          fill={color}
          className="drop-shadow-sm"
        />
      )}
    </svg>
  )
}

