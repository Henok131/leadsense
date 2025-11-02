# 🔐 Fix Supabase Permissions Error (403)

## Error Message

```
unexpected list functions status 403: {"message": "Your account does not have the necessary privileges to access this endpoint."}
```

## ✅ Solutions

### Solution 1: Check Project Access in Dashboard

1. Go to: https://supabase.com/dashboard
2. Make sure you're logged in with the correct account
3. Open project: `vwryhloimldyaytobnol`
4. Go to **Settings** → **Team** → **Members**
5. Verify your account is listed with **Owner** or **Admin** role
6. If not listed, ask the project owner to add you

---

### Solution 2: Use Access Token (Recommended)

1. **Get Access Token:**
   - Go to: https://supabase.com/dashboard/account/tokens
   - Click **Generate new token**
   - Copy the token

2. **On VPS, set the token:**
   ```bash
   export SUPABASE_ACCESS_TOKEN=your-access-token-here
   ```

3. **Try deploying again:**
   ```bash
   supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol
   supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyaytobnol
   ```

---

### Solution 3: Use Service Role Key (Alternative)

If access tokens don't work, you can deploy using service role key:

1. **Get Service Role Key:**
   - Go to: https://supabase.com/dashboard/project/vwryhloimldyaytobnol/settings/api
   - Copy the **service_role** key (⚠️ Keep this secret!)

2. **On VPS, set secrets:**
   ```bash
   supabase secrets set SUPABASE_URL=https://vwryhloimldyaytobnol.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Try deploying:**
   ```bash
   supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol
   ```

---

### Solution 4: Logout and Login Again

Sometimes a fresh login helps:

```bash
# Logout
supabase logout

# Login again
supabase login

# Verify login
supabase projects list

# Try deploying
supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol
```

---

### Solution 5: Use Supabase Dashboard (Web UI)

If CLI deployment keeps failing, deploy via Dashboard:

1. Go to: https://supabase.com/dashboard/project/vwryhloimldyaytobnol
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Or upload the function files manually

---

## 🔍 Verify Current Status

Check what projects you have access to:

```bash
supabase projects list
```

This should show your projects. If `vwryhloimldyaytobnol` is not listed, you don't have access.

---

## 📝 Quick Fix Script

Run this on your VPS:

```bash
#!/bin/bash
echo "Fixing Supabase permissions..."

# Check if logged in
if supabase projects list &> /dev/null; then
    echo "✅ Logged in"
    echo "Projects you have access to:"
    supabase projects list
else
    echo "❌ Not logged in or connection issue"
    echo "Run: supabase login"
fi

# Check for access token
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "⚠️  No access token set"
    echo "Get one from: https://supabase.com/dashboard/account/tokens"
    echo "Then run: export SUPABASE_ACCESS_TOKEN=your-token"
else
    echo "✅ Access token is set"
fi
```

---

## 🎯 Most Likely Fix

**The quickest solution is usually:**

```bash
# On your VPS
export SUPABASE_ACCESS_TOKEN=your-token-from-dashboard

# Then deploy
supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol
supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyaytobnol
```

**Get the token from:** https://supabase.com/dashboard/account/tokens

---

**After fixing permissions, deployment should work!** 🚀

