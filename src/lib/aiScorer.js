/**
 * Scores a lead using OpenAI GPT-4
 * @param {string} message - The lead message to score
 * @returns {Promise<{category: string, score: number, tags: string[]}>}
 */
export async function scoreLead(message) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  // Default fallback response
  const fallbackResponse = { category: 'Cold', score: 0, tags: [] }

  if (!apiKey) {
    console.warn('⚠️ Missing OpenAI API key in .env')
    return fallbackResponse
  }

  if (!message || !message.trim()) {
    console.warn('⚠️ Empty message provided to AI scorer')
    return fallbackResponse
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content:
              'Evaluate this lead and return ONLY valid JSON in the format: {"category": "Hot"|"Warm"|"Cold", "score": number (0-100), "tags": [...]}. Do not include any text outside the JSON object.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    })

    // Check if API call failed
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error('❌ OpenAI API error:', res.status, errorData)
      return fallbackResponse
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('❌ No content in AI response')
      return fallbackResponse
    }

    // Parse JSON response
    let aiResult
    try {
      // Clean content in case there's extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonContent = jsonMatch ? jsonMatch[0] : content
      aiResult = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError)
      console.error('Raw content:', content)
      return fallbackResponse
    }

    // Validate and sanitize response
    const validatedResponse = {
      category: ['Hot', 'Warm', 'Cold'].includes(aiResult.category)
        ? aiResult.category
        : 'Cold',
      score: typeof aiResult.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(aiResult.score))) // Clamp 0-100
        : 0,
      tags: Array.isArray(aiResult.tags)
        ? aiResult.tags.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim())
        : [],
    }

    return validatedResponse
  } catch (err) {
    console.error('❌ AI scoring failed:', err)
    return fallbackResponse
  }
}

