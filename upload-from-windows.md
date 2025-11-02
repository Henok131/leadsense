# 📤 Upload Files from Windows to VPS

## Quick Upload Commands

### Option 1: Upload via SCP (Windows PowerShell)

```powershell
# Replace 'your-vps-ip' with your actual VPS IP address
$VPS_IP = "your-vps-ip"

# Upload entire supabase functions directory
scp -r supabase\functions root@$VPS_IP:/root/asenay-leadsense/

# Or upload individual files
scp supabase\functions\autoScoreLead\index.ts root@$VPS_IP:/root/asenay-leadsense/supabase/functions/autoScoreLead/
scp supabase\functions\processUnscoredLeads\index.ts root@$VPS_IP:/root/asenay-leadsense/supabase/functions/processUnscoredLeads/
```

**Note**: If you get "scp not found", you can:
- Use WinSCP (GUI tool)
- Use Git to sync
- Or manually copy/paste file contents via SSH

---

### Option 2: Use Git (Recommended)

**On Windows:**

```powershell
# Initialize git if not already done
git init
git add .
git commit -m "Add Supabase functions"

# Push to GitHub/GitLab/Bitbucket
git remote add origin https://github.com/yourusername/asenay-leadsense.git
git push -u origin main
```

**On VPS:**

```bash
cd /root
git clone https://github.com/yourusername/asenay-leadsense.git
cd asenay-leadsense
```

---

### Option 3: Use WinSCP or FileZilla

1. Download WinSCP: https://winscp.net/
2. Connect to your VPS:
   - Host: `your-vps-ip`
   - Username: `root`
   - Password: your VPS password
3. Navigate to `/root/asenay-leadsense/supabase/functions/`
4. Upload the `autoScoreLead` and `processUnscoredLeads` folders

---

### Option 4: Manual Copy-Paste (Quick Test)

**On Windows:**
1. Open `supabase/functions/autoScoreLead/index.ts`
2. Copy entire file contents (Ctrl+A, Ctrl+C)

**On VPS (via SSH):**
```bash
cd /root/asenay-leadsense/supabase/functions/autoScoreLead
nano index.ts
# Paste content, Ctrl+X to save, Y to confirm
```

---

## Verify Upload on VPS

After uploading, SSH into VPS and verify:

```bash
# Check if files exist
ls -la /root/asenay-leadsense/supabase/functions/autoScoreLead/
ls -la /root/asenay-leadsense/supabase/functions/processUnscoredLeads/

# Should see index.ts in both
# Verify file contents
cat /root/asenay-leadsense/supabase/functions/autoScoreLead/index.ts | head -20
```

---

## Troubleshooting SCP

### If "scp: command not found" on Windows:

**Use OpenSSH (Windows 10+):**
```powershell
# Enable OpenSSH if not already
# Windows Settings → Apps → Optional Features → Add OpenSSH Client

# Then use:
scp -r supabase\functions root@your-vps-ip:/root/asenay-leadsense/
```

**Or use PuTTY/pscp:**
```powershell
# Download pscp.exe from PuTTY website
pscp.exe -r supabase\functions root@your-vps-ip:/root/asenay-leadsense/
```

---

**Once files are uploaded, proceed with deployment on VPS!** 🚀

