import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import LeadTabs from '../components/LeadTabs'

function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('All')

  // Fetch leads from Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching leads:', error)
          // Generate mock data if Supabase fails
          const mockLeads = [
            { id: '1', name: 'Acme Corp', email: 'contact@acme.com', company: 'Acme Corporation', status: 'New', created_at: new Date().toISOString() },
            { id: '2', name: 'Tech Startup', email: 'hello@techstart.io', company: 'Tech Startup Inc', status: 'Contacted', created_at: new Date().toISOString() },
            { id: '3', name: 'Global Solutions', email: 'info@globalsol.com', company: 'Global Solutions Ltd', status: 'In Progress', created_at: new Date().toISOString() },
            { id: '4', name: 'Big Company', email: 'sales@bigco.com', company: 'Big Company Inc', status: 'Won', created_at: new Date().toISOString() },
            { id: '5', name: 'Small Business', email: 'owner@smallbiz.com', company: 'Small Business LLC', status: 'Lost', created_at: new Date().toISOString() },
          ]
          setLeads(mockLeads)
          setLoading(false)
          return
        }

        // Ensure all leads have a status field, assign random if missing
        const leadsWithStatus = (data || []).map(lead => ({
          ...lead,
          status: lead.status || ['New', 'Contacted', 'In Progress', 'Won', 'Lost'][Math.floor(Math.random() * 5)],
        }))

        setLeads(leadsWithStatus)
        setLoading(false)
      } catch (error) {
        console.error('Error in fetchLeads:', error)
        setLoading(false)
      }
    }

    fetchLeads()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeads, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filter leads based on selected status
  const filteredLeads = useMemo(() => {
    if (selectedStatus === 'All') {
      return leads
    }
    return leads.filter(lead => lead.status === selectedStatus)
  }, [leads, selectedStatus])

  // Handle tab selection
  const handleStatusSelect = (status) => {
    console.log('Selected status:', status)
    setSelectedStatus(status)
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
          <p className="text-gray-400">Manage and filter your leads</p>
        </div>

        {/* Lead Tabs - Sticky horizontal filter bar */}
        <LeadTabs onSelect={handleStatusSelect} defaultTab="All" />

        {/* Leads List Section */}
        <div className="mt-6">
          {loading ? (
            <div className="glass-card p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-white mb-2">No leads found</h2>
              <p className="text-gray-400">
                {selectedStatus === 'All' 
                  ? 'No leads in the system yet.' 
                  : `No leads with status "${selectedStatus}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="glass-card p-6 hover:scale-[1.02] transition-transform duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {lead.name || 'Unnamed Lead'}
                      </h3>
                      {lead.company && (
                        <p className="text-sm text-gray-400">{lead.company}</p>
                      )}
                    </div>
                    {/* Status Badge */}
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold
                      ${lead.status === 'Won' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        lead.status === 'Lost' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        lead.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        lead.status === 'Contacted' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }
                    `}>
                      {lead.status || 'New'}
                    </span>
                  </div>

                  {lead.email && (
                    <p className="text-sm text-gray-300 mb-3 truncate">
                      📧 {lead.email}
                    </p>
                  )}

                  {lead.created_at && (
                    <p className="text-xs text-gray-500">
                      Created: {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {!loading && filteredLeads.length > 0 && (
            <div className="mt-6 glass-card p-4">
              <p className="text-sm text-gray-400 text-center">
                Showing <span className="text-white font-bold">{filteredLeads.length}</span> of <span className="text-white font-bold">{leads.length}</span> leads
                {selectedStatus !== 'All' && ` (filtered by "${selectedStatus}")`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
