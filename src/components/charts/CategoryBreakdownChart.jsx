import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { getBadgeColor } from '../../lib/helpers'

const COLORS = {
  Hot: '#EF4444',
  Warm: '#EAB308',
  Cold: '#6B7280',
}

export default function CategoryBreakdownChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const categoryColor = COLORS[data.name] || COLORS.Cold
      return (
        <div className="glass-card-premium p-4 border border-white/20 shadow-xl drop-shadow-lg" style={{ boxShadow: `0 10px 40px ${categoryColor}30` }}>
          <p className="text-xs font-bold text-white mb-2 uppercase tracking-widest">{data.name}</p>
          <p className="text-3xl font-extrabold drop-shadow-sm mb-1" style={{ color: categoryColor }}>
            {data.value}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">leads ({data.payload.percentage}%)</p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-bold drop-shadow-lg"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-full">
      <div className="text-center mb-4">
        <p className="text-4xl font-extrabold text-white mb-1 drop-shadow-sm">{total}</p>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Total Categories</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Cold} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-white text-sm font-semibold uppercase tracking-wide">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

