/**
 * APIKeySettings Component
 * API keys management section
 */

import { Key } from 'lucide-react'

export default function APIKeySettings({ apiKeys, setApiKeys }) {
  const handleApiKeyChange = (key, value) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold gradient-text">API Keys</h2>
      </div>

      <div className="space-y-6">
        {/* Slack API Key */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Slack Webhook URL
          </label>
          <input
            type="password"
            value={apiKeys.slack}
            onChange={(e) => handleApiKeyChange('slack', e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Flowise API Key */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Flowise API Key
          </label>
          <input
            type="password"
            value={apiKeys.flowise}
            onChange={(e) => handleApiKeyChange('flowise', e.target.value)}
            placeholder="Enter your Flowise API key"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* OpenAI API Key */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKeys.openai}
            onChange={(e) => handleApiKeyChange('openai', e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

