/**
 * LeadPipeline Page
 * Kanban board for visualizing lead progression
 * Route: /pipeline
 */

import { useEffect, useState, useMemo } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { 
  ArrowLeft, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Briefcase,
  CheckCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LeadColumn from '../../components/kanban/LeadColumn'
import LeadCard from '../../components/kanban/LeadCard'
import { getLeadsByStatus, updateLeadStatus, subscribeLeads } from '../../lib/kanban'

const COLUMNS = [
  { id: 'New', title: 'New', status: 'New' },
  { id: 'In Review', title: 'In Review', status: 'In Review' },
  { id: 'Contacted', title: 'Contacted', status: 'Contacted' },
  { id: 'Converted', title: 'Converted', status: 'Converted' },
]

export default function LeadPipeline() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [draggingLead, setDraggingLead] = useState(null)

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads()
    
    // Subscribe to realtime updates
    const subscription = subscribeLeads((payload) => {
      console.log('📡 Realtime update:', payload.eventType)
      fetchLeads()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchLeads = async () => {
    try {
      const data = await getLeadsByStatus()
      setLeads(data || [])
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group leads by status
  const leadsByStatus = useMemo(() => {
    const grouped = {}
    COLUMNS.forEach(col => {
      grouped[col.status] = leads.filter(lead => lead.status === col.status)
    })
    return grouped
  }, [leads])

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setDraggingLead(null)
      return
    }

    const leadId = active.id
    const newStatus = over.id

    // Find the dragged lead
    const draggedLead = leads.find(l => l.id === leadId)
    
    if (!draggedLead || draggedLead.status === newStatus) {
      setActiveId(null)
      setDraggingLead(null)
      return
    }

    console.log('🎯 Drag end:', { leadId, from: draggedLead.status, to: newStatus })

    // Optimistic update
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    )
    setLeads(updatedLeads)

    // Update in Supabase
    const success = await updateLeadStatus(leadId, newStatus)

    if (!success) {
      // Revert on error
      console.error('Failed to update lead status, reverting')
      setLeads(leads)
    }

    setActiveId(null)
    setDraggingLead(null)
  }

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
    const draggedLead = leads.find(l => l.id === event.active.id)
    setDraggingLead(draggedLead)
  }

  // Calculate stats
  const stats = useMemo(() => {
    const total = leads.length
    const newCount = leadsByStatus['New']?.length || 0
    const inReviewCount = leadsByStatus['In Review']?.length || 0
    const contactedCount = leadsByStatus['Contacted']?.length || 0
    const convertedCount = leadsByStatus['Converted']?.length || 0

    return {
      total,
      newCount,
      inReviewCount,
      contactedCount,
      convertedCount,
    }
  }, [leads, leadsByStatus])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-20 pb-8 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-primary animate-pulse" />
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
            onClick={fetchLeads}
            className="flex items-center gap-2 px-5 py-2.5 text-muted-foreground hover:text-white transition-all duration-200 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="glass-card-premium p-4 animate-fadeInUp">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total</h3>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.total}</p>
          </div>

          <div className="glass-card-premium p-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">New</h3>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-blue-400">{stats.newCount}</p>
          </div>

          <div className="glass-card-premium p-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Review</h3>
              <Briefcase className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-3xl font-extrabold text-yellow-400">{stats.inReviewCount}</p>
          </div>

          <div className="glass-card-premium p-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Contacted</h3>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-purple-400">{stats.contactedCount}</p>
          </div>

          <div className="glass-card-premium p-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Converted</h3>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-3xl font-extrabold text-green-400">{stats.convertedCount}</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-450px)] min-h-[600px]">
          {COLUMNS.map((column) => (
            <LeadColumn
              key={column.id}
              title={column.title}
              status={column.status}
              leads={leadsByStatus[column.status] || []}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggingLead ? (
            <div className="opacity-90" style={{ width: '280px' }}>
              <LeadCard lead={draggingLead} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      </div>
    </div>
  )
}

