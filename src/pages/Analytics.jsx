/**
 * Analytics Page - AI Insights
 * Real-time analytics with score trends, category breakdown, score gauge, and tag frequency charts
 */

import { useState, useEffect } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import ScoreTrendsChart from '../components/charts/ScoreTrendsChart'
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart'
import ScoreGauge from '../components/charts/ScoreGauge'
import TagFrequencyChart from '../components/charts/TagFrequencyChart'

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [scoreTrends, setScoreTrends] = useState([])
  const [categoryBreakdown, setCategoryBreakdown] = useState([])
  const [averageScore, setAverageScore] = useState(0)
  const [tagFrequency, setTagFrequency] = useState([])

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')

      if (error) {
        console.error('Error fetching leads:', error)
        // Use mock data on error
        loadMockData()
        return
      }

      const leads = data || []

      // Calculate score trends (last 12 months)
      const monthlyScores = {}
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthlyScores[key] = {
          month: date.toLocaleString('default', { month: 'short' }),
          score: 0,
          count: 0,
        }
      }

      leads.forEach(lead => {
        if (lead.score && lead.created_at) {
          const date = new Date(lead.created_at)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          if (monthlyScores[key]) {
            monthlyScores[key].score += lead.score
            monthlyScores[key].count += 1
          }
        }
      })

      const trendsData = Object.values(monthlyScores).map(item => ({
        month: item.month,
        score: item.count > 0 ? Math.round(item.score / item.count) : 0,
      }))
      setScoreTrends(trendsData)

      // Calculate category breakdown
      const categoryCounts = { Hot: 0, Warm: 0, Cold: 0 }
      leads.forEach(lead => {
        if (lead.category && categoryCounts.hasOwnProperty(lead.category)) {
          categoryCounts[lead.category]++
        } else {
          categoryCounts.Cold++
        }
      })

      const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0)
      setCategoryBreakdown([
        { name: 'Hot', value: categoryCounts.Hot, percentage: total > 0 ? Math.round((categoryCounts.Hot / total) * 100) : 0 },
        { name: 'Warm', value: categoryCounts.Warm, percentage: total > 0 ? Math.round((categoryCounts.Warm / total) * 100) : 0 },
        { name: 'Cold', value: categoryCounts.Cold, percentage: total > 0 ? Math.round((categoryCounts.Cold / total) * 100) : 0 },
      ])

      // Calculate average score
      const scores = leads.filter(l => l.score !== null && l.score !== undefined).map(l => l.score)
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      setAverageScore(avg)

      // Calculate tag frequency
      const tagMap = {}
      leads.forEach(lead => {
        if (lead.tags) {
          const tags = Array.isArray(lead.tags) ? lead.tags : [lead.tags]
          tags.forEach(tag => {
            if (tag && typeof tag === 'string') {
              tagMap[tag] = (tagMap[tag] || 0) + 1
            }
          })
        }
      })

      const tagData = Object.entries(tagMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
      setTagFrequency(tagData)

      setLoading(false)
      setRefreshing(false)
    } catch (error) {
      console.error('Error in fetchAnalytics:', error)
      loadMockData()
    }
  }

  // Load mock data as fallback
  const loadMockData = () => {
    setScoreTrends([
      { month: 'Jan', score: 65 },
      { month: 'Feb', score: 68 },
      { month: 'Mar', score: 72 },
      { month: 'Apr', score: 70 },
      { month: 'May', score: 75 },
      { month: 'Jun', score: 73 },
    ])
    setCategoryBreakdown([
      { name: 'Hot', value: 45, percentage: 30 },
      { name: 'Warm', value: 75, percentage: 50 },
      { name: 'Cold', value: 30, percentage: 20 },
    ])
    setAverageScore(72)
    setTagFrequency([
      { name: 'high-intent', count: 120 },
      { name: 'enterprise', count: 85 },
      { name: 'urgent', count: 65 },
      { name: 'budget-approved', count: 45 },
      { name: 'decision-ready', count: 35 },
    ])
    setLoading(false)
    setRefreshing(false)
  }

  // Initial load
  useEffect(() => {
    fetchAnalytics()
  }, [])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Manual refresh
  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-5xl font-extrabold gradient-text">AI Insights</h1>
            </div>
            <p className="text-gray-400 text-lg">Get real-time insights and recommendations powered by AI.</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg text-white font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Generate Insights</span>
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="glass-card-premium p-12 text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        ) : (
          /* Charts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Trends - Full Width */}
            <div className="md:col-span-2 glass-card-premium p-6 animate-fadeInUp">
              <h2 className="text-xl font-bold text-white mb-4">Score Trends</h2>
              <ScoreTrendsChart data={scoreTrends} currentMonth={new Date().getMonth()} />
            </div>

            {/* Category Breakdown */}
            <div className="glass-card-premium p-6 animate-fadeInUp">
              <h2 className="text-xl font-bold text-white mb-4">Category Breakdown</h2>
              <CategoryBreakdownChart data={categoryBreakdown} />
            </div>

            {/* Score Gauge */}
            <div className="glass-card-premium p-6 animate-fadeInUp">
              <h2 className="text-xl font-bold text-white mb-4">Average Lead Score</h2>
              <ScoreGauge score={averageScore} />
            </div>

            {/* Top 5 Tags - Full Width */}
            <div className="md:col-span-2 glass-card-premium p-6 animate-fadeInUp">
              <h2 className="text-xl font-bold text-white mb-4">Top 5 Tags</h2>
              <TagFrequencyChart data={tagFrequency} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
