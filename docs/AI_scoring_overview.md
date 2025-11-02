# AI Scoring & Automation Layer Overview

**Phase 7: Asenay LeadSense**

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Flow](#architecture-flow)
3. [Scoring Logic](#scoring-logic)
4. [Background Processing](#background-processing)
5. [Database Schema](#database-schema)
6. [Configuration](#configuration)
7. [Error Handling & Retries](#error-handling--retries)

---

## 🎯 System Overview

The AI Scoring & Automation Layer automatically evaluates leads in real-time when they are inserted into the `leads` table. It uses a hybrid approach combining:

- **AI-Based Scoring** (Primary): Uses OpenAI GPT-3.5-turbo for intelligent lead analysis
- **Rule-Based Fallback** (Secondary): Automatic fallback when AI is unavailable or fails

### Key Features

- ✅ Real-time scoring via database triggers
- ✅ Rule-based fallback for reliability
- ✅ Background job processing for async workloads
- ✅ Retry logic with maximum attempts
- ✅ Comprehensive metadata enrichment
- ✅ Scoring attempt logging

---

## 🔄 Architecture Flow

### Primary Flow (Real-time Trigger)

```
┌─────────────┐
│  New Lead   │
│  Inserted   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Supabase Database Trigger       │
│  (pg_net.http_post)              │
└──────┬───────────────────────────┘
       │
       │ HTTP POST
       ▼
┌─────────────────────────────────┐
│  Edge Function: autoScoreLead    │
│  (supabase/functions/autoScoreLead)│
└──────┬───────────────────────────┘
       │
       ├─► Try AI Scoring (OpenAI)
       │   │
       │   ├─► Success ──┐
       │   │             │
       │   └─► Fail ─────┼─► Fallback to Rules
       │                 │
       └─────────────────┤
                         │
                         ▼
              ┌──────────────────────┐
              │  Update Lead Record  │
              │  - score             │
              │  - confidence        │
              │  - segment           │
              │  - next_action       │
              │  - tags              │
              │  - model_version     │
              │  - status            │
              └──────────────────────┘
```

### Background Processing Flow

```
┌──────────────────┐
│  Cron Job /      │
│  Manual Trigger  │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Edge Function: processUnscoredLeads│
│  (supabase/functions/processUnscoredLeads)│
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Fetch Unscored Leads              │
│  - status = 'pending' or NULL      │
│  - score = NULL                    │
│  - retry_count < 3                 │
│  - Limit: 10 per batch             │
└────────┬───────────────────────────┘
         │
         ▼
    ┌────────┐
    │  For   │
    │  Each  │
    │  Lead  │
    └───┬────┘
        │
        ├─► Call autoScoreLead
        │
        ├─► Success ──► Update status = 'scored'
        │
        └─► Fail ──► Increment retry_count
                     │
                     ├─► retry_count < 3 ──► status = 'pending' (retry later)
                     │
                     └─► retry_count >= 3 ──► status = 'error'
```

---

## 🧠 Scoring Logic

### AI-Based Scoring (Primary Method)

**Model**: OpenAI GPT-3.5-turbo  
**Input**: Lead data (name, email, company, job_title, message)  
**Output**: Enhanced scoring object

#### AI Prompt Structure

The AI receives structured lead data and is instructed to return:
- `score` (0-100): Overall lead quality
- `confidence` (0-1): Assessment confidence
- `segment`: 'Enterprise', 'Mid-Market', or 'SMB'
- `next_action`: Recommended action
- `tags`: Array of inferred topics

#### AI Response Format

```json
{
  "score": 85,
  "confidence": 0.92,
  "segment": "Enterprise",
  "next_action": "Assign to Sales",
  "tags": ["executive", "high-intent", "enterprise-email", "urgent"]
}
```

### Rule-Based Fallback (Secondary Method)

When AI scoring fails or is unavailable, the system automatically falls back to rule-based scoring.

#### Scoring Rules

| Factor | Condition | Score Adjustment | Tag Added |
|--------|-----------|------------------|-----------|
| **Email Domain** | Enterprise domain (not gmail/yahoo/outlook/hotmail) | +15 | `enterprise-email` |
| **Job Title** | Contains executive keywords (CEO, CTO, VP, Director, Manager, Founder) | +20 | `executive` |
| **Company Structure** | Contains business keywords (Inc, Corp, LLC, Ltd, Enterprises, Group) | +10 | `established-company` |
| **High-Intent Keywords** | Message contains urgent/purchase keywords (urgent, ASAP, budget, pricing, quote, ready, decision) | +15 | `high-intent` |
| **Company Name** | Company field present and >2 chars | +5 | `has-company` |
| **Message Detail** | Message length >50 chars | +5 | `detailed-message` |

**Base Score**: 50  
**Range**: 0-100 (clamped)

#### Segment Determination (Rule-Based)

- **Enterprise**: score ≥ 70
- **Mid-Market**: score 50-69
- **SMB**: score < 50

#### Confidence Calculation (Rule-Based)

```
confidence = 0.5 + (data_points * 0.08)
max = 0.9
```

Where `data_points` is the count of:
- Email present
- Company present
- Message present
- Executive title detected
- Enterprise email detected

#### Next Action (Rule-Based)

- **score ≥ 80**: "Assign to Sales"
- **score 60-79**: "Schedule Call"
- **score 40-59**: "Send Nurture Email"
- **score < 40**: "Auto-Reply"

---

## 🔄 Background Processing

### When Background Processing Runs

1. **Cron Job**: Set up in Supabase to run every 5-10 minutes
2. **Manual Trigger**: Call the function endpoint directly
3. **Automatic**: Triggered when scoring takes >3 seconds (optional)

### Processing Behavior

- **Batch Size**: 10 leads per execution
- **Retry Limit**: 3 attempts per lead
- **Status Tracking**: `pending` → `processing` → `scored` / `error`

### Retry Logic

```
Attempt 1: status = 'pending', retry_count = 0
  └─► Fail ──► retry_count = 1, status = 'pending'

Attempt 2: status = 'pending', retry_count = 1
  └─► Fail ──► retry_count = 2, status = 'pending'

Attempt 3: status = 'pending', retry_count = 2
  └─► Fail ──► retry_count = 3, status = 'error' (no more retries)
```

---

## 📊 Database Schema

### Leads Table (Required Columns)

The `leads` table must include these columns for the scoring system:

```sql
-- Scoring fields
score INTEGER              -- Lead score (0-100)
confidence NUMERIC(3,2)   -- Confidence level (0.00-1.00)
segment VARCHAR(20)        -- 'Enterprise', 'Mid-Market', 'SMB'
next_action VARCHAR(50)    -- Recommended action
tags TEXT[]               -- Array of tags
model_version VARCHAR(20) -- Scoring model version
status VARCHAR(20)        -- 'pending', 'processing', 'scored', 'error'
scored_at TIMESTAMP       -- When scoring completed

-- Retry fields (for background processing)
retry_count INTEGER DEFAULT 0
last_error TEXT
last_retry_at TIMESTAMP

-- Standard lead fields
id UUID PRIMARY KEY
name VARCHAR(255)
email VARCHAR(255)
company VARCHAR(255)
job_title VARCHAR(255)
message TEXT
created_at TIMESTAMP DEFAULT NOW()
```

### Lead Score Logs Table (Optional)

For tracking scoring attempts:

```sql
CREATE TABLE lead_score_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  status VARCHAR(20),           -- 'success', 'failed'
  scoring_method VARCHAR(50),   -- 'ai', 'rule-based', 'background-worker'
  error_message TEXT,
  retry_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Database Trigger (Already Configured)

The trigger calls the Edge Function when a new lead is inserted:

```sql
-- Example trigger (you may need to adjust based on your setup)
CREATE OR REPLACE FUNCTION trigger_auto_score_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://YOUR_PROJECT.supabase.co/functions/v1/autoScoreLead',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lead_insert
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION trigger_auto_score_lead();
```

---

## ⚙️ Configuration

### Environment Variables

Required in Supabase Edge Function secrets:

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (full access) | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI scoring | No (falls back to rules) |

### Setting Edge Function Secrets

In Supabase Dashboard:
1. Go to **Project Settings** → **Edge Functions**
2. Click **Manage secrets**
3. Add the required environment variables

Or via CLI:
```bash
supabase secrets set OPENAI_API_KEY=your_key_here
supabase secrets set SUPABASE_URL=your_url_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

---

## 🛡️ Error Handling & Retries

### Error Categories

1. **API Errors**: OpenAI API failures, network issues
2. **Data Errors**: Missing lead data, invalid format
3. **Database Errors**: Update failures, connection issues

### Fallback Strategy

```
AI Scoring Attempt
  │
  ├─► Success ──► Use AI result
  │
  └─► Fail ──► Rule-Based Fallback
               │
               └─► Always succeeds (local logic)
```

### Retry Behavior

- **Real-time Scoring**: No retries (falls back immediately)
- **Background Processing**: Up to 3 retry attempts
- **Error Logging**: All errors logged to `lead_score_logs` table (if exists)

### Status Values

| Status | Meaning | Action |
|--------|---------|--------|
| `pending` | Awaiting scoring | Will be processed by background worker |
| `processing` | Currently being scored | Temporary state |
| `scored` | Successfully scored | Complete |
| `error` | Failed after max retries | Manual review required |

---

## 🚀 Deployment

### 1. Deploy Edge Functions

```bash
# Deploy autoScoreLead
supabase functions deploy autoScoreLead

# Deploy background worker
supabase functions deploy processUnscoredLeads
```

### 2. Set Environment Variables

Configure secrets in Supabase Dashboard or CLI.

### 3. Verify Trigger

Ensure the database trigger is set up correctly.

### 4. Test Scoring

Insert a test lead and verify scoring completes.

---

## 📝 Example Usage

### Test Lead Input

```json
{
  "name": "John Smith",
  "email": "john.smith@acmecorp.com",
  "company": "Acme Corporation Inc",
  "job_title": "VP of Engineering",
  "message": "We're looking for a solution ASAP and have budget approved. Can we schedule a call this week?"
}
```

### Expected Output (AI Scoring)

```json
{
  "score": 92,
  "confidence": 0.95,
  "segment": "Enterprise",
  "next_action": "Assign to Sales",
  "tags": ["executive", "high-intent", "enterprise-email", "urgent", "budget-approved"],
  "model_version": "1.0.0"
}
```

### Expected Output (Rule-Based Fallback)

```json
{
  "score": 75,
  "confidence": 0.82,
  "segment": "Enterprise",
  "next_action": "Assign to Sales",
  "tags": ["enterprise-email", "executive", "high-intent", "established-company", "has-company", "detailed-message"],
  "model_version": "rule-based-fallback"
}
```

---

## 🔍 Monitoring & Debugging

### Check Scoring Status

```sql
-- View unscored leads
SELECT id, name, email, status, retry_count, last_error
FROM leads
WHERE status = 'pending' OR score IS NULL;

-- View failed leads
SELECT id, name, email, status, retry_count, last_error, last_retry_at
FROM leads
WHERE status = 'error';

-- View scoring logs
SELECT * FROM lead_score_logs
ORDER BY created_at DESC
LIMIT 50;
```

### Test Edge Function Manually

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/autoScoreLead' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "record": {
      "id": "uuid-here",
      "name": "Test Lead",
      "email": "test@example.com",
      "company": "Test Corp",
      "message": "Test message"
    }
  }'
```

---

## 📚 Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Database Triggers Guide](https://supabase.com/docs/guides/database/triggers)

---

**Last Updated**: Phase 7 Implementation  
**Version**: 1.0.0

