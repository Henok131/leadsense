# ⚡ Quick Start - Deploy AI Scoring System

> **Note**: For VPS deployment, Docker should already be running on your VPS. You don't need Docker on your local Windows machine.

## 🚀 Fast Deployment (5 minutes)

### Step 1: Login & Link (From VPS)
```bash
supabase login
supabase link --project-ref vwryhloimldyaytobnol
```

### Step 2: Set Secrets (Via Dashboard or CLI)
**Via Supabase Dashboard** (Recommended):
- Go to Project Settings → Edge Functions → Manage secrets

**Or via CLI:**
```bash
supabase secrets set SUPABASE_URL=https://vwryhloimldyaytobnol.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set OPENAI_API_KEY=sk-your-openai-key  # Optional
```

### Step 3: Deploy Functions (From VPS)
```bash
supabase functions deploy autoScoreLead
supabase functions deploy processUnscoredLeads
```

### Step 4: Test
```bash
# Test autoScoreLead
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/autoScoreLead' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"record": {"id": "test", "name": "John", "email": "john@example.com", "company": "Acme", "message": "Test"}}'
```

**That's it!** 🎉

---

## 📋 What to Expect

After deployment, when a new lead is inserted:

1. **Database trigger** fires automatically
2. **Edge Function** scores the lead (AI or rule-based)
3. **Lead record** is updated with:
   - `score` (0-100)
   - `confidence` (0-1)
   - `segment` (Enterprise/Mid-Market/SMB)
   - `next_action` (Assign to Sales/Schedule Call/etc.)
   - `tags` (array of topics)
   - `status` (scored)

---

## 🔍 Verify It's Working

```sql
-- Insert a test lead
INSERT INTO leads (name, email, company, message)
VALUES ('Test', 'test@test.com', 'Test Corp', 'Test message');

-- Check scoring completed
SELECT id, name, score, segment, status, scored_at
FROM leads
WHERE email = 'test@test.com';
```

You should see `score`, `segment`, and `status = 'scored'` populated within seconds.

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Function not found | Check deployment: `supabase functions list` |
| 401 Unauthorized | Set secrets in Dashboard |
| 500 Error | Check logs: `supabase functions logs autoScoreLead` |
| Trigger not firing | Verify `pg_net` extension is enabled |

---

## 📚 Full Documentation

- **Deployment Guide**: `docs/deployment_guide.md`
- **System Overview**: `docs/AI_scoring_overview.md`
- **Examples**: `docs/example_lead_scoring.json`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

**Ready to deploy? Run the commands above! 🚀**

