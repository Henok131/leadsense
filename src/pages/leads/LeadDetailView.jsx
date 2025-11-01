/**
 * LeadDetailView Page
 * Full CRUD page for viewing and editing individual leads
 * Route: /leads/:id
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { getLead, updateLead } from '../../lib/leads'
import LeadDetailCard from '../../components/lead/LeadDetailCard'
import LeadNotesPanel from '../../components/lead/LeadNotesPanel'
import LeadActionsBar from '../../components/lead/LeadActionsBar'

export default function LeadDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // State management
  const [lead, setLead] = useState(null)
  const [originalLead, setOriginalLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Fetch lead on mount
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const leadData = await getLead(id)
        
        if (!leadData) {
          setError('Lead not found')
          return
        }
        
        setLead(leadData)
        setOriginalLead(leadData)
      } catch (err) {
        console.error('Failed to fetch lead:', err)
        setError('Failed to load lead details')
      } finally {
        setLoading(false)
      }
    }

    fetchLeadData()
  }, [id])

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setLead(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle notes change
  const handleNotesChange = (notes) => {
    handleFieldChange('internal_notes', notes)
  }

  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(lead) !== JSON.stringify(originalLead)

  // Handle save
  const handleSave = async () => {
    if (!lead || !hasChanges) return

    try {
      setSaving(true)
      setError(null)

      // Prepare update payload (only changed fields)
      const payload = {}
      
      // Check for actual changes
      if (lead.score !== originalLead?.score) {
        payload.score = lead.score
      }
      if (lead.category !== originalLead?.category) {
        payload.category = lead.category
      }
      if (lead.internal_notes !== originalLead?.internal_notes) {
        payload.internal_notes = lead.internal_notes
      }

      if (Object.keys(payload).length === 0) {
        console.log('No changes to save')
        setSaving(false)
        return
      }

      // Update lead in Supabase
      const success = await updateLead(id, payload)

      if (success) {
        // Show success toast (simple alert for now, replace with toast library if needed)
        alert('✅ Lead updated successfully!')
        
        // Update original lead to current state
        setOriginalLead(lead)
        
        // Navigate back to dashboard
        navigate('/dashboard')
      } else {
        setError('Failed to update lead. Please try again.')
      }
    } catch (err) {
      console.error('Failed to save lead:', err)
      setError('An error occurred while saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?')
      if (!confirm) return
    }
    navigate('/dashboard')
  }

  // Handle delete (disabled for now)
  const handleDelete = () => {
    alert('Delete functionality coming soon!')
  }

  // Loading state
  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !lead) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="glass-card-premium p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{error || 'Lead not found'}</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The lead you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-all duration-200 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
        
        <h1 className="text-4xl font-extrabold gradient-text tracking-tight">
          Edit Lead
        </h1>
        <p className="text-muted-foreground mt-2">
          Update lead information and add internal notes
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3 animate-fadeInUp">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Lead Detail Card */}
      <div className="mb-6">
        <LeadDetailCard lead={lead} onFieldChange={handleFieldChange} />
      </div>

      {/* Notes Panel */}
      <div className="mb-6">
        <LeadNotesPanel 
          notes={lead.internal_notes} 
          onChange={handleNotesChange}
          isLoading={saving}
        />
      </div>

      {/* Action Bar */}
      <div className="relative">
        <LeadActionsBar
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          isLoading={saving}
          hasChanges={hasChanges}
        />
      </div>
    </div>
  )
}

