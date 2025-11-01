import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Search,
  Download,
  MessageSquare,
  Calendar,
  Flame,
  RefreshCw,
  X
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { getBadgeColor } from '../lib/helpers'

export default function Dashboard() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [expandedRow, setExpandedRow] = useState(null)

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

  // Calculate stats
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

    return {
      total,
      averageScore,
      hotLeadsPercent: total > 0 ? Math.round((hotLeads / total) * 100) : 0,
      todayLeads
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

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Phone', 'Score', 'Category', 'Status', 'Date']
    const rows = filteredLeads.map(lead => [
      lead.name || '',
      lead.email || '',
      lead.company || '',
      lead.phone || '',
      lead.score || 0,
      lead.category || '',
      lead.status || '',
      formatDate(lead.created_at)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Leads</h3>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          
          <div className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">% Hot Leads</h3>
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">{stats.hotLeadsPercent}%</p>
          </div>
          
          <div className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Avg Score</h3>
              <BarChart3 className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold">{stats.averageScore}</p>
          </div>
          
          <div className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Today's Leads</h3>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.todayLeads}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              {['All', 'Hot', 'Warm', 'Cold'].map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    categoryFilter === category
                      ? 'gradient-bg text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Leads</h2>
            <button
              onClick={fetchLeads}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-white/5 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-48 w-48 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-gray-400 text-lg">No leads found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Company</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Score</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Category</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Tags</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <React.Fragment key={lead.id}>
                      <tr
                        onClick={() => setExpandedRow(expandedRow === lead.id ? null : lead.id)}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4 font-medium">{lead.name || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-300">{lead.email || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-300">{lead.company || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-lg">{lead.score || 0}</span>
                        </td>
                        <td className="py-4 px-4">
                          {lead.category ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(lead.category)}`}>
                              {lead.category}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {lead.tags && lead.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {lead.tags.slice(0, 2).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {lead.tags.length > 2 && (
                                <span className="text-xs text-gray-400">+{lead.tags.length - 2}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {lead.created_at ? formatDate(lead.created_at) : 'N/A'}
                        </td>
                      </tr>
                      {expandedRow === lead.id && (
                        <tr>
                          <td colSpan={7} className="py-6 px-4 bg-white/5">
                            <div className="flex items-start gap-4">
                              <MessageSquare className="w-5 h-5 text-primary mt-1" />
                              <div className="flex-1">
                                <h4 className="font-semibold mb-2">Message</h4>
                                <p className="text-gray-300 text-sm">{lead.message || 'No message provided'}</p>
                                {lead.interest_category && (
                                  <div className="mt-3">
                                    <span className="text-xs text-gray-400">Interest: </span>
                                    <span className="text-xs font-medium">{lead.interest_category}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  )
}
