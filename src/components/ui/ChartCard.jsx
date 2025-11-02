export default function ChartCard({ title, subtitle, children, className = '', style }) {
  return (
    <div 
      className={`glass-card-premium p-8 animate-fadeInUp hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 ${className}`}
      style={style}
    >
      <div className="mb-6">
        {title && (
          <h3 className="text-3xl font-extrabold tracking-tight text-white mb-2">{title}</h3>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{subtitle}</p>
        )}
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

