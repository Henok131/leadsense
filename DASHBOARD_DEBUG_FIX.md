# 🔍 Dashboard Showing 0 Leads - Debug & Fix Guide

## 🔍 Problem Analysis

### **1. Why is `/dashboard` showing 0 leads despite 7 rows in Supabase?**

The query in `Dashboard.jsx` looks correct:
```javascript
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false })
```

**However, there are NO filters in the code itself.** This suggests the issue is likely:

### **2. Most Likely Cause: Row Level Security (RLS) Policy**

If Supabase has **Row Level Security (RLS)** enabled on the `leads` table, and there's no policy allowing anonymous reads, the query will return **0 rows** even if the table has 7 rows.

**The Dashboard uses:**
- `supabaseClient.js` - Uses `VITE_SUPABASE_ANON_KEY` (anonymous key)
- **No authentication** - No user session, no auth checks
- **Direct Supabase query** - No backend proxy

If RLS is enabled without a policy for anonymous reads, the anonymous user can't see any rows.

### **3. Check Supabase Query Logic**

**Current Query (Dashboard.jsx:29-43):**
```javascript
const fetchLeads = async () => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    setLeads(data || [])
  } catch (error) {
    console.error('Error fetching leads:', error)
  } finally {
    setLoading(false)
  }
}
```

**Issues Found:**
1. ✅ No filters applied (score, date, category filters are client-side only)
2. ✅ No auth checks (no user ID filtering)
3. ❌ **Error is caught but not displayed** - Error might be silently failing
4. ❌ **No RLS policy check** - Code doesn't account for RLS restrictions

### **4. Does Code Rely on User ID or Auth Session?**

**Answer: NO** - The code does NOT rely on:
- User authentication
- User ID
- Auth session
- Any user-specific filtering

**The Supabase client is created with:**
```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

This uses the **anonymous key**, which means:
- No user authentication
- No user ID
- Subject to RLS policies for anonymous access

### **5. Where is Total Leads Metric Computed?**

**Location:** `Dashboard.jsx` lines 57-119

```javascript
const stats = useMemo(() => {
  const total = leads.length  // ← Total leads is calculated here
  // ... rest of stats
}, [leads])
```

**The `total` metric is:**
- Calculated from the `leads` state array length
- If `leads` is empty (due to RLS or query error), `total = 0`
- This is client-side only, no database aggregation

---

## 🛠️ Fix: Enable RLS Policy for Anonymous Reads

### **Step 1: Check RLS Status in Supabase**

1. Go to your Supabase Dashboard
2. Navigate to **Table Editor** → `leads` table
3. Click on **"Policies"** tab (or **"RLS"** settings)
4. Check if **"Row Level Security"** is enabled

### **Step 2: Create RLS Policy for SELECT (Anonymous Access)**

If RLS is enabled, create a policy to allow anonymous reads:

**Option A: Allow All Anonymous Reads (Quick Fix)**

```sql
-- Allow anonymous users to SELECT all leads
CREATE POLICY "Allow anonymous read access"
ON leads
FOR SELECT
TO anon
USING (true);
```

**Option B: Allow All Reads (Public + Authenticated)**

```sql
-- Allow public (anonymous) and authenticated users to SELECT all leads
CREATE POLICY "Allow public read access"
ON leads
FOR SELECT
TO public
USING (true);
```

**Option C: Disable RLS (Only for testing)**

```sql
-- Disable RLS on leads table (NOT recommended for production)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
```

### **Step 3: Update Dashboard to Show Errors**

Improve error handling so we can see what's happening:

```javascript
const fetchLeads = async () => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Supabase query error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      // Show error to user (optional)
      setLeads([])
      return
    }

    console.log('✅ Fetched leads:', data?.length || 0, 'rows')
    setLeads(data || [])
  } catch (error) {
    console.error('❌ Unexpected error fetching leads:', error)
    setLeads([])
  } finally {
    setLoading(false)
  }
}
```

---

## 🔧 Alternative Fix: Use Service Role Key (NOT RECOMMENDED)

**⚠️ WARNING:** Only for testing. Service role key bypasses RLS but exposes your database.

**If you need to bypass RLS temporarily for testing:**

1. Get your **Service Role Key** from Supabase Dashboard → Settings → API
2. Create a separate client for admin operations:

```javascript
// src/lib/supabaseAdminClient.js (DO NOT COMMIT THIS FILE)
import { createClient } from '@supabase/supabase-js'

const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.warn('⚠️ Missing Supabase service role key')
}

export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  supabaseServiceKey
)
```

**Then update Dashboard:**

```javascript
import { supabaseAdmin } from '../lib/supabaseAdminClient'

const fetchLeads = async () => {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  // ...
}
```

**⚠️ Security Risk:** Service role key has full database access. Do NOT use in production frontend. Only use for backend/admin operations.

---

## ✅ Recommended Solution: Fix RLS Policy

**The best solution is to create a proper RLS policy:**

1. **For Development/Testing:**
   ```sql
   CREATE POLICY "Allow anonymous read access"
   ON leads
   FOR SELECT
   TO anon
   USING (true);
   ```

2. **For Production (with authentication later):**
   ```sql
   -- Allow authenticated users to read their own leads (if you add user_id)
   CREATE POLICY "Users can read their own leads"
   ON leads
   FOR SELECT
   TO authenticated
   USING (auth.uid() = user_id);
   
   -- Allow anonymous to read all (if you want public dashboard)
   CREATE POLICY "Allow anonymous read access"
   ON leads
   FOR SELECT
   TO anon
   USING (true);
   ```

---

## 🧪 Debugging Steps

### **Step 1: Check Browser Console**

1. Open Dashboard page
2. Open Developer Tools (F12)
3. Check Console for errors
4. Look for:
   - `❌ Supabase query error:`
   - `Error fetching leads:`

### **Step 2: Check Network Tab**

1. Open Network tab in DevTools
2. Filter by "leads" or "supabase"
3. Find the query request
4. Check Response:
   - If empty array `[]` → RLS blocking
   - If error → Check error message

### **Step 3: Test Supabase Query Directly**

Run this in Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'leads';

-- Check existing policies
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'leads';

-- Test query (should return 7 rows)
SELECT * FROM leads ORDER BY created_at DESC;
```

### **Step 4: Test with Supabase Client in Browser Console**

```javascript
// In browser console (on Dashboard page)
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false })

console.log('Data:', data)
console.log('Error:', error)
```

---

## 🎯 Quick Fix Summary

1. **Check Supabase RLS settings** → If enabled, create SELECT policy
2. **Add error logging** → See actual error in console
3. **Test query** → Run SQL query in Supabase to confirm data exists
4. **Check Supabase client** → Verify credentials in `.env`

**Most likely fix:**
```sql
CREATE POLICY "Allow anonymous read access"
ON leads
FOR SELECT
TO anon
USING (true);
```

Run this in Supabase SQL Editor, then refresh your Dashboard.

---

## 📋 Checklist

- [ ] Check Supabase Dashboard → `leads` table → Policies tab
- [ ] Verify RLS is enabled/disabled
- [ ] Create SELECT policy for `anon` role
- [ ] Check browser console for errors
- [ ] Test query in Supabase SQL Editor
- [ ] Verify `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Refresh Dashboard page

---

**Expected Result:** Dashboard should now show all 7 leads.

