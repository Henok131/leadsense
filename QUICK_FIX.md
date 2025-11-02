# ⚡ Quick Fix - Upload Functions to VPS

## Problem
- Functions files (`index.ts`) are on your Windows machine
- VPS can't find them at `/root/asenay-leadsense/supabase/functions/`

## Solution: Upload Files from Windows

### Step 1: On Your VPS (SSH)

Run this to create directories:

```bash
mkdir -p /root/asenay-leadsense/supabase/functions/autoScoreLead
mkdir -p /root/asenay-leadsense/supabase/functions/processUnscoredLeads
```

### Step 2: On Windows (PowerShell)

Upload the files using SCP:

```powershell
# Replace 'YOUR_VPS_IP' with your actual VPS IP
$VPS_IP = "YOUR_VPS_IP"

# Upload autoScoreLead
scp supabase\functions\autoScoreLead\index.ts root@$VPS_IP:/root/asenay-leadsense/supabase/functions/autoScoreLead/

# Upload processUnscoredLeads
scp supabase\functions\processUnscoredLeads\index.ts root@$VPS_IP:/root/asenay-leadsense/supabase/functions/processUnscoredLeads/
```

**If SCP doesn't work on Windows, use WinSCP or FileZilla (GUI tools).**

### Step 3: Verify on VPS

```bash
# Check files exist
ls -la /root/asenay-leadsense/supabase/functions/autoScoreLead/
ls -la /root/asenay-leadsense/supabase/functions/processUnscoredLeads/

# Should see index.ts in both directories
```

### Step 4: Deploy from VPS

```bash
cd /root/asenay-leadsense
supabase link --project-ref vwryhloimldyaytobnol
supabase functions deploy autoScoreLead
supabase functions deploy processUnscoredLeads
```

---

## Alternative: Use Git (Recommended)

**On Windows:**

```powershell
git init
git add .
git commit -m "Add Supabase functions"
git remote add origin https://github.com/yourusername/asenay-leadsense.git
git push -u origin main
```

**On VPS:**

```bash
cd /root
git clone https://github.com/yourusername/asenay-leadsense.git
cd asenay-leadsense
supabase link --project-ref vwryhloimldyaytobnol
supabase functions deploy autoScoreLead
supabase functions deploy processUnscoredLeads
```

---

## Fix Permissions Issue

If you get "Your account does not have the necessary privileges":

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Open project: `vwryhloimldyaytobnol`
3. Go to **Settings** → **Team**
4. Verify your account has access

Or get an access token:
- Go to: https://supabase.com/dashboard/account/tokens
- Create a new token
- On VPS: `export SUPABASE_ACCESS_TOKEN=your-token`

---

**After uploading files, deployment should work!** 🚀

