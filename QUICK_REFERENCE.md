# 🚀 Quick Reference Guide for LeadSense Development

**TL;DR Version of Codebase Analysis**

---

## 📊 Current Status

✅ **Working:**
- Lead form submission → Supabase
- Dashboard with stats & table
- Search & filtering
- CSV export
- HTTPS deployment

⚠️ **Not Integrated (High Priority):**
- AI Lead Scoring (`aiScorer.js` exists but never called)
- Slack Notifications (`notify.js` exists but never called)

---

## 🗺️ Quick Navigation

| File | Purpose | Safe to Edit? |
|------|---------|---------------|
| `src/pages/Landing.jsx` | Homepage + form handler | ⚠️ Core logic - be careful |
| `src/pages/Dashboard.jsx` | Leads dashboard | ✅ Mostly safe |
| `src/components/LeadForm.jsx` | Lead form UI | ⚠️ Complex - add fields safely |
| `src/components/NavBar.jsx` | Navigation | ✅ Very safe |
| `src/lib/supabaseClient.js` | DB connection | 🔴 Don't change |
| `src/lib/aiScorer.js` | OpenAI integration | ✅ Safe, but needs integration |
| `src/lib/notify.js` | Slack webhooks | ✅ Safe, but needs integration |
| `src/lib/helpers.js` | Utilities | ✅ Very safe |

---

## ✅ Safe Areas to Add Features

### **Green Zone (Zero Risk)**

```javascript
// 1. Add new routes
// In src/App.jsx:
<Route path="/analytics" element={<Analytics />} />

// 2. Add new pages
// Create: src/pages/Analytics.jsx

// 3. Add new utility functions
// In src/lib/helpers.js or create new file:
export function formatCurrency(amount) { ... }

// 4. Add new form fields
// In src/components/LeadForm.jsx:
const [formData, setFormData] = useState({
  ...existingFields,
  newField: '', // Add here
})
```

### **Yellow Zone (Test First)**

```javascript
// 1. Modify form submission
// In src/pages/Landing.jsx handleLeadSubmit:
const leadPayload = {
  ...existingFields,
  newField: form.newField, // Add here
}

// 2. Add database column
// First: Create migration in Supabase
// Then: Add to formData and leadPayload
```

---

## 🔴 Critical: Integrate Missing Features

### **1. AI Scoring Integration**

**Where:** `src/pages/Landing.jsx` → `handleLeadSubmit`

**Add before Supabase insert:**
```javascript
// Before creating leadPayload:
const aiScore = await scoreLead(form.message)

const leadPayload = {
  ...form,
  score: aiScore.score || 0,
  category: aiScore.category || 'Cold',
  tags: [...form.tags, ...(aiScore.tags || [])],
  // ... rest of payload
}
```

### **2. Slack Notifications Integration**

**Where:** `src/pages/Landing.jsx` → `handleLeadSubmit`

**Add after successful Supabase insert:**
```javascript
if (error) {
  // ... error handling
} else {
  console.log("✅ Lead saved successfully")
  
  // Add this:
  const savedLead = { ...leadPayload, id: data[0]?.id }
  if (savedLead.category === 'Hot') {
    await notifyLead(savedLead)
  }
  
  setSubmitStatus('success')
  // ... rest
}
```

---

## 📝 Naming Patterns to Follow

```
Components:  PascalCase  →  LeadCard.jsx
Pages:       PascalCase  →  Analytics.jsx
Services:    camelCase   →  emailService.js
Hooks:       camelCase   →  useLeads.js (with 'use' prefix)
Functions:   camelCase   →  fetchLeads()
State:       camelCase   →  isSubmitting
Constants:   UPPER_CASE  →  API_BASE_URL
```

---

## 🚦 Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
npm run dev
npm run build

# 4. Commit
git add .
git commit -m "feat: add your feature"

# 5. Push & PR
git push origin feature/your-feature
# Create PR on GitHub
```

---

## ⚠️ Common Pitfalls

1. **Environment Variables**
   - Must have `VITE_` prefix
   - Must rebuild after changing `.env`

2. **Supabase Changes**
   - Always create migration scripts
   - Test in dev Supabase project first

3. **Form Submissions**
   - Don't change `leadPayload` structure without updating Supabase
   - Always validate required fields

4. **Build & Deploy**
   - Always run `npm run build` before deploying
   - Clear `dist/` folder between deployments

---

## 🎯 Recommended Next Features (Easy)

1. **Analytics Page** - New route, use existing data
2. **Lead Detail Page** - View single lead (`/leads/:id`)
3. **Enhanced Filters** - Date range, status, multi-select
4. **Export to Excel** - Use xlsx library
5. **Notes System** - Add notes table, note-taking UI

---

## 📚 Full Documentation

See `CODEBASE_ANALYSIS.md` for complete details.

---

**Quick Tip:** When in doubt, create a new file rather than modifying existing working code. You can always refactor later!

