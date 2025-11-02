/**
 * Reports Page - Rebuilt from scratch
 * Simple, working version with basic reports
 */

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, TrendingUp, Users, DollarSign, Target, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Reports() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLeads: 0,
    conversionRate: 0,
    totalRevenue: 0,
    revenuePerLead: 0,
  })

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        totalLeads: 1247,
        conversionRate: 23.5,
        totalRevenue: 458000,
        revenuePerLead: 367,
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
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-all duration-200 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-extrabold gradient-text tracking-tight mb-3">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground">
                Real-time insights and revenue forecasting
              </p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 text-muted-foreground hover:text-white transition-all duration-200 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <div className="glass-card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-primary" />
                <span className="text-xs text-green-400">+12%</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">
                {stats.conversionRate}%
              </div>
              <div className="text-sm text-gray-400">Conversion Rate</div>
            </div>

            <div className="glass-card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-secondary" />
                <span className="text-xs text-blue-400">+8%</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">
                {stats.totalLeads.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Leads</div>
            </div>

            <div className="glass-card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-accent" />
                <span className="text-xs text-green-400">+25%</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">
                ${(stats.totalRevenue / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>

            <div className="glass-card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <span className="text-xs text-blue-400">+8%</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">
                ${stats.revenuePerLead}
              </div>
              <div className="text-sm text-gray-400">Revenue Per Lead</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="glass-card-premium p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Performance Trends</h2>
            <p className="text-gray-400">
              Detailed charts and analytics coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
