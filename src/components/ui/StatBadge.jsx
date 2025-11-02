export default function StatBadge({ label, value, trend, color = 'primary', className = '' }) {
  const colorClasses = {
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    accent: 'bg-accent/20 text-accent',
    green: 'bg-green-500/20 text-green-400',
    red: 'bg-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[color] || colorClasses.primary} ${className}`}>
      {label && <span>{label}</span>}
      {value && <span className="font-bold">{value}</span>}
      {trend && (
        <span className="flex items-center gap-1">
          {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
  )
}

