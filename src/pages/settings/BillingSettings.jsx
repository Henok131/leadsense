/**
 * BillingSettings Component
 * Billing preferences and plan management
 */

import { CreditCard, Crown, Zap, Sparkles } from 'lucide-react'

const PLANS = {
  Free: { icon: Sparkles, color: 'text-gray-400', bg: 'bg-gray-500/20' },
  Starter: { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  Pro: { icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/20' },
}

export default function BillingSettings({ billingEmail, setBillingEmail, plan, autoRenew, setAutoRenew }) {
  const planInfo = PLANS[plan] || PLANS.Free
  const PlanIcon = planInfo.icon

  return (
    <div className="glass-card-premium p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold gradient-text">Billing</h2>
      </div>

      <div className="space-y-6">
        {/* Billing Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Billing Email
          </label>
          <input
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            placeholder="billing@example.com"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Plan Display */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Current Plan
          </label>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${planInfo.bg} border-white/10`}>
            <PlanIcon className={`w-5 h-5 ${planInfo.color}`} />
            <span className={`font-bold ${planInfo.color} text-lg`}>{plan}</span>
            <span className="ml-auto text-xs text-gray-400">(Read-only)</span>
          </div>
        </div>

        {/* Auto-Renewal */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Auto-Renewal
            </label>
            <p className="text-xs text-gray-400">Automatically renew your subscription</p>
          </div>
          <button
            onClick={() => setAutoRenew(!autoRenew)}
            disabled={plan === 'Free'}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
              autoRenew ? 'bg-primary' : 'bg-gray-600'
            } ${plan === 'Free' ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={plan === 'Free' ? 'Not available on Free plan' : undefined}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                autoRenew ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

