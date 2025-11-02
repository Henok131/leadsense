/**
 * AI Scoring Module
 * Enhanced lead scoring with OpenAI GPT-4, supporting full lead data and batch processing
 * 
 * This module is designed to be:
 * - Modular and reusable
 * - Robust against incomplete data
 * - Extensible for other AI providers (Claude, Gemini)
 * - Test-ready with clear interfaces
 */

/**
 * Score a single lead with full metadata
 * @param {object} leadData - Full lead object with all metadata
 * @param {object} options - Optional scoring configuration
 * @returns {Promise<{score: number, reason: string, metadata?: object}>}
 */
export async function scoreLead(leadData, options = {}) {
  const {
    model = 'gpt-4',
    temperature = 0.7,
    useReasoning = true,
  } = options

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  // Default fallback response
  const fallbackResponse = {
    score: 0,
    reason: 'Unable to score lead: Missing API key or insufficient data',
    metadata: {
      model: 'fallback',
      timestamp: new Date().toISOString(),
      error: 'fallback_triggered',
    },
  }

  if (!apiKey) {
    console.warn('⚠️ Missing OpenAI API key in .env')
    return fallbackResponse
  }

  // Build context from lead data (handle missing fields gracefully)
  const leadContext = buildLeadContext(leadData)

  if (!leadContext.hasMinimumData) {
    console.warn('⚠️ Insufficient lead data for scoring')
    return {
      ...fallbackResponse,
      reason: 'Insufficient data to generate meaningful score',
      metadata: {
        model: 'fallback',
        timestamp: new Date().toISOString(),
        error: 'insufficient_data',
        availableFields: Object.keys(leadData || {}),
      },
    }
  }

  try {
    const prompt = buildScoringPrompt(leadContext)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.includes('gpt-4') ? model : 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert sales lead evaluation AI. Analyze the provided lead information and return ONLY valid JSON in this exact format:
{
  "score": <number between 0-100>,
  "reason": "<brief explanation (2-3 sentences)>"
}

Scoring Guidelines:
- 0-30: Cold (low intent, minimal engagement)
- 31-60: Warm (some interest, needs nurturing)
- 61-80: Hot (strong intent, ready for outreach)
- 81-100: Very Hot (immediate action needed)

Consider factors like:
- Company size and industry relevance
- Explicit interest indicators (requests, inquiries)
- Engagement signals (form submissions, website visits)
- Data completeness and quality
- Lead source and context`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ OpenAI API error:', response.status, errorData)
      return {
        ...fallbackResponse,
        reason: `API error: ${response.status}`,
        metadata: {
          model,
          timestamp: new Date().toISOString(),
          error: 'api_error',
          statusCode: response.status,
        },
      }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('❌ No content in AI response')
      return fallbackResponse
    }

    // Parse JSON response
    let aiResult
    try {
      aiResult = JSON.parse(content)
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError)
      console.error('Raw content:', content)
      
      // Try to extract JSON from text if wrapped
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          aiResult = JSON.parse(jsonMatch[0])
        } catch (e) {
          return fallbackResponse
        }
      } else {
        return fallbackResponse
      }
    }

    // Validate and sanitize response
    const validatedResponse = {
      score: typeof aiResult.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(aiResult.score))) // Clamp 0-100
        : 0,
      reason: typeof aiResult.reason === 'string' && aiResult.reason.trim()
        ? aiResult.reason.trim().substring(0, 500) // Limit reason length
        : 'No explanation provided',
      metadata: {
        model: data.model || model,
        timestamp: new Date().toISOString(),
        usage: data.usage || {},
        finishReason: data.choices?.[0]?.finish_reason || 'unknown',
      },
    }

    console.log('✅ Lead scored successfully:', validatedResponse.score)
    return validatedResponse
  } catch (err) {
    console.error('❌ AI scoring failed:', err)
    return {
      ...fallbackResponse,
      reason: `Scoring error: ${err.message}`,
      metadata: {
        model,
        timestamp: new Date().toISOString(),
        error: 'exception',
        errorMessage: err.message,
      },
    }
  }
}

/**
 * Score multiple leads in batch (for cron jobs)
 * @param {Array<object>} leads - Array of lead objects
 * @param {object} options - Scoring options
 * @returns {Promise<Array<{leadId: string, score: number, reason: string}>>}
 */
export async function scoreLeadsBatch(leads, options = {}) {
  const {
    batchSize = 5, // Process in small batches to avoid rate limits
    delayBetweenBatches = 1000, // 1 second delay
  } = options

  const results = []

  // Process leads in batches
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize)
    
    const batchPromises = batch.map(async (lead) => {
      try {
        const scoringResult = await scoreLead(lead, options)
        return {
          leadId: lead.id || lead.email || 'unknown',
          ...scoringResult,
        }
      } catch (error) {
        console.error(`Failed to score lead ${lead.id || lead.email}:`, error)
        return {
          leadId: lead.id || lead.email || 'unknown',
          score: 0,
          reason: `Scoring failed: ${error.message}`,
          metadata: { error: 'batch_error' },
        }
      }
    })

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Delay between batches to respect rate limits
    if (i + batchSize < leads.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
    }
  }

  return results
}

/**
 * Build lead context from lead data (handles missing fields)
 * @param {object} leadData - Raw lead data
 * @returns {object} Structured lead context
 */
function buildLeadContext(leadData) {
  if (!leadData || typeof leadData !== 'object') {
    return { hasMinimumData: false }
  }

  const context = {
    // Core fields
    name: leadData.name || 'Unknown',
    email: leadData.email || '',
    company: leadData.company || leadData.organization || '',
    message: leadData.message || leadData.description || leadData.notes || '',
    
    // Additional metadata
    phone: leadData.phone || leadData.phone_number || '',
    website: leadData.website || leadData.url || '',
    industry: leadData.industry || leadData.sector || '',
    companySize: leadData.company_size || leadData.size || leadData.employees || '',
    source: leadData.source || leadData.lead_source || 'unknown',
    assignedTo: leadData.assigned_to || leadData.owner || '',
    
    // UTM and campaign data
    utmCampaign: leadData.utm_campaign || '',
    utmSource: leadData.utm_source || '',
    
    // Tags and categories
    tags: Array.isArray(leadData.tags) ? leadData.tags : [],
    category: leadData.category || '',
    
    // Engagement signals
    engagement: leadData.engagement_score || leadData.activity_score || null,
    
    // Timestamps
    createdAt: leadData.created_at || new Date().toISOString(),
  }

  // Determine if we have minimum data for scoring
  context.hasMinimumData = Boolean(
    context.name !== 'Unknown' ||
    context.email ||
    context.company ||
    context.message
  )

  return context
}

/**
 * Build the scoring prompt from lead context
 * @param {object} context - Lead context object
 * @returns {string} Formatted prompt for OpenAI
 */
function buildScoringPrompt(context) {
  const parts = []

  parts.push('Evaluate this sales lead and provide a score from 0 (cold) to 100 (hot), plus a brief explanation.\n\n')
  parts.push('Lead Information:\n')
  parts.push(`- Name: ${context.name}`)
  
  if (context.company) {
    parts.push(`- Company: ${context.company}`)
  }
  
  if (context.industry) {
    parts.push(`- Industry: ${context.industry}`)
  }
  
  if (context.companySize) {
    parts.push(`- Company Size: ${context.companySize}`)
  }
  
  if (context.email) {
    parts.push(`- Email: ${context.email}`)
  }
  
  if (context.phone) {
    parts.push(`- Phone: ${context.phone}`)
  }
  
  if (context.website) {
    parts.push(`- Website: ${context.website}`)
  }
  
  if (context.message) {
    parts.push(`- Message/Description: ${context.message}`)
  }
  
  if (context.source && context.source !== 'unknown') {
    parts.push(`- Lead Source: ${context.source}`)
  }
  
  if (context.assignedTo) {
    parts.push(`- Assigned To: ${context.assignedTo}`)
  }
  
  if (context.utmCampaign || context.utmSource) {
    parts.push(`- Campaign: ${context.utmCampaign || 'N/A'} | Source: ${context.utmSource || 'N/A'}`)
  }
  
  if (context.tags && context.tags.length > 0) {
    parts.push(`- Tags: ${context.tags.join(', ')}`)
  }

  parts.push('\nProvide your evaluation as JSON with "score" (0-100) and "reason" (brief explanation).')

  return parts.join('\n')
}

/**
 * Rescore a lead (useful for updating scores as context evolves)
 * @param {object} leadData - Full lead object
 * @param {object} options - Scoring options
 * @returns {Promise<{score: number, reason: string}>}
 */
export async function rescoreLead(leadData, options = {}) {
  return scoreLead(leadData, { ...options, useReasoning: true })
}

/**
 * Get scoring provider (for future extensibility)
 * Currently only OpenAI, but can be extended to Claude/Gemini
 */
export function getScoringProvider() {
  return {
    name: 'OpenAI',
    model: 'gpt-4',
    supported: true,
  }
}

