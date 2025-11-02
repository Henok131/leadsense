/**
 * ChartPanel Component
 * Interactive chart visualization with tabs
 */

import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, DollarSign, Globe } from 'lucide-react'

const COLORS = ['#78c8ff', '#8aa3ff', '#b084ff', '#ef4444', '#f59e0b', '#10b981']

export default function ChartPanel({ conversionData, revenueData, sourceData }) {
  const [activeTab, setActiveTab] = useState('conversion')

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null
    
    return (
      <div className="glass-card-premium p-3 border border-white/20 shadow-lg">
        <p className="text-xs text-gray-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name.toLowerCase().includes('revenue')
              ? `$${entry.value.toLocaleString()}`
              : `${entry.value}%`
            }
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('conversion')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'conversion'
              ? 'bg-primary/20 text-primary font-medium'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Conversion Rate
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'revenue'
              ? 'bg-primary/20 text-primary font-medium'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Revenue Trend
        </button>
        <button
          onClick={() => setActiveTab('source')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'source'
              ? 'bg-primary/20 text-primary font-medium'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-4 h-4" />
          Lead Sources
        </button>
      </div>

      {/* Charts */}
      <div className="h-[400px]">
        {activeTab === 'conversion' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                tick={{ fill: '#888888', fontSize: 12 }}
              />
              <YAxis 
                stroke="#888888"
                tick={{ fill: '#888888', fontSize: 12 }}
                label={{ value: '%', position: 'insideLeft', fill: '#888888' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#888888' }} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#78c8ff"
                strokeWidth={3}
                dot={{ fill: '#78c8ff', r: 4 }}
                activeDot={{ r: 6 }}
                name="Conversion Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'revenue' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="month" 
                stroke="#888888"
                tick={{ fill: '#888888', fontSize: 12 }}
              />
              <YAxis 
                stroke="#888888"
                tick={{ fill: '#888888', fontSize: 12 }}
                label={{ value: '$', position: 'insideLeft', fill: '#888888' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Legend wrapperStyle={{ color: '#888888' }} />
              <Bar dataKey="revenue" fill="#8aa3ff" radius={[8, 8, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'source' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#888888"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Empty state */}
      {((activeTab === 'conversion' && (!conversionData || conversionData.length === 0)) ||
        (activeTab === 'revenue' && (!revenueData || revenueData.length === 0)) ||
        (activeTab === 'source' && (!sourceData || sourceData.length === 0))) && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-center">No data available</p>
        </div>
      )}
    </div>
  )
}

