/**
 * Notification Service
 * Sends notifications to Slack webhook when high-value leads are submitted
 */

const SLACK_WEBHOOK_URL = import.meta.env.VITE_SLACK_WEBHOOK_URL

export async function notifySlack(leadData, score) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('Slack webhook URL not found. Skipping notification.')
    return false
  }

  try {
    const message = {
      text: '🎯 New High-Value Lead Submitted!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 New High-Value Lead Submitted!',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Name:*\n${leadData.name || 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${leadData.email || 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Company:*\n${leadData.company || 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Score:*\n${score}/100`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${leadData.message || 'No message provided'}`,
          },
        },
      ],
    }

    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error('Error sending Slack notification:', error)
    return false
  }
}


