/**
 * Unit Tests for AI Scoring Module
 * 
 * Run with: npm test -- aiScoring.test.js
 * 
 * Note: These tests use mocks to avoid calling the actual OpenAI API.
 * In production, you'd want integration tests with actual API calls.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { scoreLead, scoreLeadsBatch, rescoreLead } from '../../src/lib/aiScoring'

// Mock OpenAI API
const mockOpenAIResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          score: 85,
          reason: 'High intent lead with strong engagement signals.',
        }),
      },
      finish_reason: 'stop',
    },
  ],
  model: 'gpt-4-1106-preview',
  usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
}

// Mock fetch globally
global.fetch = vi.fn()

describe('AI Scoring Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set default mock API key
    process.env.VITE_OPENAI_API_KEY = 'test-api-key'
  })

  describe('scoreLead', () => {
    it('should score a lead with complete data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOpenAIResponse,
      })

      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        message: 'Interested in your product',
        source: 'LinkedIn',
      }

      const result = await scoreLead(leadData)

      expect(result.score).toBe(85)
      expect(result.reason).toContain('High intent')
      expect(result.metadata).toBeDefined()
      expect(result.metadata.model).toBe('gpt-4-1106-preview')
    })

    it('should handle missing API key gracefully', async () => {
      delete process.env.VITE_OPENAI_API_KEY

      const result = await scoreLead({
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(result.score).toBe(0)
      expect(result.reason).toContain('Missing API key')
    })

    it('should handle insufficient data gracefully', async () => {
      process.env.VITE_OPENAI_API_KEY = 'test-key'

      const result = await scoreLead({})

      expect(result.score).toBe(0)
      expect(result.reason).toContain('Insufficient data')
    })

    it('should clamp scores to 0-100 range', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  score: 150, // Invalid score
                  reason: 'Test reason',
                }),
              },
              finish_reason: 'stop',
            },
          ],
          model: 'gpt-4-1106-preview',
        }),
      })

      const result = await scoreLead({
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(result.score).toBe(100) // Clamped to max
    })

    it('should handle API errors gracefully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      })

      const result = await scoreLead({
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(result.score).toBe(0)
      expect(result.reason).toContain('API error')
    })

    it('should handle network errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await scoreLead({
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(result.score).toBe(0)
      expect(result.reason).toContain('Network error')
    })
  })

  describe('scoreLeadsBatch', () => {
    it('should score multiple leads in batch', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ...mockOpenAIResponse,
            choices: [
              {
                message: {
                  content: JSON.stringify({ score: 75, reason: 'First lead' }),
                },
                finish_reason: 'stop',
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ...mockOpenAIResponse,
            choices: [
              {
                message: {
                  content: JSON.stringify({ score: 90, reason: 'Second lead' }),
                },
                finish_reason: 'stop',
              },
            ],
          }),
        })

      const leads = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ]

      const results = await scoreLeadsBatch(leads, { batchSize: 2 })

      expect(results).toHaveLength(2)
      expect(results[0].leadId).toBe('1')
      expect(results[0].score).toBe(75)
      expect(results[1].leadId).toBe('2')
      expect(results[1].score).toBe(90)
    })

    it('should handle errors in batch processing', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockOpenAIResponse,
        })
        .mockRejectedValueOnce(new Error('Network error'))

      const leads = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ]

      const results = await scoreLeadsBatch(leads)

      expect(results).toHaveLength(2)
      expect(results[0].score).toBe(85)
      expect(results[1].score).toBe(0) // Failed
      expect(results[1].reason).toContain('Scoring failed')
    })
  })

  describe('rescoreLead', () => {
    it('should rescore a lead', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOpenAIResponse,
      })

      const result = await rescoreLead({
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(result.score).toBe(85)
      expect(result.reason).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null/undefined lead data', async () => {
      const result = await scoreLead(null)
      expect(result.score).toBe(0)
      expect(result.reason).toContain('Insufficient data')
    })

    it('should handle malformed JSON responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: 'This is not JSON {invalid',
              },
              finish_reason: 'stop',
            },
          ],
        }),
      })

      const result = await scoreLead({
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(result.score).toBe(0)
      expect(result.reason).toContain('Unable to score')
    })

    it('should handle empty strings in lead data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOpenAIResponse,
      })

      const result = await scoreLead({
        name: '',
        email: '',
        company: '',
      })

      // Should still attempt to score (may fail gracefully)
      expect(result).toBeDefined()
    })
  })
})

