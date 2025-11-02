# ⚡ VPS Deployment Quick Fix - 403 Error

## ✅ Status

- ✅ Repository cloned on VPS: `/root/leadsense`
- ✅ Functions exist: `autoScoreLead/index.ts` and `processUnscoredLeads/index.ts`
- ✅ Supabase initialized
- ❌ **403 Error**: Permissions issue when deploying

---

## 🔐 Quick Fix (Use Access Token)

### Step 1: Get Access Token

1. Go to: **https://supabase.com/dashboard/account/tokens**
2. Click **"Generate new token"**
3. Copy the token (keep it secret!)

### Step 2: On Your VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Navigate to project
cd /root/leadsense

# Set the access token
export SUPABASE_ACCESS_TOKEN=your-token-here

# Verify it's set
echo $SUPABASE_ACCESS_TOKEN

# Deploy functions
supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol
supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyaytobnol
```

---

## 🎯 What Each Function Does

### autoScoreLead
- **Path**: `supabase/functions/autoScoreLead/index.ts`
- **Response**: `{ "message": "autoScoreLead is live!" }`
- **Purpose**: Test function to verify deployment works

### processUnscoredLeads
- **Path**: `supabase/functions/processUnscoredLeads/index.ts`
- **Response**: `{ "message": "processUnscoredLeads is live!" }`
- **Purpose**: Test function to verify deployment works

---

## ✅ Verify Deployment

After successful deployment:

```bash
# List deployed functions
supabase functions list --project-ref vwryhloimldyaytobnol

# Test autoScoreLead
curl -X POST https://vwryhloimldyaytobnol.supabase.co/functions/v1/autoScoreLead \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

**Expected response:**
```json
{"message": "autoScoreLead is live!"}
```

---

## ⚠️ Note: You Don't Need Supabase CLI Locally

**On Windows**, you don't need to install Supabase CLI. The error you saw:
```
Installing Supabase CLI as a global module is not supported.
```

This is normal - Supabase CLI is meant to be installed on your VPS, not locally.

---

## 🔄 After Successful Deployment

Once both functions are deployed successfully, you can:

1. **Test them** via curl commands
2. **Replace with full implementation** - Later, we can update these simple test functions with the full AI scoring logic
3. **Set up database trigger** - Configure the trigger to call `autoScoreLead` automatically

---

## 📝 Troubleshooting

### If access token doesn't work:

1. **Check token is valid** - Make sure you copied the full token
2. **Try logout/login**:
   ```bash
   supabase logout
   supabase login
   export SUPABASE_ACCESS_TOKEN=your-token
   ```
3. **Check project access** - Go to Supabase Dashboard → Settings → Team → Members

### If deployment still fails:

```bash
# Use debug mode to see more details
supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol --debug
```

---

**Once you set the access token on VPS, deployment should work!** 🚀

