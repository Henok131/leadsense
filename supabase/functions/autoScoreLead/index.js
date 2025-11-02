/**
 * Supabase Edge Function: Auto Score Lead
 * 
 * This function is triggered on INSERT to the leads table.
 * It automatically scores new leads using OpenAI GPT-4.
 * 
 * To deploy this function:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Link project: supabase link --project-ref <your-project-ref>
 * 4. Deploy: supabase functions deploy autoScoreLead
 * 
 * To set up as a database trigger:
 * 1. Go to Supabase Dashboard > Database > Triggers
 * 2. Create new trigger on 'leads' table
 * 3. Select 'INSERT' event
 * 4. Call function: autoScoreLead
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body (Supabase trigger payload)
    const { record, old_record, type, table } = await req.json()

    console.log('📥 Received trigger:', { type, table, recordId: record?.id })

    // Validate OpenAI API key
    if (!OPENAI_API_KEY) {
      console.error('❌ Missing OPENAI_API_KEY environment variable')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Only process INSERT events
    if (type !== 'INSERT' || !record) {
      return new Response(
        JSON.stringify({ message: 'No action needed' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Score the lead using OpenAI
    const scoringResult = await scoreLeadWithOpenAI(record)

    // Update the lead record with AI score and reason
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        ai_score: scoringResult.score,
        ai_reason: scoringResult.reason,
        scoring_metadata: scoringResult.metadata,
        last_scored_at: new Date().toISOString(),
      })
      .eq('id', record.id)

    if (updateError) {
      console.error('❌ Failed to update lead with AI score:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update lead', details: updateError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Lead scored successfully:', { leadId: record.id, score: scoringResult.score })

    return new Response(
      JSON.stringify({
        success: true,
        leadId: record.id,
        score: scoringResult.score,
        reason: scoringResult.reason,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('❌ Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

/**
 * Score a lead using OpenAI GPT-4
 * @param {object} leadData - Lead record from Supabase
 * @returns {Promise<{score: number, reason: string, metadata: object}>}
 */
async function scoreLeadWithOpenAI(leadData) {
  const fallbackResponse = {
    score: 0,
    reason: 'Unable to score lead: Missing API key or insufficient data',
    metadata: {
      model: 'fallback',
      timestamp: new Date().toISOString(),
      error: 'fallback_triggered',
    },
  }

  try {
    // Build prompt from lead data
    const prompt = buildScoringPrompt(leadData)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
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
- 81-100: Very Hot (immediate action needed)`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ OpenAI API error:', response.status, errorData)
      return fallbackResponse
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
      return fallbackResponse
    }

    // Validate and sanitize response
    return {
      score: typeof aiResult.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(aiResult.score))) // Clamp 0-100
        : 0,
      reason: typeof aiResult.reason === 'string' && aiResult.reason.trim()
        ? aiResult.reason.trim().substring(0, 500) // Limit reason length
        : 'No explanation provided',
      metadata: {
        model: data.model || 'gpt-4-1106-preview',
        timestamp: new Date().toISOString(),
        usage: data.usage || {},
        finishReason: data.choices?.[0]?.finish_reason || 'unknown',
      },
    }
  } catch (error) {
    console.error('❌ Scoring failed:', error)
    return {
      ...fallbackResponse,
      reason: `Scoring error: ${error.message}`,
      metadata: {
        error: 'exception',
        errorMessage: error.message,
      },
    }
  }
}

/**
 * Build the scoring prompt from lead data
 * @param {object} leadData - Lead record
 * @returns {string} Formatted prompt
 */
function buildScoringPrompt(leadData) {
  const parts = []

  parts.push('Evaluate this sales lead and provide a score from 0 (cold) to 100 (hot), plus a brief explanation.\n\n')
  parts.push('Lead Information:\n')

  if (leadData.name) parts.push(`- Name: ${leadData.name}`)
  if (leadData.company) parts.push(`- Company: ${leadData.company}`)
  if (leadData.email) parts.push(`- Email: ${leadData.email}`)
  if (leadData.phone) parts.push(`- Phone: ${leadData.phone}`)
  if (leadData.website) parts.push(`- Website: ${leadData.website}`)
  if (leadData.message) parts.push(`- Message: ${leadData.message}`)
  if (leadData.source) parts.push(`- Source: ${leadData.source}`)
  if (leadData.category) parts.push(`- Category: ${leadData.category}`)
  if (leadData.tags && Array.isArray(leadData.tags) && leadData.tags.length > 0) {
    parts.push(`- Tags: ${leadData.tags.join(', ')}`)
  }
  if (leadData.score) parts.push(`- Current Score: ${leadData.score}`)

  parts.push('\nProvide your evaluation as JSON with "score" (0-100) and "reason" (brief explanation).')

  return parts.join('\n')
}

