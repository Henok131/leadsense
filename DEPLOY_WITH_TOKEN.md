# 🚀 Deploy Functions with Access Token

## ✅ Your Access Token

```
sbp_76556bb8418c03971285fd6c6c9bc258ac743609
```

---

## 📋 Deployment Steps (On Your VPS)

### Step 1: SSH into Your VPS

```bash
ssh root@your-vps-ip
```

### Step 2: Navigate to Project

```bash
cd /root/leadsense
```

### Step 3: Set Access Token

```bash
export SUPABASE_ACCESS_TOKEN=sbp_76556bb8418c03971285fd6c6c9bc258ac743609
```

**Verify it's set:**
```bash
echo $SUPABASE_ACCESS_TOKEN
```

### Step 4: Deploy Functions

```bash
# Deploy autoScoreLead
supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol

# Deploy processUnscoredLeads
supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyaytobnol
```

---

## ✅ Verify Deployment

After successful deployment:

```bash
# List deployed functions
supabase functions list --project-ref vwryhloimldyaytobnol
```

You should see:
- `autoScoreLead`
- `processUnscoredLeads`

---

## 🧪 Test Functions

### Test autoScoreLead

```bash
curl -X POST https://vwryhloimldyaytobnol.supabase.co/functions/v1/autoScoreLead \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

**Expected response:**
```json
{"message": "autoScoreLead is live!"}
```

### Test processUnscoredLeads

```bash
curl -X POST https://vwryhloimldyaytobnol.supabase.co/functions/v1/processUnscoredLeads \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

**Expected response:**
```json
{"message": "processUnscoredLeads is live!"}
```

---

## 📝 Complete Command Sequence

**Copy and paste this entire block on your VPS:**

```bash
# Navigate to project
cd /root/leadsense

# Set access token
export SUPABASE_ACCESS_TOKEN=sbp_76556bb8418c03971285fd6c6c9bc258ac743609

# Verify token is set
echo "Token set: ${SUPABASE_ACCESS_TOKEN:0:20}..."

# Deploy autoScoreLead
supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol

# Deploy processUnscoredLeads
supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyaytobnol

# Verify deployment
supabase functions list --project-ref vwryhloimldyaytobnol
```

---

## ⚠️ Important Notes

1. **Token expires**: Access tokens may expire. If deployment fails later, generate a new token.

2. **Keep token secret**: Don't commit this token to Git or share it publicly.

3. **Persistent token**: To make the token persist across sessions, add it to your shell profile:
   ```bash
   echo 'export SUPABASE_ACCESS_TOKEN=sbp_76556bb8418c03971285fd6c6c9bc258ac743609' >> ~/.bashrc
   source ~/.bashrc
   ```

---

**Run these commands on your VPS to deploy!** 🚀

