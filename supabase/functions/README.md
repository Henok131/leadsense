# Supabase Edge Functions - AI Scoring System

This directory contains the Edge Functions for the Asenay LeadSense AI Scoring & Automation Layer.

## 📁 Functions

### 1. `autoScoreLead`

**Purpose**: Automatically scores leads in real-time when inserted into the database.

**Trigger**: Called by database trigger (`pg_net.http_post`) when a new lead is inserted.

**Features**:
- AI-based scoring using OpenAI GPT-3.5-turbo
- Rule-based fallback when AI fails
- Returns: `score`, `confidence`, `segment`, `next_action`, `tags`, `model_version`
- Updates lead record with scoring results

**Endpoint**: `https://YOUR_PROJECT.supabase.co/functions/v1/autoScoreLead`

**Method**: `POST`

**Request Body**:
```json
{
  "record": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john@example.com",
    "company": "Acme Corp",
    "job_title": "VP Engineering",
    "message": "Lead message here"
  }
}
```

**Response**:
```json
{
  "success": true,
  "lead_id": "uuid",
  "scoring_method": "ai" | "rule-based",
  "result": {
    "score": 85,
    "confidence": 0.92,
    "segment": "Enterprise",
    "next_action": "Assign to Sales",
    "tags": ["executive", "high-intent"],
    "model_version": "1.0.0"
  }
}
```

---

### 2. `processUnscoredLeads`

**Purpose**: Background worker that processes unscored leads asynchronously.

**Trigger**: 
- Cron job (e.g., every 10 minutes)
- Manual API call
- Scheduled task

**Features**:
- Processes batch of unscored leads (up to 10 per run)
- Retry logic (max 3 attempts per lead)
- Status tracking (`pending` → `processing` → `scored` / `error`)
- Error logging

**Endpoint**: `https://YOUR_PROJECT.supabase.co/functions/v1/processUnscoredLeads`

**Method**: `POST`

**Response**:
```json
{
  "success": true,
  "processed": 5,
  "successful": 4,
  "failed": 1,
  "errors": ["Lead uuid: Error message"]
}
```

---

## 🚀 Deployment

### Prerequisites

1. Supabase CLI installed
2. Supabase project linked
3. Secrets configured (see main docs)

### Deploy Functions

```bash
# Deploy autoScoreLead
supabase functions deploy autoScoreLead

# Deploy processUnscoredLeads
supabase functions deploy processUnscoredLeads
```

### Set Secrets

```bash
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set OPENAI_API_KEY=your-openai-api-key
```

---

## 🧪 Testing

### Test autoScoreLead

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/autoScoreLead' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "record": {
      "id": "test-id",
      "name": "Test Lead",
      "email": "test@example.com",
      "company": "Test Corp",
      "message": "Test message"
    }
  }'
```

### Test processUnscoredLeads

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/processUnscoredLeads' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

---

## 📊 Monitoring

### View Function Logs

```bash
# View autoScoreLead logs
supabase functions logs autoScoreLead

# View processUnscoredLeads logs
supabase functions logs processUnscoredLeads
```

### Check Function Status

```bash
# List all deployed functions
supabase functions list
```

---

## 🔧 Local Development

### Run Function Locally

```bash
# Run autoScoreLead locally
supabase functions serve autoScoreLead

# Run processUnscoredLeads locally
supabase functions serve processUnscoredLeads
```

### Test Locally

```bash
# Test autoScoreLead locally
curl -X POST 'http://localhost:54321/functions/v1/autoScoreLead' \
  -H 'Authorization: Bearer YOUR_LOCAL_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"record": {...}}'
```

---

## 📝 Code Structure

### autoScoreLead/index.ts

- `ruleBasedFallback()`: Rule-based scoring logic
- `aiBasedScoring()`: AI-based scoring using OpenAI
- Main handler: Processes requests and updates database

### processUnscoredLeads/index.ts

- Fetches unscored leads from database
- Calls autoScoreLead for each lead
- Handles retries and error logging

---

## 🔐 Security

1. **Service Role Key**: Only used in Edge Functions, never exposed to client
2. **API Keys**: Stored as Supabase secrets, not in code
3. **CORS**: Configured for Supabase origins only
4. **Authentication**: Uses Supabase service role for database operations

---

## 📚 Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Deno Runtime Documentation](https://deno.land/manual)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)

---

**Version**: 1.0.0  
**Last Updated**: Phase 7 Implementation

