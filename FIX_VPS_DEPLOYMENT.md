# 🔧 Fix VPS Deployment Issues

## Issues Found

1. ❌ Functions not found at `/root/supabase/functions/`
2. ❌ Project directory `/root/asenay-leadsense` doesn't exist
3. ❌ Permissions error when linking to Supabase project

---

## 🚀 Solution Step-by-Step

### Step 1: Create Project Directory on VPS

**On your VPS, run:**

```bash
# Create project directory
mkdir -p /root/asenay-leadsense/supabase/functions/autoScoreLead
mkdir -p /root/asenay-leadsense/supabase/functions/processUnscoredLeads

# Navigate to project
cd /root/asenay-leadsense

# Initialize Supabase (if not already)
supabase init
```

---

### Step 2: Upload Function Files from Windows

**On Windows (PowerShell), run:**

```powershell
# Replace with your actual VPS IP
$VPS_IP = "your-vps-ip"

# Upload autoScoreLead function
scp supabase\functions\autoScoreLead\index.ts root@$VPS_IP:/root/asenay-leadsense/supabase/functions/autoScoreLead/

# Upload processUnscoredLeads function
scp supabase\functions\processUnscoredLeads\index.ts root@$VPS_IP:/root/asenay-leadsense/supabase/functions/processUnscoredLeads/
```

**If SCP doesn't work, use one of these alternatives:**

**Option A: WinSCP (GUI)**
1. Download WinSCP: https://winscp.net/
2. Connect to your VPS
3. Upload the `supabase/functions/` folder to `/root/asenay-leadsense/`

**Option B: Manual Copy-Paste via SSH**

On VPS:
```bash
cd /root/asenay-leadsense/supabase/functions/autoScoreLead
nano index.ts
# Paste content from Windows file, Ctrl+X, Y, Enter to save
```

---

### Step 3: Verify Files on VPS

**On your VPS, verify:**

```bash
cd /root/asenay-leadsense

# Check files exist
ls -la supabase/functions/autoScoreLead/index.ts
ls -la supabase/functions/processUnscoredLeads/index.ts

# Should see the files listed
```

---

### Step 4: Fix Supabase Permissions Issue

**Option A: Check Project Access in Dashboard**

1. Go to: https://supabase.com/dashboard
2. Open project: `vwryhloimldyaytobnol`
3. Go to **Settings** → **Team** → **Members**
4. Verify your account is listed with correct permissions

**Option B: Use Access Token**

1. Go to: https://supabase.com/dashboard/account/tokens
2. Create a new access token
3. On VPS:
   ```bash
   export SUPABASE_ACCESS_TOKEN=your-access-token-here
   supabase link --project-ref vwryhloimldyaytobnol
   ```

**Option C: Use Service Role Key (Alternative)**

If linking fails, you can deploy without linking by setting secrets directly:

```bash
# Get these from Supabase Dashboard → Settings → API
supabase secrets set SUPABASE_URL=https://vwryhloimldyaytobnol.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set OPENAI_API_KEY=sk-your-openai-key  # Optional
```

**Then deploy directly:**
```bash
# Deploy without linking (if you have secrets set)
supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol
supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyaytobnol
```

---

### Step 5: Deploy Functions

**On your VPS:**

```bash
cd /root/asenay-leadsense

# Try linking again (after fixing permissions)
supabase link --project-ref vwryhloimldyaytobnol

# If link succeeds, deploy:
supabase functions deploy autoScoreLead
supabase functions deploy processUnscoredLeads

# Verify deployment
supabase functions list
```

---

## 🔍 Troubleshooting

### If files still not found:

```bash
# Check current directory
pwd

# Check files exist
find /root/asenay-leadsense -name "index.ts"

# Check Supabase config
cat .supabase/config.toml

# If config shows wrong path, fix it:
supabase init
```

### If permissions still fail:

1. **Check if you're using the correct account**:
   ```bash
   supabase logout
   supabase login
   ```

2. **Verify project ref is correct**:
   - In Supabase Dashboard, go to Settings → General
   - Check the Reference ID matches: `vwryhloimldyaytobnol`

3. **Try using project URL instead**:
   ```bash
   supabase link --project-url https://vwryhloimldyaytobnol.supabase.co
   ```

---

## ✅ Quick Verification Script

**On your VPS, run this to check everything:**

```bash
#!/bin/bash
echo "Checking VPS setup..."

# Check directory exists
if [ -d "/root/asenay-leadsense" ]; then
    echo "✅ Project directory exists"
else
    echo "❌ Project directory missing - create it first"
fi

# Check function files exist
if [ -f "/root/asenay-leadsense/supabase/functions/autoScoreLead/index.ts" ]; then
    echo "✅ autoScoreLead/index.ts exists"
else
    echo "❌ autoScoreLead/index.ts missing - upload it"
fi

if [ -f "/root/asenay-leadsense/supabase/functions/processUnscoredLeads/index.ts" ]; then
    echo "✅ processUnscoredLeads/index.ts exists"
else
    echo "❌ processUnscoredLeads/index.ts missing - upload it"
fi

# Check Supabase CLI
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI installed: $(supabase --version)"
else
    echo "❌ Supabase CLI not found"
fi

# Check Docker
if docker ps &> /dev/null; then
    echo "✅ Docker is running"
else
    echo "❌ Docker not running"
fi

echo "Done!"
```

---

**After completing these steps, deployment should work!** 🚀

