# 🚀 VPS Setup Guide - Fixing Deployment Issues

## Current Issues Identified

1. ❌ **Functions not found on VPS** - Files are on local Windows machine, not on VPS
2. ❌ **Project directory doesn't exist** - `/root/asenay-leadsense` not found
3. ❌ **Permissions error** - Account may not have project access

---

## 🔧 Solution 1: Upload Code to VPS (Recommended)

### Step 1: Find Your Project Location on VPS

On your VPS, check where your code should be:

```bash
# Check if project exists elsewhere
find / -name "asenay-leadsense" -type d 2>/dev/null

# Or check common locations
ls -la /root/
ls -la /home/
ls -la /var/www/
```

### Step 2: Upload Files from Windows to VPS

**Option A: Using SCP (from Windows PowerShell)**

```powershell
# Upload the entire project
scp -r C:\Users\henok\asenay-leadsense root@your-vps-ip:/root/

# Or upload just the supabase functions
scp -r C:\Users\henok\asenay-leadsense\supabase root@your-vps-ip:/root/asenay-leadsense/
```

**Option B: Using SFTP Client**
- Use FileZilla, WinSCP, or similar
- Connect to your VPS
- Upload `supabase/functions/` directory

**Option C: Using Git (Best Practice)**

On your VPS:
```bash
# Create project directory
mkdir -p /root/asenay-leadsense
cd /root/asenay-leadsense

# Clone your repo (if you have one)
git clone https://github.com/yourusername/asenay-leadsense.git .

# Or initialize git on local, push, then clone on VPS
```

---

## 🔧 Solution 2: Create Functions Directory Manually on VPS

If you need to create the structure manually:

```bash
# SSH into VPS
ssh root@your-vps-ip

# Create project directory
mkdir -p /root/asenay-leadsense/supabase/functions/autoScoreLead
mkdir -p /root/asenay-leadsense/supabase/functions/processUnscoredLeads

# Now copy files from local machine
```

Then from Windows, upload the `index.ts` files to these directories.

---

## 🔐 Fixing Permissions Issue

### Issue: "Your account does not have the necessary privileges"

**Possible Causes:**
1. Wrong Supabase account
2. Account doesn't have project access
3. Need to use service role key instead

### Solution 1: Check Project Access

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Open your project: `vwryhloimldyaytobnol`
3. Go to **Settings** → **Team**
4. Verify your account is listed with correct permissions

### Solution 2: Use Service Role Key

Instead of linking, you can set secrets directly:

```bash
# Get your project URL and service role key from Dashboard
# Settings → API → Project URL and service_role key

# Set secrets directly
supabase secrets set SUPABASE_URL=https://vwryhloimldyaytobnol.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Solution 3: Use Access Token

Get access token from: https://supabase.com/dashboard/account/tokens

```bash
export SUPABASE_ACCESS_TOKEN=your-access-token
supabase link --project-ref vwryhloimldyaytobnol
```

---

## 📋 Step-by-Step Fix Process

### On VPS:

```bash
# 1. Create project directory
mkdir -p /root/asenay-leadsense/supabase/functions/{autoScoreLead,processUnscoredLeads}

# 2. Navigate to project
cd /root/asenay-leadsense

# 3. Verify Supabase CLI
supabase --version

# 4. Login (if not already)
supabase login

# 5. Try linking again
supabase link --project-ref vwryhloimldyaytobnol
```

### On Windows (Upload Files):

```powershell
# Upload functions directory
scp -r supabase\functions root@your-vps-ip:/root/asenay-leadsense/
```

### Back on VPS:

```bash
# Verify files are there
ls -la /root/asenay-leadsense/supabase/functions/autoScoreLead/
ls -la /root/asenay-leadsense/supabase/functions/processUnscoredLeads/

# Should see index.ts in both directories
```

---

## ✅ Quick Fix Script for VPS

Run this on your VPS:

```bash
#!/bin/bash
# Quick fix script

# 1. Create directories
mkdir -p /root/asenay-leadsense/supabase/functions/autoScoreLead
mkdir -p /root/asenay-leadsense/supabase/functions/processUnscoredLeads

# 2. Check if Supabase is initialized
cd /root/asenay-leadsense
if [ ! -f ".supabase/config.toml" ]; then
    echo "Initializing Supabase..."
    supabase init
fi

# 3. Verify structure
echo "Checking structure..."
ls -la supabase/functions/autoScoreLead/
ls -la supabase/functions/processUnscoredLeads/

echo "Done! Now upload your index.ts files from Windows."
```

---

## 🔍 Troubleshooting

### If files don't exist after upload:

```bash
# Check file permissions
ls -la /root/asenay-leadsense/supabase/functions/

# Fix permissions if needed
chmod -R 755 /root/asenay-leadsense/supabase/

# Verify file contents
cat /root/asenay-leadsense/supabase/functions/autoScoreLead/index.ts
```

### If linking still fails:

```bash
# Try with debug flag
supabase link --project-ref vwryhloimldyaytobnol --debug

# Or try using project ID instead
# Check your project URL: https://vwryhloimldyaytobnol.supabase.co
```

### If deployment fails:

```bash
# Check if functions directory structure is correct
tree supabase/functions/  # or: find supabase/functions -type f

# Verify each function has index.ts
find supabase/functions -name "index.ts"
```

---

## 📝 Next Steps After Files Are Uploaded

1. ✅ Verify files exist on VPS
2. ✅ Run `supabase link` (fix permissions if needed)
3. ✅ Deploy functions:
   ```bash
   supabase functions deploy autoScoreLead
   supabase functions deploy processUnscoredLeads
   ```
4. ✅ Verify deployment:
   ```bash
   supabase functions list
   ```

---

**After uploading files, you should be able to deploy successfully!** 🚀

