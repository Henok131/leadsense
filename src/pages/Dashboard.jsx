import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Search,
  Download,
  Calendar,
  Flame,
  RefreshCw,
  X
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { getBadgeColor, getScoreGradient } from '../lib/helpers'
import LeadDetailModal from '../components/LeadDetailModal'
import Sparkline from '../components/ui/Sparkline'

export default function Dashboard() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)

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
    }
  }

  useEffect(() => {
    fetchLeads()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLeads()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Calculate stats with trend data
  const stats = useMemo(() => {
    const total = leads.length
    const hotLeads = leads.filter(lead => lead.category === 'Hot').length
    const averageScore = total > 0 
      ? Math.round(leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / total)
      : 0
    
    // Calculate today's leads
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayLeads = leads.filter(lead => {
      const leadDate = new Date(lead.created_at)
      leadDate.setHours(0, 0, 0, 0)
      return leadDate.getTime() === today.getTime()
    }).length

    // Calculate trend data for sparklines (last 7 days)
    const trendData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayLeads = leads.filter(lead => {
        if (!lead.created_at) return false
        const leadDate = new Date(lead.created_at)
        leadDate.setHours(0, 0, 0, 0)
        return leadDate.getTime() === date.getTime()
      })
      
      trendData.push(dayLeads.length)
    }

    // Calculate percentage change (today vs yesterday)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayLeads = leads.filter(lead => {
      if (!lead.created_at) return false
      const leadDate = new Date(lead.created_at)
      leadDate.setHours(0, 0, 0, 0)
      return leadDate.getTime() === yesterday.getTime()
    }).length

    const previousWeekLeads = trendData.slice(0, 6).reduce((sum, val) => sum + val, 0)
    const lastWeekLeads = trendData.slice(1).reduce((sum, val) => sum + val, 0)
    
    const totalChange = previousWeekLeads > 0 
      ? Math.round(((total - previousWeekLeads) / previousWeekLeads) * 100)
      : 0
    
    const todayChange = yesterdayLeads > 0
      ? Math.round(((todayLeads - yesterdayLeads) / yesterdayLeads) * 100)
      : todayLeads > 0 ? 100 : 0

    return {
      total,
      averageScore,
      hotLeadsPercent: total > 0 ? Math.round((hotLeads / total) * 100) : 0,
      todayLeads,
      totalTrend: trendData,
      todayChange,
      totalChange
    }
  }, [leads])

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    let result = leads

    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(lead => lead.category === categoryFilter)
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(lead => 
        lead.name?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.company?.toLowerCase().includes(query)
      )
    }

    return result
  }, [leads, categoryFilter, searchQuery])

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  // Format tags as comma-separated string
  const formatTags = (tags) => {
    if (!tags) return null
    if (Array.isArray(tags)) {
      const validTags = tags.filter(tag => tag && typeof tag === 'string' && tag.trim())
      return validTags.length > 0 ? validTags.join(', ') : null
    }
    // Handle non-array tags (shouldn't happen, but graceful fallback)
    return typeof tags === 'string' ? tags : null
  }

  // Export to CSV
  const downloadCSV = () => {
    // Use all leads from Supabase (not just filtered)
    const headers = ['Name', 'Email', 'Score', 'Category', 'Tags', 'Date']
    const rows = leads.map(lead => [
      lead.name || '',
      lead.email || '',
      lead.score ?? '',
      lead.category || '',
      formatTags(lead.tags) || '',
      formatDate(lead.created_at) || ''
    ])

    // Escape CSV values (handle commas, quotes, newlines)
    const escapeCSV = (value) => {
      if (value === null || value === undefined || value === '') return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n')

    // Generate filename: leads-YYYYMMDD.csv
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const filename = `leads-${year}${month}${day}.csv`

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

  return (
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
            <h1 className="text-5xl font-extrabold gradient-text tracking-tight">Dashboard</h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {/* Total Leads Card */}
          <div 
            className="relative glass-card-premium p-4 hover:scale-[1.02] transition-all duration-300 animate-fadeInUp group overflow-hidden"
            style={{ 
              animationDelay: '0s',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.15)'
            }}
          >
            {/* Gradient Border Ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-[#0e0e2e]/80 via-[#0a0a20]/60 to-[#050510]/40 backdrop-blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Total Leads</h3>
                <div className="p-1.5 rounded-lg bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors">
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <p className="text-5xl font-extrabold drop-shadow-sm text-white mb-2 tracking-tight">{stats.total}</p>
              
              {/* Sparkline */}
              <div className="mb-2 h-[24px] flex items-center">
                <Sparkline 
                  data={stats.totalTrend || []} 
                  color="#06b6d4" 
                  width={80} 
                  height={24}
                />
              </div>
              
              {/* Percentage Tag */}
              {stats.totalChange !== 0 && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                  stats.totalChange > 0 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/20' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20'
                }`}>
                  {stats.totalChange > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(stats.totalChange)}%</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Hot Leads Card */}
          <div 
            className="relative glass-card-premium p-4 hover:scale-[1.02] transition-all duration-300 animate-fadeInUp group overflow-hidden"
            style={{ 
              animationDelay: '0.1s',
              boxShadow: '0 10px 40px rgba(239, 68, 68, 0.15)'
            }}
          >
            {/* Gradient Border Ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-[#0e0e2e]/80 via-[#0a0a20]/60 to-[#050510]/40 backdrop-blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Hot Leads</h3>
                <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
              </div>
              <p className="text-5xl font-extrabold drop-shadow-sm text-white mb-2 tracking-tight">{stats.hotLeadsPercent}%</p>
              
              {/* Sparkline */}
              <div className="mb-2 h-[24px] flex items-center">
                <Sparkline 
                  data={stats.totalTrend?.map((_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - (6 - i))
                    date.setHours(0, 0, 0, 0)
                    return leads.filter(lead => {
                      if (!lead.created_at || lead.category !== 'Hot') return false
                      const leadDate = new Date(lead.created_at)
                      leadDate.setHours(0, 0, 0, 0)
                      return leadDate.getTime() <= date.getTime()
                    }).length
                  }) || []} 
                  color="#ef4444" 
                  width={80} 
                  height={24}
                />
              </div>
              
              {/* Percentage Tag */}
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20">
                <span>Hot</span>
              </div>
            </div>
          </div>
          
          {/* Avg Score Card */}
          {(() => {
            const scoreGradient = getScoreGradient(stats.averageScore)
            return (
              <div 
                className="relative glass-card-premium p-4 hover:scale-[1.02] transition-all duration-300 animate-fadeInUp group overflow-hidden"
                style={{ 
                  animationDelay: '0.2s',
                  boxShadow: `0 10px 40px ${scoreGradient.shadow.replace('shadow-', '').replace('/30', '')}20`
                }}
              >
                {/* Gradient Border Ring */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${scoreGradient.from}/20 ${scoreGradient.to}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-[#0e0e2e]/80 via-[#0a0a20]/60 to-[#050510]/40 backdrop-blur-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Avg Score</h3>
                    <div className={`p-1.5 rounded-lg ${scoreGradient.from}/10 group-hover:${scoreGradient.from}/20 transition-colors`}>
                      <BarChart3 className={`w-4 h-4 ${scoreGradient.from.replace('from-', 'text-')}`} style={{ color: scoreGradient.color }} />
                    </div>
                  </div>
                  <p className="text-5xl font-extrabold drop-shadow-sm text-white mb-2 tracking-tight" style={{ background: `linear-gradient(to right, ${scoreGradient.color}, ${scoreGradient.color})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stats.averageScore}</p>
                  
                  {/* Sparkline */}
                  <div className="mb-2 h-[24px] flex items-center">
                    <Sparkline 
                      data={(() => {
                        const trend = []
                        for (let i = 6; i >= 0; i--) {
                          const date = new Date()
                          date.setDate(date.getDate() - i)
                          date.setHours(0, 0, 0, 0)
                          const dayLeads = leads.filter(lead => {
                            if (!lead.created_at) return false
                            const leadDate = new Date(lead.created_at)
                            leadDate.setHours(0, 0, 0, 0)
                            return leadDate.getTime() === date.getTime()
                          })
                          const avgScore = dayLeads.length > 0
                            ? Math.round(dayLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / dayLeads.length)
                            : 0
                          trend.push(avgScore)
                        }
                        return trend
                      })()} 
                      color={scoreGradient.color} 
                      width={80} 
                      height={24}
                    />
                  </div>
                  
                  {/* Quality Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${scoreGradient.border.replace('border-', 'border-')} ${scoreGradient.shadow}`} style={{ 
                    background: `linear-gradient(to right, ${scoreGradient.color}20, ${scoreGradient.color}10)`,
                    color: scoreGradient.color,
                    borderColor: `${scoreGradient.color}50`
                  }}>
                    <span>{stats.averageScore >= 80 ? 'Excellent' : stats.averageScore >= 60 ? 'Good' : stats.averageScore >= 40 ? 'Fair' : 'Low'}</span>
                  </div>
                </div>
              </div>
            )
          })()}
          
          {/* Today Card */}
          <div 
            className="relative glass-card-premium p-4 hover:scale-[1.02] transition-all duration-300 animate-fadeInUp group overflow-hidden"
            style={{ 
              animationDelay: '0.3s',
              boxShadow: '0 10px 40px rgba(139, 92, 246, 0.15)'
            }}
          >
            {/* Gradient Border Ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-[#0e0e2e]/80 via-[#0a0a20]/60 to-[#050510]/40 backdrop-blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Today</h3>
                <div className="p-1.5 rounded-lg bg-purple-400/10 group-hover:bg-purple-400/20 transition-colors">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <p className="text-5xl font-extrabold drop-shadow-sm text-white mb-2 tracking-tight">{stats.todayLeads}</p>
              
              {/* Sparkline */}
              <div className="mb-2 h-[24px] flex items-center">
                <Sparkline 
                  data={stats.totalTrend || []} 
                  color="#a855f7" 
                  width={80} 
                  height={24}
                />
              </div>
              
              {/* Percentage Tag */}
              {stats.todayChange !== 0 && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                  stats.todayChange > 0 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/20' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20'
                }`}>
                  {stats.todayChange > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(stats.todayChange)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8 animate-fadeInUp">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg shadow-black/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-3">
              {['All', 'Hot', 'Warm', 'Cold'].map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    categoryFilter === category
                      ? 'gradient-bg text-white shadow-lg shadow-primary/30 scale-105'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105 border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="glass-card p-8 animate-fadeInUp">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">Leads</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-all duration-200 font-semibold text-sm border border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
              >
                <Download className="w-5 h-5" />
                Download CSV
              </button>
              <button
                onClick={fetchLeads}
                className="flex items-center gap-2 px-5 py-2.5 text-muted-foreground hover:text-white transition-all duration-200 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <svg
                  className="w-12 h-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="mt-4 text-white text-xl font-bold mb-2">No leads found</p>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-muted-foreground font-bold text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-bold text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-bold text-xs uppercase tracking-wider">Company</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-bold text-xs uppercase tracking-wider">Score</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-bold text-xs uppercase tracking-wider">Category</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-bold text-xs uppercase tracking-wider">Tags</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-bold text-xs uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`border-b border-white/5 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent transition-all duration-200 cursor-pointer group ${
                        lead.category === 'Hot' ? 'bg-gradient-to-r from-red-500/10 to-transparent' : ''
                      }`}
                    >
                      <td className="py-5 px-6 font-semibold text-white group-hover:text-primary transition-colors">{lead.name || 'N/A'}</td>
                      <td className="py-5 px-6 text-gray-300 group-hover:text-white transition-colors">{lead.email || 'N/A'}</td>
                      <td className="py-5 px-6 text-gray-300 group-hover:text-white transition-colors">{lead.company || 'N/A'}</td>
                      <td className="py-5 px-6">
                        <span className="font-extrabold text-xl text-primary">{lead.score ?? '—'}</span>
                      </td>
                      <td className="py-5 px-6">
                        {lead.category ? (
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg ${getBadgeColor(lead.category)}`}>
                            {lead.category}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-gray-300 text-sm group-hover:text-white transition-colors">
                        {formatTags(lead.tags) || <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-5 px-6 text-muted-foreground text-sm group-hover:text-white transition-colors">
                        {lead.created_at ? formatDate(lead.created_at) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
          />
        )}
    </div>
  )
}
