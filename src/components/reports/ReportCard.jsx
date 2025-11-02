/**
 * ReportCard Component
 * KPI card displaying a metric with trend indicator
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function ReportCard({ title, value, subtitle, trend, icon: Icon }) {
  const isPositive = trend > 0
  const isNegative = trend < 0
  const isNeutral = trend === 0

  const trendColor = isPositive 
    ? 'text-green-400' 
    : isNegative 
    ? 'text-red-400' 
    : 'text-gray-400'

  const borderColor = isPositive
    ? 'border-green-500/30'
    : isNegative
    ? 'border-red-500/30'
    : 'border-gray-500/30'

  return (
    <div className={`glass-card-premium p-6 hover:scale-[1.02] transition-all duration-300 animate-fadeInUp group ${borderColor} border-2`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
          {title}
        </h3>
        {Icon && (
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className="text-4xl font-extrabold text-white leading-tight">
          {typeof value === 'number' && value > 1000000 
            ? `$${(value / 1000000).toFixed(1)}M`
            : typeof value === 'number' && value > 1000
            ? `$${(value / 1000).toFixed(1)}K`
            : typeof value === 'number'
            ? value.toLocaleString()
            : value
          }
        </p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-gray-400 mb-3">{subtitle}</p>
      )}

      {/* Trend */}
      <div className={`flex items-center gap-2 ${trendColor}`}>
        {isPositive && <TrendingUp className="w-4 h-4" />}
        {isNegative && <TrendingDown className="w-4 h-4" />}
        {isNeutral && <Minus className="w-4 h-4" />}
        <span className="text-sm font-bold">
          {isPositive && '+'}
          {Math.abs(trend)}%
        </span>
      </div>
    </div>
  )
}

