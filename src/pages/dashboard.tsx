import { useEffect, useMemo, useState } from 'react'
import LeadTabs, { LeadStatus } from '../components/LeadTabs'
import { supabase } from '../lib/supabaseClient'

type Lead = {
  id: string
  name?: string
  email?: string
  company?: string
  status?: LeadStatus | string
  created_at?: string
}

export default function DashboardTS() {
  const [allLeads, setAllLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<LeadStatus>('All')

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
        if (error) throw error

        const leadsWithStatus: Lead[] = (data || []).map((l: Lead) => ({
          ...l,
          status: (l.status as LeadStatus) || (['New', 'Contacted', 'In Progress', 'Won', 'Lost'] as LeadStatus[])[Math.floor(Math.random() * 5)],
        }))
        setAllLeads(leadsWithStatus)
      } catch (e) {
        const mock: Lead[] = [
          { id: '1', name: 'Acme Corp', email: 'contact@acme.com', company: 'Acme', status: 'New', created_at: new Date().toISOString() },
          { id: '2', name: 'Tech Startup', email: 'hello@tech.io', company: 'Tech', status: 'Contacted', created_at: new Date().toISOString() },
          { id: '3', name: 'Global', email: 'info@global.com', company: 'Global', status: 'In Progress', created_at: new Date().toISOString() },
          { id: '4', name: 'BigCo', email: 'sales@big.co', company: 'BigCo', status: 'Won', created_at: new Date().toISOString() },
          { id: '5', name: 'SmallBiz', email: 'owner@sb.com', company: 'SmallBiz', status: 'Lost', created_at: new Date().toISOString() },
        ]
        setAllLeads(mock)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const filtered = useMemo(() => {
    if (status === 'All') return allLeads
    return allLeads.filter((l) => l.status === status)
  }, [allLeads, status])

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Dashboard</h1>

        <LeadTabs onSelect={(s) => setStatus(s)} defaultStatus="All" />

        <div className="mt-6">
          {loading ? (
            <div className="glass-card p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading leads...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-white mb-2">No leads</h2>
              <p className="text-gray-400">Try another tab.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((lead) => (
                <div key={lead.id} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                  <div className="flex items-start justify-between mb-3">
                    <div className="pr-3">
                      <p className="text-white font-bold">{lead.name || 'Unnamed Lead'}</p>
                      <p className="text-gray-400 text-sm truncate">{lead.company}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white">{lead.status as string}</span>
                  </div>
                  <p className="text-gray-300 text-sm truncate">{lead.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


