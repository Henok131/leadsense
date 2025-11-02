# 🚀 VPS Deployment Guide - Supabase Functions

## ✅ Current Setup

- **Supabase CLI**: Available on VPS
- **Docker**: Running on VPS ✓
- **Deployment**: From VPS (not local Windows machine)

---

## 📋 Deployment Steps (From VPS)

### Step 1: SSH into Your VPS

```bash
ssh user@your-vps-ip
```

Or if you're already connected, proceed to Step 2.

---

### Step 2: Login to Supabase

```bash
supabase login
```

**What happens:**
- Opens browser automatically (if GUI available)
- Or provides a URL and verification code
- Enter code in browser to complete login

**Expected output:**
```
Token created successfully.
You are now logged in. Happy coding!
```

---

### Step 3: Link to Project

```bash
supabase link --project-ref vwryhloimldyaytobnol
```

**Expected output:**
```
Finished supabase link.
```

---

### Step 4: Verify Supabase Status

```bash
supabase status
```

This should show:
- API URL
- GraphQL URL  
- DB URL
- Studio URL
- Anon key
- Service role key

---

### Step 5: Deploy autoScoreLead Function

```bash
supabase functions deploy autoScoreLead
```

**Expected output:**
```
Deploying function autoScoreLead...
Function autoScoreLead deployed successfully.
```

---

### Step 6: Deploy processUnscoredLeads Function

```bash
supabase functions deploy processUnscoredLeads
```

**Expected output:**
```
Deploying function processUnscoredLeads...
Function processUnscoredLeads deployed successfully.
```

---

## ✅ Verify Deployment

After deployment, verify functions are deployed:

```bash
supabase functions list
```

You should see:
- `autoScoreLead`
- `processUnscoredLeads`

---

## 🔧 Troubleshooting (VPS)

### If `supabase` command not found:

Check if Supabase CLI is installed:

```bash
supabase --version
```

If not installed, install it:

```bash
# For Linux (most common on VPS)
curl -fsSL https://supabase.com/install.sh | sh

# Or using package manager
# Ubuntu/Debian:
wget -qO- https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
sudo mv supabase /usr/local/bin/

# Verify installation
supabase --version
```

---

### If Docker not running on VPS:

```bash
# Check Docker status
docker ps

# Start Docker service (if not running)
sudo systemctl start docker

# Enable Docker on boot
sudo systemctl enable docker

# Verify Docker is running
docker ps
```

---

### If login fails:

1. **Check network connectivity**:
   ```bash
   ping supabase.com
   ```

2. **Try manual token setup**:
   - Get token from: https://supabase.com/dashboard/account/tokens
   - Set environment variable:
     ```bash
     export SUPABASE_ACCESS_TOKEN=your-token-here
     ```

3. **Or use browser login**:
   ```bash
   supabase login
   # Follow browser instructions
   ```

---

### If link fails:

1. **Verify project ref is correct**:
   - Check in Supabase Dashboard → Project Settings → General
   - Project ref should match: `vwryhloimldyaytobnol`

2. **Check you have access to the project**:
   - Ensure your account has permission to access the project
   - Verify you're logged into the correct Supabase account

---

### If function deploy fails:

1. **Check Docker is running**:
   ```bash
   docker ps
   ```

2. **Check Supabase link**:
   ```bash
   supabase status
   ```

3. **View detailed logs**:
   ```bash
   supabase functions deploy autoScoreLead --debug
   ```

4. **Verify function directory exists**:
   ```bash
   ls -la supabase/functions/autoScoreLead/
   ```

   Should show `index.ts` file.

---

## 🔐 Setting Secrets (After Deployment)

After successful deployment, set Edge Function secrets in **Supabase Dashboard**:

1. Go to **Project Settings** → **Edge Functions**
2. Click **Manage secrets**
3. Add these secrets:

| Secret Name | Description |
|-------------|-------------|
| `SUPABASE_URL` | Your project URL (from Project Settings → API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (from Project Settings → API) |
| `OPENAI_API_KEY` | OpenAI API key (optional - for AI scoring) |

**Or via CLI:**
```bash
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set OPENAI_API_KEY=sk-your-openai-key
```

---

## 📊 Post-Deployment Testing

### Test autoScoreLead Function

```bash
curl -X POST 'https://vwryhloimldyaytobnol.supabase.co/functions/v1/autoScoreLead' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "record": {
      "id": "test-id",
      "name": "John Smith",
      "email": "john@example.com",
      "company": "Acme Corp",
      "message": "Test message"
    }
  }'
```

### Test processUnscoredLeads Function

```bash
curl -X POST 'https://vwryhloimldyaytobnol.supabase.co/functions/v1/processUnscoredLeads' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

---

## 📝 Quick Command Reference

```bash
# Login
supabase login

# Link to project
supabase link --project-ref vwryhloimldyaytobnol

# Check status
supabase status

# Deploy functions
supabase functions deploy autoScoreLead
supabase functions deploy processUnscoredLeads

# List deployed functions
supabase functions list

# View function logs
supabase functions logs autoScoreLead
supabase functions logs processUnscoredLeads
```

---

## 🎯 Next Steps

1. ✅ Deploy both functions (commands above)
2. ✅ Set Edge Function secrets in Dashboard
3. ✅ Verify database schema has scoring columns
4. ✅ Test by inserting a lead into database
5. ✅ Monitor function logs for any issues

---

**Ready to deploy? Run the commands from your VPS!** 🚀

