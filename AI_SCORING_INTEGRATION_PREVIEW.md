# 🔍 AI Scoring Integration - Preview of Changes

## Changes to `src/pages/Landing.jsx`

### **1. Add Import Statement** (Line 5)

**ADD this line:**
```javascript
import { scoreLead } from '../lib/aiScorer'
```

**After the existing imports:**
```javascript
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles, TrendingUp, Shield, Zap, CheckCircle, XCircle } from 'lucide-react'
import LeadForm from '../components/LeadForm'
import { supabase } from '../lib/supabaseClient'
import { scoreLead } from '../lib/aiScorer'  // ← ADD THIS LINE
```

---

### **2. Call AI Scoring Before Creating leadPayload** (Around Line 45)

**INSERT AI scoring call here:**

```javascript
    // Set loading state to true before submission
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')

    try {
      // 🆕 NEW: Call AI scoring with the lead message
      console.log("🤖 Calling AI to score lead...")
      const aiScore = await scoreLead(form.message || '')
      
      // Merge AI tags with form tags (avoid duplicates)
      const mergedTags = [
        ...(Array.isArray(form.tags) ? form.tags : []),
        ...(Array.isArray(aiScore.tags) ? aiScore.tags : [])
      ]
      // Remove duplicates
      const uniqueTags = [...new Set(mergedTags)]
      
      console.log("✅ AI Score received:", {
        score: aiScore.score,
        category: aiScore.category,
        tags: aiScore.tags
      })

      const leadPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company || null,
        phone: form.message || null,
        website: form.website || null,
        message: form.message || null,
        tags: uniqueTags,  // 🆕 Use merged tags
        interest_category: form.interest_category || null,

        // 🆕 Use AI scoring results (with fallbacks)
        score: aiScore.score || 0,
        category: ['Hot', 'Warm', 'Cold'].includes(aiScore.category) 
          ? aiScore.category 
          : 'Cold',
        status: ['New', 'In Review', 'Contacted', 'Converted', 'Disqualified'].includes(form.status) 
          ? form.status 
          : 'New',

        feedback_rating: form.feedback_rating ? parseInt(form.feedback_rating) : null,
        deal_value: form.deal_value ? parseFloat(form.deal_value) : null,
        contact_preference: ['Email', 'Call', 'WhatsApp'].includes(form.contact_preference) 
          ? form.contact_preference 
          : null,

        source: 'form',
        utm_campaign: utm.utm_campaign || null,
        utm_source: utm.utm_source || null,
        user_agent: navigator.userAgent || null,
        ip_address: null,
        location: null,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
```

---

## 📊 Complete Code Flow

**Current Flow:**
```
Form Submit → Validate → Create leadPayload → Insert to Supabase
```

**New Flow (with AI Scoring):**
```
Form Submit → Validate → Call AI Scoring → Merge results → Create leadPayload → Insert to Supabase
```

---

## ✅ What Will Change

1. **Import Added:** `import { scoreLead } from '../lib/aiScorer'`
2. **AI Call Added:** `const aiScore = await scoreLead(form.message || '')`
3. **Tags Merged:** Combines form tags + AI tags (removes duplicates)
4. **Score Updated:** Uses `aiScore.score || 0` instead of `form.score || 0`
5. **Category Updated:** Uses `aiScore.category` (validated) instead of `form.category || 'Cold'`

---

## 🚫 What Stays the Same

✅ **All existing logic preserved:**
- Validation logic (lines 25-38) - **unchanged**
- Loading state management (`setIsSubmitting`) - **unchanged**
- Error handling (`try/catch`) - **unchanged**
- Success/error messages - **unchanged**
- Redirect to dashboard - **unchanged**
- All other form fields - **unchanged**
- UI components - **unchanged**

---

## 🎯 Expected Behavior

### **Success Path:**
1. User submits form → Loading spinner shows
2. AI scores the lead message → Returns `{ score: 75, category: 'Hot', tags: ['urgent', 'enterprise'] }`
3. AI results merged with form data
4. Lead saved to Supabase with AI score and category
5. Success message shows → Redirects to dashboard

### **Error Handling:**
- If AI scoring fails → Falls back to `{ score: 0, category: 'Cold', tags: [] }`
- If message is empty → AI gets empty string (still works with fallback)
- If OpenAI API key missing → Warning logged, uses fallback
- Existing error handling still works

---

## 📝 Notes

1. **AI Scoring is Async:** The `await` will wait for the API call to complete
2. **Fallback Values:** If AI fails, defaults to `score: 0`, `category: 'Cold'`
3. **Tag Merging:** Combines user-entered tags + AI-generated tags, removes duplicates
4. **Validation:** Ensures category is one of `['Hot', 'Warm', 'Cold']`
5. **Console Logs:** Added for debugging (can remove later)

---

## ⚠️ Requirements

- **Environment Variable:** `VITE_OPENAI_API_KEY` must be set in `.env`
- **Message Field:** AI scoring uses `form.message` - ensure it's not empty for best results
- **Network:** Requires internet connection for OpenAI API call

---

## 🧪 Testing Checklist

- [ ] Test with valid message → AI should return score and category
- [ ] Test with empty message → Should use fallback values
- [ ] Test without API key → Should use fallback, show warning
- [ ] Test with network error → Should use fallback, continue to submit
- [ ] Verify score saved in Supabase dashboard
- [ ] Verify category saved correctly ('Hot', 'Warm', or 'Cold')
- [ ] Verify tags merged (both form tags + AI tags)
- [ ] Verify existing UI (loading spinner, success message) still works

---

**Ready to apply?** Let me know and I'll make the changes!

