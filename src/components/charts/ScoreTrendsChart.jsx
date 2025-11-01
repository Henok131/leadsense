import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { getScoreGradient } from '../../lib/helpers'

export default function ScoreTrendsChart({ data, currentMonth }) {
  // Calculate average score for gradient selection
  const avgScore = data && data.length > 0
    ? Math.round(data.reduce((sum, item) => sum + (item.score || 0), 0) / data.length)
    : 50
  
  const scoreGradient = getScoreGradient(avgScore)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const tooltipGradient = getScoreGradient(value)
      return (
        <div className="glass-card-premium p-4 border border-white/20 shadow-xl drop-shadow-lg" style={{ boxShadow: `0 10px 40px ${tooltipGradient.color}30` }}>
          <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">{payload[0].payload.month}</p>
          <p className="text-4xl font-extrabold drop-shadow-sm mb-1" style={{ color: tooltipGradient.color }}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Average Score</p>
        </div>
      )
    }
    return null
  }

  // Create unique gradient ID
  const gradientId = `scoreGradient-${scoreGradient.color.replace('#', '')}`

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 15, left: 5, bottom: 10 }}
        >
          <defs>
            {/* Gradient fill based on score */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={scoreGradient.color} stopOpacity={0.4} />
              <stop offset="50%" stopColor={scoreGradient.color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={scoreGradient.color} stopOpacity={0} />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id={`glow-${scoreGradient.color.replace('#', '')}`}>
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
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
            horizontal={true}
            vertical={false}
            fill="#ffffff05"
          />
          
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tick={{ fill: '#9ca3af' }}
            axisLine={{ stroke: '#ffffff10' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tick={{ fill: '#9ca3af' }}
            domain={[0, 100]}
            axisLine={{ stroke: '#ffffff10' }}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Area fill with gradient */}
          <Area
            type="monotone"
            dataKey="score"
            fill={`url(#${gradientId})`}
            stroke="none"
          />
          
          {/* Line with glow */}
          <Line
            type="monotone"
            dataKey="score"
            stroke={scoreGradient.color}
            strokeWidth={2.5}
            dot={{ fill: scoreGradient.color, r: 3.5, strokeWidth: 2, stroke: '#0a0a20' }}
            activeDot={{ r: 6, fill: scoreGradient.color, strokeWidth: 2, stroke: '#ffffff20' }}
            animationDuration={1000}
            filter={`url(#glow-${scoreGradient.color.replace('#', '')})`}
          />
        </LineChart>
      </ResponsiveContainer>
      {currentMonth && (
        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <TrendingUp className="w-4 h-4" style={{ color: scoreGradient.color }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: scoreGradient.color }}>Current Month</span>
        </div>
      )}
    </div>
  )
}

