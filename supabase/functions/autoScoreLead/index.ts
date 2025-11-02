/**
 * Supabase Edge Function: Auto Score Lead
 * 
 * Automatically scores new leads when inserted into the leads table.
 * 
 * Trigger: Database trigger on INSERT to leads table
 * 
 * Usage:
 * - Deploy: supabase functions deploy autoScoreLead
 * - Set env vars: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - Create database trigger to call this function on INSERT
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://deno.land/x/openai@v4.24.1/mod.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface LeadRecord {
  id: string
  name?: string
  email?: string
  company?: string
  phone?: string
  website?: string
  message?: string
  source?: string
  category?: string
  tags?: string[]
  score?: number
  [key: string]: any
}

interface TriggerPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: LeadRecord
  old_record?: LeadRecord
}

interface ScoringResult {
  score: number
  reason: string
}

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate environment variables
    if (!OPENAI_API_KEY) {
      console.error('❌ Missing OPENAI_API_KEY environment variable')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase credentials')
      return new Response(
        JSON.stringify({ error: 'Supabase credentials not configured' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body (Supabase trigger payload)
    const payload: TriggerPayload = await req.json()

    console.log('📥 Received trigger:', { 
      type: payload.type, 
      table: payload.table, 
      recordId: payload.record?.id 
    })

    // Only process INSERT events
    if (payload.type !== 'INSERT' || !payload.record) {
      console.log('ℹ️ No action needed (not an INSERT event)')
      return new Response(
        JSON.stringify({ message: 'No action needed' }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Score the lead using OpenAI
    const scoringResult = await scoreLeadWithOpenAI(openai, payload.record)

    if (!scoringResult) {
      console.error('❌ Failed to score lead')
      return new Response(
        JSON.stringify({ error: 'Failed to score lead' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update the lead record with AI score and reason
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        ai_score: scoringResult.score,
        ai_reason: scoringResult.reason,
        last_scored_at: new Date().toISOString(),
      })
      .eq('id', payload.record.id)

    if (updateError) {
      console.error('❌ Failed to update lead with AI score:', updateError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update lead', 
          details: updateError.message 
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Lead scored successfully:', { 
      leadId: payload.record.id, 
      score: scoringResult.score 
    })

    return new Response(
      JSON.stringify({
        success: true,
        score: scoringResult.score,
        reason: scoringResult.reason,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('❌ Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})

/**
 * Score a lead using OpenAI GPT-4o-mini
 * @param openai - OpenAI client instance
 * @param leadData - Lead record from Supabase
 * @returns Promise with score and reason, or null on error
 */
async function scoreLeadWithOpenAI(
  openai: OpenAI,
  leadData: LeadRecord
): Promise<ScoringResult | null> {
  try {
    // Build prompt from lead data
    const prompt = buildScoringPrompt(leadData)

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI sales assistant. Score this sales lead from 0 to 100 based on likelihood to convert.

Return your response as valid JSON with this exact format:
{
  "score": <number between 0-100>,
  "reason": "<short explanation (1-2 sentences)>"
}

Scoring Guidelines:
- 0-30: Cold (low intent, minimal engagement, poor fit)
- 31-60: Warm (some interest, needs nurturing, moderate fit)
- 61-80: Hot (strong intent, ready for outreach, good fit)
- 81-100: Very Hot (immediate action needed, high intent, excellent fit)

Consider factors like:
- Explicit interest indicators (requests, inquiries, demo requests)
- Company size and industry relevance
- Engagement signals (form submissions, website activity)
- Data completeness and quality
- Lead source credibility
- Message content and tone`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      console.error('❌ No content in OpenAI response')
      return null
    }

    // Parse JSON response
    let aiResult: ScoringResult
    try {
      aiResult = JSON.parse(content)
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError)
      console.error('Raw content:', content)
      return null
    }

    // Validate and sanitize response
    const validatedResult: ScoringResult = {
      score: typeof aiResult.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(aiResult.score))) // Clamp 0-100
        : 0,
      reason: typeof aiResult.reason === 'string' && aiResult.reason.trim()
        ? aiResult.reason.trim().substring(0, 500) // Limit reason length
        : 'No explanation provided',
    }

    console.log('✅ Scoring result:', validatedResult)
    return validatedResult
  } catch (error) {
    console.error('❌ OpenAI scoring failed:', error)
    return null
  }
}

/**
 * Build the scoring prompt from lead data
 * @param leadData - Lead record
 * @returns Formatted prompt string
 */
function buildScoringPrompt(leadData: LeadRecord): string {
  const parts: string[] = []
  
  parts.push('Here\'s the lead data:\n\n')

  if (leadData.name) {
    parts.push(`Name: ${leadData.name}\n`)
  }
  if (leadData.email) {
    parts.push(`Email: ${leadData.email}\n`)
  }
  if (leadData.company) {
    parts.push(`Company: ${leadData.company}\n`)
  }
  if (leadData.phone) {
    parts.push(`Phone: ${leadData.phone}\n`)
  }
  if (leadData.website) {
    parts.push(`Website: ${leadData.website}\n`)
  }
  if (leadData.message) {
    parts.push(`Message: ${leadData.message}\n`)
  }
  if (leadData.source) {
    parts.push(`Source: ${leadData.source}\n`)
  }
  if (leadData.category) {
    parts.push(`Category: ${leadData.category}\n`)
  }
  if (leadData.tags && Array.isArray(leadData.tags) && leadData.tags.length > 0) {
    parts.push(`Tags: ${leadData.tags.join(', ')}\n`)
  }
  if (leadData.score !== undefined) {
    parts.push(`Current Score: ${leadData.score}\n`)
  }

  parts.push('\nRespond with: { "score": number, "reason": "short explanation" }')

  return parts.join('')
}

