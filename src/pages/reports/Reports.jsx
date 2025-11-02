/**
 * Reports Page
 * Business insights, performance trends, and revenue forecasting
 * Route: /reports
 */

import { useEffect, useState } from 'react'
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign,
  Target,
  FileText,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReportCard from '../../components/reports/ReportCard'
import ChartPanel from '../../components/reports/ChartPanel'
import {
  fetchReportStats,
  fetchConversionRates,
  fetchRevenueTrends,
  fetchLeadsBySource,
  generateForecast,
  exportReportToCSV,
  exportReportToPDF,
} from '../../lib/reports'

export default function Reports() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [conversionData, setConversionData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [sourceData, setSourceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsResult, convResult, revResult, srcResult] = await Promise.all([
        fetchReportStats(),
        fetchConversionRates(30),
        fetchRevenueTrends(),
        fetchLeadsBySource(),
      ])

      setStats(statsResult)
      setForecast(generateForecast(statsResult))
      setConversionData(convResult)
      setRevenueData(revResult)
      setSourceData(srcResult)
    } catch (error) {
      console.error('Failed to load report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format) => {
    setExporting(true)
    try {
      if (format === 'csv') {
        exportReportToCSV({ stats, forecast })
      } else if (format === 'pdf') {
        await exportReportToPDF({ stats, forecast })
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-20 pb-8 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-all duration-200 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-extrabold gradient-text tracking-tight mb-3">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Real-time insights and revenue forecasting
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-5 py-2.5 text-muted-foreground hover:text-white transition-all duration-200 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            
            <div className="relative group">
              <button
                onClick={() => handleExport('pdf')}
                disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200 font-semibold text-sm shadow-lg shadow-primary/30 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {exporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <ReportCard
            title="Conversion Rate"
            value={`${stats?.conversionRate || 0}%`}
            subtitle="Ratio of converted to contacted"
            trend={stats?.conversionRate > 50 ? 12 : -5}
            icon={Target}
          />
          <ReportCard
            title="Leads This Month"
            value={stats?.leadsThisMonth || 0}
            subtitle="Total new leads"
            trend={stats?.momGrowth || 0}
            icon={Users}
          />
          <ReportCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            subtitle="From converted leads"
            trend={25}
            icon={DollarSign}
          />
          <ReportCard
            title="Revenue Per Lead"
            value={`$${(stats?.revenuePerLead || 0).toLocaleString()}`}
            subtitle="Average deal value"
            trend={8}
            icon={TrendingUp}
          />
        </div>

        {/* Forecast Card */}
        {forecast && (
          <div className="glass-card-premium p-6 mb-10 border-2 border-green-500/30 animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Next Month Forecast</h3>
                  <p className="text-sm text-gray-400">Based on current trends</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Expected Leads</p>
                <p className="text-3xl font-extrabold text-white">{forecast.expectedLeads}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Expected Conversions</p>
                <p className="text-3xl font-extrabold text-green-400">{forecast.expectedConversion}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Expected Revenue</p>
                <p className="text-3xl font-extrabold text-green-400">
                  ${(forecast.expectedRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <ChartPanel
          conversionData={conversionData}
          revenueData={revenueData}
          sourceData={sourceData}
        />
      </div>
      </div>
    </div>
  )
}

