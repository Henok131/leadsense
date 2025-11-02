/**
 * AIPreferences Component
 * AI model and prompt preferences
 */

import { Sparkles } from 'lucide-react'

const AI_MODELS = [
  { value: 'gpt-4', label: 'GPT-4 (OpenAI)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (OpenAI)' },
  { value: 'claude-3', label: 'Claude 3 (Anthropic)' },
  { value: 'mistral', label: 'Mistral' },
  { value: 'gemini', label: 'Gemini (Google)' },
]

const PROMPT_STYLES = [
  { value: 'concise', label: 'Concise' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'creative', label: 'Creative' },
  { value: 'technical', label: 'Technical' },
]

const TOKEN_LIMITS = [512, 1024, 2048, 4096, 8192]

export default function AIPreferences({ aiPreferences, setAiPreferences }) {
  const handleChange = (key, value) => {
    setAiPreferences(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold gradient-text">AI Preferences</h2>
      </div>

      <div className="space-y-6">
        {/* Default AI Model */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Default AI Model
          </label>
          <select
            value={aiPreferences.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {AI_MODELS.map((model) => (
              <option key={model.value} value={model.value} className="bg-dark text-white">
                {model.label}
              </option>
            ))}
          </select>
        </div>

        {/* Token Limit */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Token Limit
          </label>
          <select
            value={aiPreferences.tokens}
            onChange={(e) => handleChange('tokens', parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {TOKEN_LIMITS.map((limit) => (
              <option key={limit} value={limit} className="bg-dark text-white">
                {limit}
              </option>
            ))}
          </select>
        </div>

        {/* Prompt Style */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Prompt Style
          </label>
          <select
            value={aiPreferences.style}
            onChange={(e) => handleChange('style', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {PROMPT_STYLES.map((style) => (
              <option key={style.value} value={style.value} className="bg-dark text-white">
                {style.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

