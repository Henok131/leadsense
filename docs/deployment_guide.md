# Deployment Guide - AI Scoring & Automation Layer

## 📋 Prerequisites

- Supabase project set up
- Supabase CLI installed (for local development)
- OpenAI API key (optional, for AI scoring)
- Access to Supabase Dashboard

---

## 🚀 Step-by-Step Deployment

### 1. Set Up Supabase Edge Functions Secrets

#### Via Supabase Dashboard:

1. Go to **Project Settings** → **Edge Functions**
2. Click **Manage secrets**
3. Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SUPABASE_URL` | `https://your-project-id.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | Service role key (found in API settings) |
| `OPENAI_API_KEY` | `sk-your-openai-api-key` | OpenAI API key (optional) |

#### Via Supabase CLI:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key
```

---

### 2. Deploy Edge Functions

#### Deploy `autoScoreLead` Function:

```bash
# Navigate to project root
cd asenay-leadsense

# Deploy the autoScoreLead function
supabase functions deploy autoScoreLead
```

#### Deploy `processUnscoredLeads` Function:

```bash
supabase functions deploy processUnscoredLeads
```

#### Verify Deployment:

```bash
# List deployed functions
supabase functions list
```

You should see both functions listed:
- `autoScoreLead`
- `processUnscoredLeads`

---

### 3. Set Up Database Schema

Ensure your `leads` table includes these columns:

```sql
-- Add scoring columns if they don't exist
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

#### Optional: Create Lead Score Logs Table

```sql
CREATE TABLE IF NOT EXISTS lead_score_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  status VARCHAR(20),
  scoring_method VARCHAR(50),
  error_message TEXT,
  retry_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lead_score_logs_lead_id ON lead_score_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_score_logs_created_at ON lead_score_logs(created_at);
```

---

### 4. Set Up Database Trigger

The trigger should already be configured (as mentioned in requirements), but here's the SQL for reference:

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION trigger_auto_score_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/autoScoreLead',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_lead_insert ON leads;
CREATE TRIGGER on_lead_insert
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION trigger_auto_score_lead();
```

**Note**: Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

**Important**: You may need to enable the `pg_net` extension:

```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

---

### 5. Set Up Background Worker (Optional)

#### Option A: Manual Cron Job (Supabase Dashboard)

1. Go to **Database** → **Cron Jobs** (or **Extensions** → **pg_cron**)
2. Create a new cron job:

```sql
SELECT cron.schedule(
  'process-unscored-leads',  -- Job name
  '*/10 * * * *',            -- Every 10 minutes
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/processUnscoredLeads',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    )
  );
  $$
);
```

#### Option B: External Cron Service

Use a service like [cron-job.org](https://cron-job.org) or GitHub Actions:

```bash
# Call the function endpoint
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/processUnscoredLeads' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

---

### 6. Test the Deployment

#### Test Auto-Scoring Function:

```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/autoScoreLead' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "record": {
      "id": "test-id-123",
      "name": "John Smith",
      "email": "john@acmecorp.com",
      "company": "Acme Corp",
      "job_title": "VP Engineering",
      "message": "We need this ASAP with budget approved"
    }
  }'
```

#### Test Background Worker:

```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/processUnscoredLeads' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

#### Test Database Trigger:

Insert a test lead:

```sql
INSERT INTO leads (name, email, company, message)
VALUES (
  'Test Lead',
  'test@example.com',
  'Test Corp',
  'Test message'
);
```

Then check if scoring completed:

```sql
SELECT id, name, email, score, segment, status, scored_at
FROM leads
WHERE email = 'test@example.com';
```

---

## 🔧 Troubleshooting

### Edge Function Not Working

1. **Check function logs**:
   ```bash
   supabase functions logs autoScoreLead
   ```

2. **Verify secrets are set**:
   ```bash
   supabase secrets list
   ```

3. **Test function manually** (see test section above)

### Database Trigger Not Firing

1. **Check if trigger exists**:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_lead_insert';
   ```

2. **Check pg_net extension**:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_net';
   ```

3. **Test trigger manually**:
   ```sql
   -- Insert a test record
   INSERT INTO leads (name, email, company, message)
   VALUES ('Test', 'test@test.com', 'Test', 'Test');
   ```

### Scoring Returns Errors

1. **Check OpenAI API key** (if using AI scoring)
2. **Review function logs** for detailed error messages
3. **Verify database schema** matches expected structure
4. **Check network connectivity** from Edge Function

### Background Worker Not Processing

1. **Check cron job status** (if using pg_cron)
2. **Verify function URL** in cron job configuration
3. **Check for unscored leads**:
   ```sql
   SELECT COUNT(*) FROM leads
   WHERE status = 'pending' OR score IS NULL;
   ```

---

## 📊 Monitoring

### Check Scoring Status

```sql
-- View all leads with scoring status
SELECT 
  id, 
  name, 
  email, 
  score, 
  segment, 
  status, 
  retry_count,
  scored_at
FROM leads
ORDER BY created_at DESC
LIMIT 20;
```

### Check Failed Leads

```sql
-- View failed leads
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

### Check Scoring Logs

```sql
-- View recent scoring attempts
SELECT 
  lsl.*,
  l.name,
  l.email
FROM lead_score_logs lsl
JOIN leads l ON l.id = lsl.lead_id
ORDER BY lsl.created_at DESC
LIMIT 50;
```

---

## 🔐 Security Notes

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in client-side code
2. **Use environment variables** for all secrets
3. **Restrict Edge Function access** if needed (add authentication)
4. **Monitor API usage** for OpenAI and Supabase quotas
5. **Set up rate limiting** if processing high volumes

---

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase Database Triggers](https://supabase.com/docs/guides/database/triggers)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [pg_net Extension](https://supabase.com/docs/guides/database/extensions/pg_net)

---

**Last Updated**: Phase 7 Implementation  
**Version**: 1.0.0

