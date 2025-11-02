import { useState, useMemo } from 'react'
import PipelineFilter from '../components/PipelineFilter'
import LeadCard from '../components/LeadCard'

// Mock leads data with various statuses
const generateMockLeads = () => {
  const companies = [
    'Tesla Inc',
    'Google',
    'Meta',
    'Microsoft',
    'Amazon',
    'Apple',
    'Netflix',
    'Adobe',
    'Salesforce',
    'Oracle',
    'IBM',
    'Intel',
    'NVIDIA',
    'Spotify',
    'Uber',
    'Airbnb',
    'Stripe',
    'Shopify',
    'Zoom',
    'Slack',
  ]

  const statuses = ['New', 'Contacted', 'In Progress', 'Won', 'Lost']
  const emails = [
    'contact@company.com',
    'info@company.com',
    'sales@company.com',
    'hello@company.com',
  ]

  return companies.map((company, index) => ({
    id: index + 1,
    name: `Lead ${index + 1}`,
    company,
    email: emails[index % emails.length].replace('company', company.toLowerCase().split(' ')[0]),
    phone: `+1 (555) ${100 + index}-${1000 + index}`,
    status: statuses[index % statuses.length],
    score: 50 + Math.floor(Math.random() * 50), // Random score between 50-100
    message:
      'Interested in learning more about our enterprise solutions. Please contact us at your earliest convenience.',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

function Dashboard() {
  const [activeStatus, setActiveStatus] = useState('all')
  const [leads] = useState(() => generateMockLeads())

  // Filter leads based on active status
  const filteredLeads = useMemo(() => {
    if (activeStatus === 'all') {
      return leads
    }
    return leads.filter((lead) => lead.status === activeStatus)
  }, [leads, activeStatus])

  // Count leads by status
  const statusCounts = useMemo(() => {
    const counts = { all: leads.length }
    leads.forEach((lead) => {
      counts[lead.status] = (counts[lead.status] || 0) + 1
    })
    return counts
  }, [leads])

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">Dashboard</h1>
          <p className="text-gray-400">Manage and track your leads pipeline</p>
        </div>

        {/* Pipeline Filter Tabs */}
        <PipelineFilter activeStatus={activeStatus} onStatusChange={setActiveStatus} />

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: statusCounts.all, status: 'all' },
            { label: 'New', value: statusCounts.New || 0, status: 'New' },
            { label: 'Contacted', value: statusCounts.Contacted || 0, status: 'Contacted' },
            { label: 'In Progress', value: statusCounts['In Progress'] || 0, status: 'In Progress' },
            { label: 'Won', value: statusCounts.Won || 0, status: 'Won' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`glass-card p-4 text-center cursor-pointer transition-all duration-300
                ${activeStatus === stat.status ? 'ring-2 ring-primary ring-opacity-50' : ''}
                hover:bg-white/10`}
              onClick={() => setActiveStatus(stat.status)}
            >
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Leads Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {activeStatus === 'all' ? 'All Leads' : `${activeStatus} Leads`}
            </h2>
            <span className="text-sm text-gray-400">
              Showing {filteredLeads.length} of {leads.length} leads
            </span>
          </div>

          {filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-400 text-lg">
                No leads found for status: <span className="text-white font-semibold">{activeStatus}</span>
              </p>
              <p className="text-gray-500 text-sm mt-2">Try selecting a different filter</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Dashboard


