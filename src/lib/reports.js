/**
 * Reports Service
 * Handles Supabase operations for reports and analytics
 */

import { supabase } from './supabaseClient'

/**
 * Fetch basic report statistics
 * @returns {Promise<object>} Aggregated stats
 */
export async function fetchReportStats() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')

    if (error) {
      console.error('❌ Error fetching report stats:', error)
      return null
    }

    const leads = data || []
    const total = leads.length

    // Count by status
    const converted = leads.filter(l => l.status === 'Converted').length
    const contacted = leads.filter(l => l.status === 'Contacted').length
    const inReview = leads.filter(l => l.status === 'In Review').length
    const newLeads = leads.filter(l => l.status === 'New').length

    // Conversion rate
    const conversionRate = contacted > 0 ? (converted / contacted) * 100 : 0

    // Average score
    const scores = leads.filter(l => l.score !== null && l.score !== undefined).map(l => l.score)
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

    // Current month data
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const leadsThisMonth = leads.filter(l => new Date(l.created_at) >= startOfMonth).length

    // Last month data for comparison
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const leadsLastMonth = leads.filter(l => {
      const created = new Date(l.created_at)
      return created >= lastMonth && created <= endOfLastMonth
    }).length

    // Month-over-month growth
    const momGrowth = leadsLastMonth > 0 
      ? ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100 
      : leadsThisMonth > 0 ? 100 : 0

    // Revenue calculation (from deal_value or estimated)
    const totalRevenue = leads
      .filter(l => l.deal_value !== null && l.deal_value !== undefined)
      .reduce((sum, l) => sum + parseFloat(l.deal_value || 0), 0)

    const revenuePerLead = converted > 0 ? totalRevenue / converted : 0

    console.log('✅ Fetched report stats')

    return {
      total,
      converted,
      contacted,
      inReview,
      newLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      avgScore: Math.round(avgScore),
      leadsThisMonth,
      leadsLastMonth,
      momGrowth: Math.round(momGrowth),
      totalRevenue,
      revenuePerLead: Math.round(revenuePerLead),
    }
  } catch (error) {
    console.error('❌ Unexpected error in fetchReportStats:', error)
    return null
  }
}

/**
 * Fetch conversion rates over time
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} Time series data
 */
export async function fetchConversionRates(days = 30) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('created_at, status')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('❌ Error fetching conversion rates:', error)
      return []
    }

    // Group by date
    const rates = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      date.setHours(0, 0, 0, 0)

      const dayLeads = (data || []).filter(l => {
        const created = new Date(l.created_at)
        created.setHours(0, 0, 0, 0)
        return created.getTime() === date.getTime()
      })

      const converted = dayLeads.filter(l => l.status === 'Converted').length
      const rate = dayLeads.length > 0 ? (converted / dayLeads.length) * 100 : 0

      rates.push({
        date: date.toISOString().split('T')[0],
        rate: Math.round(rate * 10) / 10,
        leads: dayLeads.length,
      })
    }

    return rates
  } catch (error) {
    console.error('❌ Unexpected error in fetchConversionRates:', error)
    return []
  }
}

/**
 * Fetch revenue trends
 * @returns {Promise<Array>} Monthly revenue data
 */
export async function fetchRevenueTrends() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('created_at, deal_value, status')
      .eq('status', 'Converted')

    if (error) {
      console.error('❌ Error fetching revenue trends:', error)
      return []
    }

    // Group by month
    const monthlyData = {}
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[key] = {
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: 0,
        leads: 0,
      }
    }

    (data || []).forEach(lead => {
      if (!lead.deal_value) return
      const date = new Date(lead.created_at)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthlyData[key]) {
        monthlyData[key].revenue += parseFloat(lead.deal_value || 0)
        monthlyData[key].leads += 1
      }
    })

    return Object.values(monthlyData)
  } catch (error) {
    console.error('❌ Unexpected error in fetchRevenueTrends:', error)
    return []
  }
}

/**
 * Fetch leads by source
 * @returns {Promise<Array>} Source distribution data
 */
export async function fetchLeadsBySource() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('source, utm_source')

    if (error) {
      console.error('❌ Error fetching leads by source:', error)
      return []
    }

    const sourceMap = {}
    (data || []).forEach(lead => {
      const source = lead.utm_source || lead.source || 'Unknown'
      sourceMap[source] = (sourceMap[source] || 0) + 1
    })

    return Object.entries(sourceMap)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  } catch (error) {
    console.error('❌ Unexpected error in fetchLeadsBySource:', error)
    return []
  }
}

/**
 * Generate forecast for next month
 * @param {object} stats - Current stats from fetchReportStats
 * @returns {object} Forecast data
 */
export function generateForecast(stats) {
  if (!stats) return null

  const { leadsThisMonth, conversionRate, totalRevenue, converted } = stats

  // Simple linear projection based on current month
  const expectedLeads = leadsThisMonth
  const expectedConversion = Math.round(expectedLeads * (conversionRate / 100))
  const expectedRevenue = converted > 0 && expectedConversion > 0
    ? (totalRevenue / converted) * expectedConversion
    : totalRevenue

  return {
    expectedLeads,
    expectedConversion,
    expectedRevenue: Math.round(expectedRevenue),
    confidence: 'medium',
  }
}

/**
 * Export report to CSV
 * @param {object} reportData - Report data to export
 */
export function exportReportToCSV(reportData) {
  const { stats, forecast } = reportData
  if (!stats) return

  const lines = [
    'LeadSense Report',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'KEY METRICS',
    `Total Leads,${stats.total}`,
    `Conversion Rate,${stats.conversionRate}%`,
    `Avg Score,${stats.avgScore}`,
    `Leads This Month,${stats.leadsThisMonth}`,
    `MoM Growth,${stats.momGrowth}%`,
    `Total Revenue,$${stats.totalRevenue?.toLocaleString()}`,
    `Revenue Per Lead,$${stats.revenuePerLead?.toLocaleString()}`,
    '',
    'FORECAST (Next Month)',
    `Expected Leads,${forecast?.expectedLeads || 0}`,
    `Expected Conversions,${forecast?.expectedConversion || 0}`,
    `Expected Revenue,$${forecast?.expectedRevenue?.toLocaleString() || 0}`,
  ]

  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `leadsense-report-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  console.log('✅ Report exported to CSV')
}

/**
 * Export report to PDF
 * @param {object} reportData - Report data to export
 */
export async function exportReportToPDF(reportData) {
  const { jsPDF } = await import('jspdf')
  const autoTable = (await import('jspdf-autotable')).default

  const { stats, forecast } = reportData
  if (!stats) return

  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(120, 200, 255) // Primary color
  doc.text('LeadSense Report', 105, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' })
  
  // Key Metrics
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Key Metrics', 14, 45)
  
  const metrics = [
    ['Metric', 'Value'],
    ['Total Leads', stats.total.toString()],
    ['Conversion Rate', `${stats.conversionRate}%`],
    ['Avg Score', stats.avgScore.toString()],
    ['Leads This Month', stats.leadsThisMonth.toString()],
    ['MoM Growth', `${stats.momGrowth}%`],
    ['Total Revenue', `$${stats.totalRevenue?.toLocaleString()}`],
    ['Revenue Per Lead', `$${stats.revenuePerLead?.toLocaleString()}`],
  ]
  
  autoTable(doc, {
    startY: 50,
    head: [metrics[0]],
    body: metrics.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [120, 200, 255] },
  })

  // Forecast
  if (forecast) {
    const startY = doc.lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.text('Forecast (Next Month)', 14, startY)
    
    const forecastData = [
      ['Expected Leads', forecast.expectedLeads.toString()],
      ['Expected Conversions', forecast.expectedConversion.toString()],
      ['Expected Revenue', `$${forecast.expectedRevenue?.toLocaleString()}`],
    ]
    
    autoTable(doc, {
      startY: startY + 5,
      body: forecastData,
      theme: 'striped',
    })
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`LeadSense - Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' })
  }

  doc.save(`leadsense-report-${new Date().toISOString().split('T')[0]}.pdf`)
  console.log('✅ Report exported to PDF')
}

