/**
 * LeadTabs Component
 * Reusable horizontal tab bar for filtering leads by status
 */

import { useState, useEffect } from 'react'

const TABS = [
  { id: 'All', label: 'All', value: 'All' },
  { id: 'New', label: 'New', value: 'New' },
  { id: 'Contacted', label: 'Contacted', value: 'Contacted' },
  { id: 'In Progress', label: 'In Progress', value: 'In Progress' },
  { id: 'Won', label: 'Won', value: 'Won' },
  { id: 'Lost', label: 'Lost', value: 'Lost' },
]

export default function LeadTabs({ onSelect, defaultTab = 'All' }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    // Call onSelect with default tab on mount
    if (onSelect && activeTab) {
      onSelect(activeTab)
    }
  }, []) // Only on mount - eslint-disable-line react-hooks/exhaustive-deps

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue)
    if (onSelect) {
      onSelect(tabValue)
    }
  }

  return (
    <div className="sticky top-16 z-40 mb-6 -mx-4 px-4 bg-dark/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.value)}
                className={`
                  relative flex-shrink-0 px-6 py-3 rounded-t-lg font-semibold text-sm
                  transition-all duration-300 ease-out
                  ${isActive
                    ? 'text-white scale-105'
                    : 'text-gray-400 hover:text-white hover:scale-102'
                  }
                `}
              >
                {/* Active Tab Background - Glassy Gradient */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-t-lg backdrop-blur-sm border-t border-x border-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-t-lg" />
                    {/* Glowing Bottom Border */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg shadow-primary/50 animate-pulse" />
                  </>
                )}
                
                {/* Tab Label */}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
                  )}
                </span>
                
                {/* Hover Effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/5 rounded-t-lg opacity-0 hover:opacity-100 transition-opacity duration-200" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

