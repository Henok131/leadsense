# 🚀 GitHub Push Instructions

## ✅ Status

Both Supabase Edge Functions have been created and committed:

1. ✅ `supabase/functions/autoScoreLead/index.ts` - Created & committed
2. ✅ `supabase/functions/processUnscoredLeads/index.ts` - Created & committed

**Commit:** `Add Supabase Edge Functions: autoScoreLead and processUnscoredLeads`

---

## 📤 Push to GitHub

### Step 1: Add GitHub Remote

**If you already have a GitHub repository:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/asenay-leadsense.git
```

**Or if using SSH:**

```bash
git remote add origin git@github.com:YOUR_USERNAME/asenay-leadsense.git
```

**If you need to create a new repository:**
1. Go to: https://github.com/new
2. Create repository named: `asenay-leadsense`
3. **Don't** initialize with README (we already have files)
4. Copy the repository URL
5. Add it as remote (command above)

### Step 2: Push to GitHub

```bash
# Push to main branch (or master if that's your default)
git branch -M main
git push -u origin main
```

**Or if your default branch is `master`:**

```bash
git push -u origin master
```

---

## ✅ Verify Push

After pushing, verify on GitHub:
- Go to: `https://github.com/YOUR_USERNAME/asenay-leadsense`
- Check these files exist:
  - `supabase/functions/autoScoreLead/index.ts`
  - `supabase/functions/processUnscoredLeads/index.ts`

---

## 🔄 After Push - VPS Deployment

Once pushed to GitHub, on your VPS:

```bash
# Clone or pull latest from GitHub
cd /root
git clone https://github.com/YOUR_USERNAME/asenay-leadsense.git
# Or if already cloned:
# cd /root/asenay-leadsense
# git pull

# Navigate to project
cd /root/asenay-leadsense

# Deploy functions
supabase functions deploy autoScoreLead --project-ref vwryhloimldyaytobnol
supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyaytobnol
```

---

## 📝 Function Files Created

### autoScoreLead/index.ts
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  return new Response(JSON.stringify({ message: "autoScoreLead is live!" }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### processUnscoredLeads/index.ts
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  return new Response(JSON.stringify({ message: "processUnscoredLeads is live!" }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

**Ready to push to GitHub!** 🎉

