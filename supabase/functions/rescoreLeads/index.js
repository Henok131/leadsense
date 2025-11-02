/**
 * Supabase Edge Function: Rescore Leads (Cron Job)
 * 
 * This function can be called via a cron job to rescore active leads.
 * 
 * Cron Schedule: 0 2 * * * (2AM UTC daily)
 * 
 * To deploy:
 * 1. supabase functions deploy rescoreLeads
 * 2. Set up cron job in Supabase Dashboard > Database > Cron Jobs
 * 
 * To test manually:
 * curl -X POST https://<your-project>.supabase.co/functions/v1/rescoreLeads \
 *   -H "Authorization: Bearer <anon-key>" \
 *   -H "Content-Type: application/json"
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

    // Validate OpenAI API key
    if (!OPENAI_API_KEY) {
      console.error('❌ Missing OPENAI_API_KEY environment variable')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body for optional parameters
    const { daysOld = 7, limit = 50 } = await req.json().catch(() => ({}))

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch leads that need rescoring
    const { data: leads, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .or(`created_at.gte.${new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString()},updated_at.gte.${new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString()}`)
      .limit(limit)

    if (fetchError) {
      console.error('❌ Failed to fetch leads:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch leads', details: fetchError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!leads || leads.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No leads to rescore', count: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`🔄 Rescoring ${leads.length} leads...`)

    // Score each lead
    const results = []
    for (const lead of leads) {
      try {
        const scoringResult = await scoreLeadWithOpenAI(lead)

        // Update the lead record
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            ai_score: scoringResult.score,
            ai_reason: scoringResult.reason,
            scoring_metadata: scoringResult.metadata,
            last_scored_at: new Date().toISOString(),
          })
          .eq('id', lead.id)

        if (updateError) {
          console.error(`❌ Failed to update lead ${lead.id}:`, updateError)
          results.push({
            leadId: lead.id,
            success: false,
            error: updateError.message,
          })
        } else {
          results.push({
            leadId: lead.id,
            success: true,
            score: scoringResult.score,
          })
        }

        // Rate limiting: delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`❌ Error scoring lead ${lead.id}:`, error)
        results.push({
          leadId: lead.id,
          success: false,
          error: error.message,
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    console.log(`✅ Rescoring complete: ${successCount} successful, ${failureCount} failed`)

    return new Response(
      JSON.stringify({
        success: true,
        total: leads.length,
        successful: successCount,
        failed: failureCount,
        results,
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
 * (Same as autoScoreLead function)
 */
async function scoreLeadWithOpenAI(leadData) {
  // ... (same implementation as autoScoreLead)
  // For brevity, including the same logic
  const fallbackResponse = {
    score: 0,
    reason: 'Unable to score lead',
    metadata: { model: 'fallback', timestamp: new Date().toISOString() },
  }

  try {
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
            content: 'You are an expert sales lead evaluation AI. Return JSON: {"score": 0-100, "reason": "..."}',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) return fallbackResponse

    const data = await response.json()
    const aiResult = JSON.parse(data.choices[0].message.content)

    return {
      score: Math.max(0, Math.min(100, Math.round(aiResult.score))),
      reason: (aiResult.reason || '').substring(0, 500),
      metadata: {
        model: data.model,
        timestamp: new Date().toISOString(),
        usage: data.usage || {},
      },
    }
  } catch (error) {
    return { ...fallbackResponse, reason: `Error: ${error.message}` }
  }
}

function buildScoringPrompt(leadData) {
  const parts = ['Evaluate this sales lead:\n\n']
  if (leadData.name) parts.push(`Name: ${leadData.name}\n`)
  if (leadData.company) parts.push(`Company: ${leadData.company}\n`)
  if (leadData.email) parts.push(`Email: ${leadData.email}\n`)
  if (leadData.message) parts.push(`Message: ${leadData.message}\n`)
  parts.push('\nReturn JSON with score (0-100) and reason.')
  return parts.join('')
}

