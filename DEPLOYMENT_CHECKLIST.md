# 🚀 Deployment Checklist - AI Scoring System

## Pre-Deployment Steps

### ✅ 1. Verify Supabase CLI is Installed

```bash
supabase --version
```

If not installed:
```bash
npm install -g supabase
```

### ✅ 2. Login to Supabase

```bash
supabase login
```

### ✅ 3. Link to Your Project

```bash
supabase link --project-ref your-project-ref
```

Get your project ref from: `https://app.supabase.com/project/YOUR_PROJECT`

---

## 🔐 Set Environment Variables

### Via Supabase Dashboard (Recommended)

1. Go to **Project Settings** → **Edge Functions**
2. Click **Manage secrets**
3. Add these secrets:

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `SUPABASE_URL` | Your project URL | Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Project Settings → API |
| `OPENAI_API_KEY` | OpenAI API key (optional) | https://platform.openai.com/api-keys |

### Via CLI (Alternative)

```bash
supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key-here  # Optional
```

---

## 📦 Deploy Functions

### Deploy autoScoreLead

```bash
supabase functions deploy autoScoreLead
```

**Expected Output:**
```
Deploying function autoScoreLead...
Function autoScoreLead deployed successfully.
```

### Deploy processUnscoredLeads

```bash
supabase functions deploy processUnscoredLeads
```

**Expected Output:**
```
Deploying function processUnscoredLeads...
Function processUnscoredLeads deployed successfully.
```

---

## ✅ Verify Deployment

### Check Deployed Functions

```bash
supabase functions list
```

You should see both functions:
- `autoScoreLead`
- `processUnscoredLeads`

### View Function Logs

```bash
# View autoScoreLead logs
supabase functions logs autoScoreLead

# View processUnscoredLeads logs
supabase functions logs processUnscoredLeads
```

---

## 🧪 Test Functions

### Test autoScoreLead

```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/autoScoreLead' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "record": {
      "id": "test-id-123",
      "name": "John Smith",
      "email": "john.smith@acmecorp.com",
      "company": "Acme Corporation Inc",
      "job_title": "VP of Engineering",
      "message": "We'\''re looking for a solution ASAP and have budget approved."
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "lead_id": "test-id-123",
  "scoring_method": "ai" or "rule-based",
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

### Test processUnscoredLeads

```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/processUnscoredLeads' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

**Expected Response:**
```json
{
  "success": true,
  "processed": 0,
  "message": "No unscored leads to process"
}
```

---

## 🗄️ Database Setup

### Verify Database Schema

Make sure your `leads` table has these columns:

```sql
-- Check existing columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads';

-- Add missing columns if needed
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS score INTEGER,
ADD COLUMN IF NOT EXISTS confidence NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS segment VARCHAR(20),
ADD COLUMN IF NOT EXISTS next_action VARCHAR(50),
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS model_version VARCHAR(20),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS scored_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_error TEXT,
ADD COLUMN IF NOT EXISTS last_retry_at TIMESTAMP;
```

### Verify Database Trigger

Check if trigger exists and points to correct function:

```sql
-- Check trigger
SELECT * FROM pg_trigger WHERE tgname = 'on_lead_insert';

-- Verify pg_net extension
SELECT * FROM pg_extension WHERE extname = 'pg_net';

-- If pg_net is not enabled:
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Test Trigger

Insert a test lead:

```sql
INSERT INTO leads (name, email, company, job_title, message)
VALUES (
  'Test Lead',
  'test@example.com',
  'Test Corp',
  'Test Manager',
  'Test message'
);
```

Check if scoring completed:

```sql
SELECT id, name, email, score, segment, status, scored_at
FROM leads
WHERE email = 'test@example.com';
```

---

## 📊 Post-Deployment Verification

### Check Scoring Results

```sql
-- View recently scored leads
SELECT 
  id, 
  name, 
  email, 
  score, 
  confidence, 
  segment, 
  next_action, 
  tags,
  status,
  scored_at
FROM leads
WHERE scored_at IS NOT NULL
ORDER BY scored_at DESC
LIMIT 10;
```

### Check for Errors

```sql
-- View leads with errors
SELECT 
  id, 
  name, 
  email, 
  status, 
  retry_count, 
  last_error,
  last_retry_at
FROM leads
WHERE status = 'error'
ORDER BY last_retry_at DESC;
```

---

## 🔧 Troubleshooting

### Function Deployment Fails

1. **Check Supabase CLI version**: `supabase --version`
2. **Verify you're logged in**: `supabase projects list`
3. **Check project link**: `supabase link --project-ref YOUR_REF`
4. **Verify secrets are set**: Check in Supabase Dashboard

### Function Returns Errors

1. **Check function logs**: `supabase functions logs autoScoreLead`
2. **Verify secrets**: Make sure all required secrets are set
3. **Test function manually**: Use curl command above
4. **Check database permissions**: Service role key should have write access

### Scoring Not Working

1. **Verify trigger exists**: Run SQL query above
2. **Check pg_net extension**: Should be enabled
3. **Test trigger manually**: Insert a test lead
4. **Check function URL in trigger**: Should match your project URL

### Background Worker Not Running

1. **Set up cron job**: See deployment guide
2. **Test manually**: Use curl command
3. **Check for pending leads**: Query database for `status = 'pending'`

---

## 📝 Next Steps After Deployment

1. ✅ Set up background worker cron job (optional)
2. ✅ Monitor function logs for first few days
3. ✅ Review scoring results in database
4. ✅ Set up alerts for failed scoring (optional)
5. ✅ Create dashboards for scoring metrics (optional)

---

## 📞 Support Resources

- **Documentation**: `docs/AI_scoring_overview.md`
- **Deployment Guide**: `docs/deployment_guide.md`
- **Examples**: `docs/example_lead_scoring.json`
- **Supabase Docs**: https://supabase.com/docs/guides/functions

---

**Good luck with your deployment! 🚀**

