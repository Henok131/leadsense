export async function scoreLead(message) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    console.warn('⚠️ Missing OpenAI API key in .env')
    return { category: 'Cold', score: 0, tags: [] }
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
              'Evaluate this lead and return JSON in the format: {category: "Hot"|"Warm"|"Cold", score: number, tags: [...]}.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    return JSON.parse(content)
  } catch (err) {
    console.error('❌ AI scoring failed:', err)
    return { category: 'Cold', score: 0, tags: [] }
  }
}

