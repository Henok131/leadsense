function LeadCard({ lead }) {
  // Status color mapping
  const statusColors = {
    New: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    Contacted: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    'In Progress': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    Won: 'bg-green-500/20 text-green-300 border-green-500/50',
    Lost: 'bg-red-500/20 text-red-300 border-red-500/50',
  }

  const statusColor =
    statusColors[lead.status] || 'bg-gray-500/20 text-gray-300 border-gray-500/50'

  return (
    <div className="glass-card p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{lead.name}</h3>
          <p className="text-sm text-gray-400">{lead.company || 'No company'}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}
        >
          {lead.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        {lead.email && (
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-primary rounded-full"></span>
            {lead.email}
          </p>
        )}
        {lead.phone && (
          <p className="flex items-center gap-2">
            <span className="w-1 h-1 bg-secondary rounded-full"></span>
            {lead.phone}
          </p>
        )}
        {lead.score !== undefined && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-500">Score:</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-asenay rounded-full transition-all duration-500"
                style={{ width: `${lead.score}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-white">{lead.score}/100</span>
          </div>
        )}
      </div>

      {lead.message && (
        <p className="mt-4 text-sm text-gray-400 line-clamp-2">{lead.message}</p>
      )}
    </div>
  )
}

export default LeadCard

