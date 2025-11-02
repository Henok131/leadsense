import { useState } from 'react'

const STATUS_TABS = [
  { id: 'all', label: 'All', value: 'all' },
  { id: 'new', label: 'New', value: 'New' },
  { id: 'contacted', label: 'Contacted', value: 'Contacted' },
  { id: 'in-progress', label: 'In Progress', value: 'In Progress' },
  { id: 'won', label: 'Won', value: 'Won' },
  { id: 'lost', label: 'Lost', value: 'Lost' },
]

function PipelineFilter({ activeStatus, onStatusChange }) {
  return (
    <div className="w-full mb-6">
      {/* Desktop & Tablet: Horizontal Scrollable Tabs */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-2">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.value
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.value)}
                className={`
                  relative px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap
                  transition-all duration-300 ease-in-out
                  ${
                    isActive
                      ? 'text-white scale-105 shadow-lg shadow-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                  ${isActive ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/5'}
                  border ${isActive ? 'border-primary/50' : 'border-white/10'}
                  ${isActive ? 'hover:border-primary/70' : 'hover:border-white/20'}
                `}
              >
                {tab.label}
                {/* Active Tab Glowing Underline */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, #78c8ff 0%, #8aa3ff 50%, #b084ff 100%)',
                      boxShadow: '0 0 8px rgba(120, 200, 255, 0.6)',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  />
                )}
                {/* Subtle Glow Effect on Active */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-lg opacity-30 blur-sm"
                    style={{
                      background:
                        'linear-gradient(135deg, #78c8ff 0%, #8aa3ff 50%, #b084ff 100%)',
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile: Dropdown */}
      <div className="md:hidden">
        <select
          value={activeStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg font-semibold text-sm
            bg-white/10 backdrop-blur-sm border border-white/20
            text-white focus:outline-none focus:ring-2 focus:ring-primary
            focus:border-transparent appearance-none
            bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%23ffffff%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E')] bg-no-repeat bg-right px-10
            hover:bg-white/15 transition-colors"
        >
          {STATUS_TABS.map((tab) => (
            <option key={tab.id} value={tab.value} className="bg-dark text-white">
              {tab.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default PipelineFilter

