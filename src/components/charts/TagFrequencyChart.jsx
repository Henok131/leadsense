import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar } from 'lucide-react'
import { getScoreGradient } from '../../lib/helpers'

export default function TagFrequencyChart({ data, onFilterChange }) {
  const [filter, setFilter] = useState('30')

  const handleFilterChange = (days) => {
    setFilter(days)
    if (onFilterChange) {
      onFilterChange(days)
    }
  }

  // Calculate average frequency for gradient
  const avgFrequency = data && data.length > 0
    ? Math.round(data.reduce((sum, item) => sum + (item.count || 0), 0) / data.length)
    : 0
  
  // Map frequency to score (0-100) for gradient selection
  const maxCount = data && data.length > 0 ? Math.max(...data.map(d => d.count || 0)) : 1
  const scoreForGradient = Math.min(100, Math.round((avgFrequency / maxCount) * 100))
  const scoreGradient = getScoreGradient(scoreForGradient)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      // Map frequency to score for tooltip gradient
      const frequencyScore = Math.min(100, Math.round((value / maxCount) * 100))
      const tooltipGradient = getScoreGradient(frequencyScore)
      return (
        <div className="glass-card-premium p-4 border border-white/20 shadow-xl drop-shadow-lg" style={{ boxShadow: `0 10px 40px ${tooltipGradient.color}30` }}>
          <p className="text-xs font-bold text-white mb-2 uppercase tracking-widest">{payload[0].payload.name}</p>
          <p className="text-3xl font-extrabold drop-shadow-sm mb-1" style={{ color: tooltipGradient.color }}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">frequency</p>
        </div>
      )
    }
    return null
  }

  // Create unique gradient ID
  const gradientId = `barGradient-${scoreGradient.color.replace('#', '')}`

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Filter by period:</span>
        </div>
        <div className="flex gap-2">
          {['7', '30', '90'].map((days) => (
            <button
              key={days}
              onClick={() => handleFilterChange(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                filter === days
                  ? 'bg-white/10 text-white border border-white/20 shadow-lg shadow-white/10 scale-105'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10'
              }`}
            >
              Last {days} days
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 15, left: 70, bottom: 10 }}
        >
          <defs>
            {/* Score-based gradient */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={scoreGradient.color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={scoreGradient.color} stopOpacity={0.6} />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id={`barGlow-${scoreGradient.color.replace('#', '')}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Grid background with cells */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#ffffff10" 
            horizontal={false}
            vertical={true}
            fill="#ffffff05"
          />
          
          <XAxis 
            type="number" 
            stroke="#6b7280" 
            style={{ fontSize: '11px', fontWeight: 500 }}
            tick={{ fill: '#9ca3af' }}
            axisLine={{ stroke: '#ffffff10' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#6b7280"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tick={{ fill: '#9ca3af' }}
            width={65}
            axisLine={{ stroke: '#ffffff10' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill={`url(#${gradientId})`}
            radius={[0, 6, 6, 0]}
            animationDuration={1000}
            filter={`url(#barGlow-${scoreGradient.color.replace('#', '')})`}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

