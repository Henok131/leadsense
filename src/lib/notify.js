export async function notifyLead(lead) {
  if (lead.category !== 'Hot') return

  const webhook = import.meta.env.VITE_SLACK_WEBHOOK_URL
  if (!webhook) {
    console.warn('⚠️ Missing Slack webhook URL in .env')
    return
  }

  const payload = {
    text: `🔥 New HOT lead: ${lead.name} (${lead.email}) — ${lead.message}`,
  }

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('❌ Slack notification failed:', err)
  }
}

