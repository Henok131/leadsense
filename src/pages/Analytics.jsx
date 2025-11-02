import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Download, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import ChartCard from '../components/ui/ChartCard'
import ScoreTrendsChart from '../components/charts/ScoreTrendsChart'
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart'
import ScoreGauge from '../components/charts/ScoreGauge'
import TagFrequencyChart from '../components/charts/TagFrequencyChart'

export default function Analytics() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tagFilter, setTagFilter] = useState('30')

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLeads()
    
    // Real-time simulation: Update every 10 seconds
    const interval = setInterval(() => {
      fetchLeads()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Generate score trends data (last 12 months)
  const scoreTrendsData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const currentMonthIndex = now.getMonth()
    
    return months.map((month, index) => {
      // Calculate average score for leads created in this month
      const monthStart = new Date(now.getFullYear(), index, 1)
      const monthEnd = new Date(now.getFullYear(), index + 1, 0)
      
      const monthLeads = leads.filter(lead => {
        if (!lead.created_at) return false
        const leadDate = new Date(lead.created_at)
        return leadDate >= monthStart && leadDate <= monthEnd
      })
      
      const avgScore = monthLeads.length > 0
        ? Math.round(monthLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / monthLeads.length)
        : 0

      return {
        month,
        score: avgScore || Math.floor(Math.random() * 40) + 30, // Fallback to mock data if no real data
      }
    })
  }, [leads])

  // Category breakdown data
  const categoryBreakdownData = useMemo(() => {
    const categories = ['Hot', 'Warm', 'Cold']
    return categories.map(category => {
      const categoryLeads = leads.filter(lead => lead.category === category)
      const count = categoryLeads.length
      const total = leads.length || 1
      const percentage = Math.round((count / total) * 100)
      
      return {
        name: category,
        value: count,
        percentage: percentage || 0,
      }
    }).filter(item => item.value > 0)
  }, [leads])

  // Average lead score
  const averageScore = useMemo(() => {
    if (leads.length === 0) return 0
    const totalScore = leads.reduce((sum, lead) => sum + (lead.score || 0), 0)
    return Math.round(totalScore / leads.length)
  }, [leads])

  // Top 5 tags frequency
  const tagFrequencyData = useMemo(() => {
    const tagCounts = {}
    
    leads.forEach(lead => {
      if (lead.tags && Array.isArray(lead.tags)) {
        lead.tags.forEach(tag => {
          if (tag && tag.trim()) {
            const normalizedTag = tag.trim().toLowerCase()
            tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1
          }
        })
      }
    })
    
    // Convert to array and sort by count
    const tagArray = Object.entries(tagCounts)
      .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    // If no tags, return mock data
    if (tagArray.length === 0) {
      return [
        { name: 'Enterprise', count: 45 },
        { name: 'SMB', count: 32 },
        { name: 'Urgent', count: 28 },
        { name: 'Follow-up', count: 19 },
        { name: 'Trial', count: 12 },
      ]
    }
    
    return tagArray
  }, [leads, tagFilter])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchLeads()
  }

  // Export all chart data to CSV
  const downloadInsights = () => {
    // Escape CSV values (handle commas, quotes, newlines)
    const escapeCSV = (value) => {
      if (value === null || value === undefined || value === '') return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    // Build CSV content with multiple sections
    const csvSections = []

    // Section 1: Score Trends
    csvSections.push('Score Trends,')
    csvSections.push('Month,Average Score')
    scoreTrendsData.forEach(item => {
      csvSections.push(`${escapeCSV(item.month)},${escapeCSV(item.score)}`)
    })
    csvSections.push('') // Empty line separator

    // Section 2: Category Breakdown
    csvSections.push('Category Breakdown,')
    csvSections.push('Category,Count,Percentage')
    categoryBreakdownData.forEach(item => {
      csvSections.push(`${escapeCSV(item.name)},${escapeCSV(item.value)},${escapeCSV(item.percentage)}%`)
    })
    csvSections.push('') // Empty line separator

    // Section 3: Average Lead Score
    csvSections.push('Average Lead Score,')
    csvSections.push('Score')
    csvSections.push(`${escapeCSV(averageScore)}`)
    csvSections.push('') // Empty line separator

    // Section 4: Top Tags
    csvSections.push('Top Tags,')
    csvSections.push('Tag,Frequency')
    tagFrequencyData.forEach(item => {
      csvSections.push(`${escapeCSV(item.name)},${escapeCSV(item.count)}`)
    })

    const csvContent = csvSections.join('\n')

    // Generate filename: analytics_export_YYYY-MM-DD.csv
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const filename = `analytics_export_${year}-${month}-${day}.csv`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
            <h1 className="text-5xl font-extrabold gradient-text tracking-tight mb-3">AI Insights</h1>
            <p className="text-muted-foreground text-lg font-medium">
              Get real-time insights and recommendations powered by AI.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadInsights}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 font-semibold text-sm"
            >
              <Download className="w-5 h-5" />
              Download Insights
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Generate Insights
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Score Trends - Line Chart */}
        <ChartCard
          title="Lead Score Trends"
          subtitle="Average lead score over time"
          className="md:col-span-2"
          style={{ animationDelay: '0s' }}
        >
          <ScoreTrendsChart
            data={scoreTrendsData}
            currentMonth={new Date().toLocaleString('default', { month: 'short' })}
          />
        </ChartCard>

        {/* Category Breakdown - Pie Chart */}
        <ChartCard
          title="Lead Category Breakdown"
          subtitle="Distribution of lead categories"
          style={{ animationDelay: '0.1s' }}
        >
          <CategoryBreakdownChart data={categoryBreakdownData} />
        </ChartCard>

        {/* Average Lead Score - Radial Gauge */}
        <ChartCard
          title="Average Lead Score"
          subtitle="Overall lead quality indicator"
          style={{ animationDelay: '0.2s' }}
        >
          <ScoreGauge score={averageScore} />
        </ChartCard>
      </div>

      {/* Top 5 Tags - Bar Chart */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          title="Top 5 Tags"
          subtitle="Most frequently used tags across leads"
          style={{ animationDelay: '0.3s' }}
        >
          <TagFrequencyChart
            data={tagFrequencyData}
            onFilterChange={setTagFilter}
          />
        </ChartCard>
      </div>
      </div>
    </div>
  )
}

