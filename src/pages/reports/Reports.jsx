/**
 * Reports Page
 * KPI cards, conversion rates, revenue trends, leads by source, and export functionality
 */

import { useState, useEffect } from 'react'
import { FileText, Download, TrendingUp, DollarSign, Users, Target } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { fetchReportStats, fetchConversionRates, fetchRevenueTrends, fetchLeadsBySource, exportReportToCSV, exportReportToPDF } from '../../lib/reports'
import ReportCard from '../../components/reports/ReportCard'
import ChartPanel from '../../components/reports/ChartPanel'

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [conversionData, setConversionData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [sourceData, setSourceData] = useState([])

  // Fetch all report data
  const fetchReports = async () => {
    try {
      setLoading(true)

      // Fetch stats
      const reportStats = await fetchReportStats()
      setStats(reportStats)

      // Fetch conversion rates
      const conversionRates = await fetchConversionRates(30)
      setConversionData(conversionRates)

      // Fetch revenue trends
      const revenueTrends = await fetchRevenueTrends()
      setRevenueData(revenueTrends)

      // Fetch leads by source
      const leadsBySource = await fetchLeadsBySource()
      setSourceData(leadsBySource)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching reports:', error)
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchReports()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReports()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Export handlers
  const handleExportCSV = () => {
    exportReportToCSV({ stats, forecast: null })
  }

  const handleExportPDF = () => {
    exportReportToPDF({ stats, forecast: null })
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-5xl font-extrabold gradient-text">Reports</h1>
            </div>
            <p className="text-gray-400 text-lg">Comprehensive analytics and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg text-white font-bold hover:scale-105 transition-transform"
            >
              <FileText className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="glass-card-premium p-12 text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading reports...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ReportCard
                title="Total Leads"
                value={stats?.total || 0}
                subtitle="All time"
                trend={stats?.momGrowth || 0}
                icon={Users}
              />
              <ReportCard
                title="Conversion Rate"
                value={`${stats?.conversionRate || 0}%`}
                subtitle="Last 30 days"
                trend={5}
                icon={Target}
              />
              <ReportCard
                title="Total Revenue"
                value={stats?.totalRevenue || 0}
                subtitle="All time"
                trend={12}
                icon={DollarSign}
              />
              <ReportCard
                title="Avg Score"
                value={stats?.avgScore || 0}
                subtitle="Across all leads"
                trend={3}
                icon={TrendingUp}
              />
            </div>

            {/* Charts Panel */}
            <ChartPanel
              conversionData={conversionData}
              revenueData={revenueData}
              sourceData={sourceData}
            />
          </>
        )}
      </div>
    </div>
  )
}
