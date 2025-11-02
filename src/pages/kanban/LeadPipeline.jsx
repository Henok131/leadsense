/**
 * LeadPipeline Page - Rebuilt from scratch
 * Simple Kanban board for lead management
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react'

const COLUMNS = [
  { id: 'new', title: 'New', status: 'New', color: 'blue' },
  { id: 'review', title: 'In Review', status: 'In Review', color: 'yellow' },
  { id: 'contacted', title: 'Contacted', status: 'Contacted', color: 'purple' },
  { id: 'converted', title: 'Converted', status: 'Converted', color: 'green' },
]

export default function LeadPipeline() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState([])

  useEffect(() => {
    // Simulate loading leads
    setTimeout(() => {
      setLeads([
        { id: 1, name: 'Acme Corp', status: 'New', score: 85 },
        { id: 2, name: 'Tech Solutions', status: 'In Review', score: 72 },
        { id: 3, name: 'Global Inc', status: 'Contacted', score: 90 },
        { id: 4, name: 'Startup Co', status: 'New', score: 65 },
        { id: 5, name: 'Enterprise Ltd', status: 'Converted', score: 95 },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getLeadsByStatus = (status) => {
    return leads.filter(lead => lead.status === status)
  }

  const getColumnCounts = () => {
    const counts = {}
    COLUMNS.forEach(col => {
      counts[col.status] = getLeadsByStatus(col.status).length
    })
    return counts
  }

  const counts = getColumnCounts()

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
                Lead Pipeline
              </h1>
              <p className="text-muted-foreground">
                Drag and drop leads to change their status
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

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <div className="glass-card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total</h3>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{leads.length}</p>
            </div>

            <div className="glass-card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">New</h3>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-blue-400">{counts.New || 0}</p>
            </div>

            <div className="glass-card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Review</h3>
                <Briefcase className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-3xl font-extrabold text-yellow-400">{counts['In Review'] || 0}</p>
            </div>

            <div className="glass-card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Contacted</h3>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-extrabold text-purple-400">{counts.Contacted || 0}</p>
            </div>

            <div className="glass-card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Converted</h3>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-3xl font-extrabold text-green-400">{counts.Converted || 0}</p>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => {
            const columnLeads = getLeadsByStatus(column.status)
            const colorClasses = {
              blue: 'border-blue-500/30 bg-blue-500/5',
              yellow: 'border-yellow-500/30 bg-yellow-500/5',
              purple: 'border-purple-500/30 bg-purple-500/5',
              green: 'border-green-500/30 bg-green-500/5',
            }

            return (
              <div
                key={column.id}
                className={`glass-card-premium p-4 border-2 ${colorClasses[column.color]}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{column.title}</h3>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-white font-semibold">
                    {columnLeads.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="glass-card p-4 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{lead.name}</h4>
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">
                          {lead.score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Lead #{lead.id}</p>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
