import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getScoreGradient } from '../../lib/helpers'

export default function ScoreGauge({ score = 0, label = 'Average Lead Score' }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const duration = 1000 // 1 second animation
    const steps = 60
    const increment = score / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(increment * step, score)
      setAnimatedScore(Math.round(current))
      
      if (step >= steps) {
        clearInterval(timer)
        setAnimatedScore(score)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const scoreGradient = getScoreGradient(animatedScore)
  const scoreColor = {
    color: scoreGradient.color,
    bg: `${scoreGradient.from.replace('from-', 'bg-')}/20`,
    text: `${scoreGradient.from.replace('from-', 'text-')}`,
    status: animatedScore >= 80 ? 'Excellent' : animatedScore >= 60 ? 'Good' : animatedScore >= 40 ? 'Fair' : animatedScore >= 20 ? 'Low' : 'Very Low'
  }
  const percentage = Math.min((animatedScore / 100) * 100, 100)
  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative">
        <svg width="220" height="220" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r="90"
            stroke="#ffffff20"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id={`gaugeGradient-${scoreGradient.color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={scoreGradient.color} stopOpacity={1} />
              <stop offset="100%" stopColor={scoreGradient.color} stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <circle
            cx="110"
            cy="110"
            r="90"
            stroke={`url(#gaugeGradient-${scoreGradient.color.replace('#', '')})`}
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 12px ${scoreColor.color}50)` }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-extrabold text-white mb-2 tracking-tight">{animatedScore}</div>
          <div className={`text-sm font-bold uppercase tracking-wider ${scoreColor.text} px-3 py-1 rounded-lg ${scoreColor.bg} shadow-lg`}>
            {scoreColor.status}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{label}</p>
        <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          {score >= 70 ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : score >= 30 ? (
            <Minus className="w-5 h-5 text-yellow-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
          <span className={`text-sm font-bold uppercase tracking-wider ${scoreColor.text}`}>
            {score >= 70 ? 'Excellent' : score >= 30 ? 'Moderate' : 'Needs Attention'}
          </span>
        </div>
      </div>
    </div>
  )
}

