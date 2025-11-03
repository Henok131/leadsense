/**
 * LeadTabs.tsx
 * Reusable sticky horizontal tab bar for lead status filtering
 */

import { useEffect, useState } from 'react'

export type LeadStatus = 'All' | 'New' | 'Contacted' | 'In Progress' | 'Won' | 'Lost'

type LeadTabsProps = {
  onSelect: (status: LeadStatus) => void
  defaultStatus?: LeadStatus
  className?: string
}

const TABS: LeadStatus[] = ['All', 'New', 'Contacted', 'In Progress', 'Won', 'Lost']

export default function LeadTabs({ onSelect, defaultStatus = 'All', className = '' }: LeadTabsProps) {
  const [active, setActive] = useState<LeadStatus>(defaultStatus)

  useEffect(() => {
    onSelect(active)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (status: LeadStatus) => {
    setActive(status)
    onSelect(status)
  }

  return (
    <div className={`sticky top-16 z-40 -mx-4 px-4 bg-dark/95 backdrop-blur-md border-b border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4">
          {TABS.map((tab) => {
            const isActive = tab === active
            return (
              <button
                key={tab}
                onClick={() => handleClick(tab)}
                className={`relative flex-shrink-0 px-5 py-2.5 rounded-t-lg text-sm font-semibold transition-all duration-300 ease-out select-none ${
                  isActive ? 'text-white scale-105' : 'text-gray-400 hover:text-white hover:scale-[1.02]'
                }`}
                aria-pressed={isActive}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-t-lg bg-gradient-to-r from-primary/25 via-secondary/25 to-accent/25 backdrop-blur-sm border-t border-x border-white/15" />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent shadow-[0_0_12px] shadow-primary/40" />
                  </>
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}


