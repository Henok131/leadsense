/**
 * Analytics Page - Rebuilt from scratch
 * Simple, working version with basic analytics
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Download, Sparkles } from 'lucide-react'

export default function Analytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    averageScore: 0,
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
  })

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setAnalytics({
        averageScore: 72,
        totalLeads: 1247,
        hotLeads: 312,
        warmLeads: 498,
        coldLeads: 437,
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-20 pb-8 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-all duration-200 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-extrabold gradient-text tracking-tight mb-3">
                AI Insights
              </h1>
              <p className="text-muted-foreground text-lg font-medium">
                Get real-time insights and recommendations powered by AI.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20">
                <Download className="w-5 h-5" />
                Download Insights
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200 font-semibold text-sm shadow-lg shadow-primary/30">
                <RefreshCw className="w-5 h-5" />
                Generate Insights
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Average Score */}
          <div className="glass-card-premium p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Average Lead Score</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-white/10"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(analytics.averageScore / 100) * 352} 352`}
                    className="transition-all duration-500"
                  />
                </svg>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#78c8ff" />
                    <stop offset="50%" stopColor="#8aa3ff" />
                    <stop offset="100%" stopColor="#b084ff" />
                  </linearGradient>
                </defs>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{analytics.averageScore}</span>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-400">Out of 100</p>
          </div>

          {/* Lead Categories */}
          <div className="glass-card-premium p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Lead Categories</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-red-400">{analytics.hotLeads}</div>
                  <div className="text-sm text-gray-400">Hot Leads</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{analytics.warmLeads}</div>
                  <div className="text-sm text-gray-400">Warm Leads</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{analytics.coldLeads}</div>
                  <div className="text-sm text-gray-400">Cold Leads</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="glass-card-premium p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Leads</div>
              <div className="text-2xl font-bold text-white">{analytics.totalLeads.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Average Score</div>
              <div className="text-2xl font-bold text-white">{analytics.averageScore}/100</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Quality Ratio</div>
              <div className="text-2xl font-bold text-white">
                {Math.round((analytics.hotLeads / analytics.totalLeads) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
