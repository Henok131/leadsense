# ✅ Correct Deployment Commands

## 🔍 Issue Found

**Incorrect project ref:** `wryyholim1dayotbno1` ❌  
**Correct project ref:** `vwryhloimldyajtobnol` ✅

---

## ✅ Correct Commands (Copy & Paste on VPS)

```bash
# Navigate to project
cd /root/leadsense

# Set access token
export SUPABASE_ACCESS_TOKEN=sbp_76556bb8418c03971285fd6c6c9bc258ac743609

# Deploy autoScoreLead (CORRECT project ref)
supabase functions deploy autoScoreLead --project-ref vwryhloimldyajtobnol

# Deploy processUnscoredLeads (CORRECT project ref)
supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyajtobnol

# Verify deployment
supabase functions list --project-ref vwryhloimldyajtobnol
```

---

## 📋 What Changed

| Wrong ❌ | Correct ✅ |
|---------|-----------|
| `wryyholim1dayotbno1` | `vwryhloimldyajtobnol` |
| `vwryhloimldyajotbnol` | `vwryhloimldyajtobnol` |

**Note:** The correct project ref is `vwryhloimldyajtobnol` (20 characters, all lowercase)

---

## 🚀 Quick Copy-Paste

```bash
export SUPABASE_ACCESS_TOKEN=sbp_76556bb8418c03971285fd6c6c9bc258ac743609 && cd /root/leadsense && supabase functions deploy autoScoreLead --project-ref vwryhloimldyajtobnol && supabase functions deploy processUnscoredLeads --project-ref vwryhloimldyajtobnol && supabase functions list --project-ref vwryhloimldyajtobnol
```

---

**Use the correct project ref: `vwryhloimldyajtobnol`** ✅

