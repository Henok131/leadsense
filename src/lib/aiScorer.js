/**
 * AI Lead Scoring Service
 * Uses OpenAI API to score leads based on provided information
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export async function scoreLead(leadData) {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found. Returning default score.')
    return { score: 50, reasoning: 'AI scoring unavailable - default score assigned.' }
  }

  try {
    const prompt = `Score this lead on a scale of 0-100 based on:
    - Name: ${leadData.name || 'N/A'}
    - Email: ${leadData.email || 'N/A'}
    - Company: ${leadData.company || 'N/A'}
    - Message: ${leadData.message || 'N/A'}
    
    Return a JSON object with "score" (0-100) and "reasoning" (brief explanation).`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a lead scoring assistant. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON from response
    const parsed = JSON.parse(content)
    return {
      score: parsed.score || 50,
      reasoning: parsed.reasoning || 'Score calculated by AI.',
    }
  } catch (error) {
    console.error('Error scoring lead:', error)
    return {
      score: 50,
      reasoning: `Error during AI scoring: ${error.message}`,
    }
  }
}


