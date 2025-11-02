/**
 * LeadPipeline Page - Kanban Board
 * Drag & drop Kanban board for managing leads through pipeline stages
 */

import { useState, useEffect } from 'react'
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import LeadColumn from '../../components/kanban/LeadColumn'
import LeadCard from '../../components/kanban/LeadCard'

const COLUMNS = [
  { id: 'New', title: 'New', status: 'New' },
  { id: 'In Review', title: 'In Review', status: 'In Review' },
  { id: 'Contacted', title: 'Contacted', status: 'Contacted' },
  { id: 'Converted', title: 'Converted', status: 'Converted' },
]

export default function LeadPipeline() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch leads from Supabase
  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching leads:', error)
        // Use mock data on error
        loadMockData()
        return
      }

      // Ensure all leads have a status
      const leadsWithStatus = (data || []).map(lead => ({
        ...lead,
        status: lead.status || 'New',
      }))

      setLeads(leadsWithStatus)
      setLoading(false)
    } catch (error) {
      console.error('Error in fetchLeads:', error)
      loadMockData()
    }
  }

  // Load mock data as fallback
  const loadMockData = () => {
    const mockLeads = [
      { id: '1', name: 'Acme Corp', email: 'contact@acme.com', company: 'Acme Corporation', score: 85, category: 'Hot', status: 'New', created_at: new Date().toISOString() },
      { id: '2', name: 'Tech Startup', email: 'hello@techstart.io', company: 'Tech Startup Inc', score: 72, category: 'Warm', status: 'In Review', created_at: new Date().toISOString() },
      { id: '3', name: 'Global Solutions', email: 'info@globalsol.com', company: 'Global Solutions Ltd', score: 90, category: 'Hot', status: 'Contacted', created_at: new Date().toISOString() },
    ]
    setLeads(mockLeads)
    setLoading(false)
  }

  // Initial load
  useEffect(() => {
    fetchLeads()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeads()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Organize leads by status
  const getLeadsByStatus = (status) => {
    return leads.filter(lead => lead.status === status)
  }

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const activeLead = leads.find(l => l.id === active.id)
    if (!activeLead) return

    // Check if dragging between columns (status change) or within same column (reorder)
    const activeStatus = activeLead.status
    const overStatus = over.id in COLUMNS.reduce((acc, col) => ({ ...acc, [col.status]: true }), {})
      ? over.id
      : leads.find(l => l.id === over.id)?.status

    if (activeStatus !== overStatus && overStatus) {
      // Status change - update lead in Supabase
      try {
        const { error } = await supabase
          .from('leads')
          .update({ status: overStatus })
          .eq('id', active.id)

        if (error) {
          console.error('Error updating lead status:', error)
        } else {
          // Update local state
          setLeads(prevLeads =>
            prevLeads.map(lead =>
              lead.id === active.id ? { ...lead, status: overStatus } : lead
            )
          )
        }
      } catch (error) {
        console.error('Error in status update:', error)
      }
    } else if (activeStatus === overStatus) {
      // Reorder within same column (optional - can be implemented later)
      const statusLeads = getLeadsByStatus(activeStatus)
      const oldIndex = statusLeads.findIndex(l => l.id === active.id)
      const newIndex = statusLeads.findIndex(l => l.id === over.id)

      if (oldIndex !== newIndex) {
        setLeads(prevLeads => {
          const newLeads = [...prevLeads]
          const leadToMove = newLeads.find(l => l.id === active.id)
          const otherLeads = newLeads.filter(l => l.status !== activeStatus || l.id !== active.id)
          const reorderedLeads = arrayMove(statusLeads, oldIndex, newIndex).filter(l => l.id !== active.id)

          return [...otherLeads, ...reorderedLeads, leadToMove]
        })
      }
    }
  }

  // Get active lead for drag overlay
  const activeLead = activeId ? leads.find(l => l.id === activeId) : null

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GripVertical className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-extrabold gradient-text">Pipeline</h1>
          </div>
          <p className="text-gray-400 text-lg">Drag and drop leads to move them through your pipeline</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="glass-card-premium p-12 text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading pipeline...</p>
          </div>
        ) : (
          /* Kanban Board */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {COLUMNS.map((column) => (
                <LeadColumn
                  key={column.id}
                  title={column.title}
                  status={column.status}
                  leads={getLeadsByStatus(column.status)}
                />
              ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeLead ? (
                <div className="glass-card p-4 opacity-90 rotate-3 scale-105 shadow-2xl">
                  <h4 className="text-white font-bold text-sm">{activeLead.name || 'Unnamed Lead'}</h4>
                  {activeLead.company && (
                    <p className="text-gray-300 text-xs mt-1">{activeLead.company}</p>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  )
}
