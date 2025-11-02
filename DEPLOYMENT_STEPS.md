# 🚀 Deployment Steps - Simple Test First

## Step 1: Test Deployment with Simple Function

Before deploying the full complex implementation, let's test with a simple version.

### Option A: Use Simple Test Version

**On your VPS**, temporarily backup the full implementation and use the simple test:

```bash
# SSH into your VPS
ssh user@your-vps

# Navigate to project
cd /root/asenay-leadsense  # or your project path

# Backup full implementation
mv supabase/functions/autoScoreLead/index.ts supabase/functions/autoScoreLead/index.full.ts

# Use simple test version
cp supabase/functions/autoScoreLead/index.simple.ts supabase/functions/autoScoreLead/index.ts
```

### Option B: Deploy Full Implementation Directly

The full implementation is ready and should work. You can deploy it directly:

```bash
cd /root/asenay-leadsense
supabase link --project-ref vwryhloimldyaytobnol
supabase functions deploy autoScoreLead
```

---

## Step 2: Link to Project

```bash
supabase link --project-ref vwryhloimldyaytobnol
```

**Expected output:**
```
Finished supabase link.
```

---

## Step 3: Deploy autoScoreLead

```bash
supabase functions deploy autoScoreLead
```

**Expected output:**
```
Deploying function autoScoreLead...
Function autoScoreLead deployed successfully.
```

---

## Step 4: Verify Deployment

```bash
supabase functions list
```

You should see:
- `autoScoreLead` ✓

---

## Step 5: Test the Function

### Test Simple Version:

```bash
curl -X POST https://vwryhloimldyaytobnol.supabase.co/functions/v1/autoScoreLead \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Henok", "test": true}'
```

**Expected response:**
```json
{
  "status": "ok",
  "received": {"name": "Henok", "test": true},
  "message": "autoScoreLead function is working!",
  "timestamp": "2025-11-02T..."
}
```

### Test Full Implementation:

If you deployed the full version, test with a lead:

```bash
curl -X POST https://vwryhloimldyaytobnol.supabase.co/functions/v1/autoScoreLead \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "record": {
      "id": "test-123",
      "name": "John Smith",
      "email": "john@example.com",
      "company": "Acme Corp",
      "message": "Test message"
    }
  }'
```

---

## Step 6: Deploy Background Worker (Optional)

Once autoScoreLead is working:

```bash
supabase functions deploy processUnscoredLeads
```

---

## 🔄 Switch to Full Implementation

After testing the simple version, switch to full implementation:

```bash
# Restore full implementation
mv supabase/functions/autoScoreLead/index.full.ts supabase/functions/autoScoreLead/index.ts

# Redeploy
supabase functions deploy autoScoreLead
```

---

## ✅ Next Steps

1. Set Edge Function secrets in Supabase Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` (optional)

2. Verify database schema has scoring columns

3. Test with real lead data

---

**Ready to deploy!** 🚀

