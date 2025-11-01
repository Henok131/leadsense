# 🔍 Dashboard Showing 0 Leads - Complete Analysis & Fix

## ❓ Answers to Your Questions

### **1. Why is `/dashboard` showing 0 leads even though the `leads` table has 7 rows?**

**Most Likely Cause: Row Level Security (RLS) Policy**

The Supabase query in `Dashboard.jsx` has **NO filters**:
```javascript
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false })
```

If **RLS is enabled** on the `leads` table without a SELECT policy for anonymous users, the query returns **0 rows** even if the table has 7 rows.

**The Dashboard uses:**
- `VITE_SUPABASE_ANON_KEY` (anonymous key)
- No authentication
- No user session

If RLS blocks anonymous reads, you'll get 0 rows.

---

### **2. Check the Supabase Query or Fetch Logic**

**Location:** `src/pages/Dashboard.jsx` lines 29-58

**Current Query:**
```javascript
const fetchLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  setLeads(data || [])
}
```

**Issues Found:**
- ✅ Query is correct (no filters applied)
- ❌ Error handling was silent (now fixed - see fix below)
- ❌ No RLS policy check (code doesn't account for RLS)

**Updated Query (with better error logging):**
```javascript
const fetchLeads = async () => {
  console.log('🔄 Fetching leads from Supabase...')
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
    setLeads([])
    return
  }

  console.log('✅ Fetched leads:', data?.length || 0, 'rows')
  setLeads(data || [])
}
```

---

### **3. Is there a filter (like `score > 0`, `created_at = today`, or `category = hot`) that's making it return 0?**

**Answer: NO**

The Supabase query has **NO filters**:
- ❌ No `score > 0` filter
- ❌ No `created_at = today` filter
- ❌ No `category = 'Hot'` filter
- ❌ No WHERE clause at all

**Filters are CLIENT-SIDE only:**

```javascript
// Client-side filtering (Dashboard.jsx:123-142)
const filteredLeads = useMemo(() => {
  let result = leads  // ← Filters applied AFTER fetching
  
  // Category filter (client-side)
  if (categoryFilter !== 'All') {
    result = result.filter(lead => lead.category === categoryFilter)
  }
  
  // Search filter (client-side)
  if (searchQuery.trim()) {
    result = result.filter(lead => 
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query)
    )
  }
  
  return result
}, [leads, categoryFilter, searchQuery])
```

**The database query fetches ALL leads, then filters happen in the browser.**

---

### **4. Does the code rely on user ID or auth session? I am using it as owner.**

**Answer: NO**

The code does **NOT** rely on:
- ❌ User authentication
- ❌ User ID
- ❌ Auth session
- ❌ User-specific filtering

**Supabase Client Setup:**
```javascript
// src/lib/supabaseClient.js
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

This uses the **anonymous key**, meaning:
- No user authentication
- No user ID
- Subject to RLS policies for anonymous access

**You're using it as "owner" but the code doesn't use authentication**, so you're accessing as an **anonymous user**.

---

### **5. Where is the total leads metric being computed?**

**Location:** `src/pages/Dashboard.jsx` lines 57-119

```javascript
const stats = useMemo(() => {
  const total = leads.length  // ← Total leads computed here
  const hotLeads = leads.filter(lead => lead.category === 'Hot').length
  const averageScore = total > 0 
    ? Math.round(leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / total)
    : 0
  // ... rest of stats
}, [leads])
```

**The `total` metric is:**
- Computed client-side from `leads.length`
- If `leads` is empty (0 rows), `total = 0`
- No database aggregation (COUNT query)

**If the query returns 0 rows due to RLS, `total = 0`.**

---

### **6. Suggest a fix to make sure it shows all submitted leads by default.**

## ✅ **SOLUTION: Enable RLS Policy for Anonymous Reads**

### **Step 1: Create RLS Policy in Supabase**

Go to **Supabase Dashboard** → **SQL Editor** → Run this:

```sql
-- Allow anonymous users to SELECT all leads
CREATE POLICY IF NOT EXISTS "Allow anonymous read access"
ON public.leads
FOR SELECT
TO anon
USING (true);
```

**Or use the complete SQL file I created: `SUPABASE_RLS_FIX.sql`**

### **Step 2: Verify RLS is the Issue**

Check if RLS is enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'leads';

-- Check existing policies
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'leads';
```

### **Step 3: Test the Query**

Run this in Supabase SQL Editor (should return 7 rows):

```sql
SELECT * FROM leads ORDER BY created_at DESC;
```

### **Step 4: Check Browser Console**

After applying the fix, refresh Dashboard and check console:
- Should see: `✅ Fetched leads: 7 rows`
- If error: `❌ Supabase query error:` - Check error details

---

## 🔧 **Alternative: Disable RLS (Only for Testing)**

**⚠️ WARNING:** Only for development/testing. Not recommended for production.

```sql
-- Disable RLS on leads table
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
```

**Better approach:** Keep RLS enabled and create the policy above.

---

## 📋 **Debugging Checklist**

1. ✅ **Check Browser Console** - Look for `❌ Supabase query error:`
2. ✅ **Check Supabase Dashboard** - Verify table has 7 rows
3. ✅ **Check RLS Settings** - Go to Table Editor → `leads` → Policies tab
4. ✅ **Run SQL Test** - `SELECT * FROM leads;` in Supabase SQL Editor
5. ✅ **Verify Environment Variables** - Check `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
6. ✅ **Create RLS Policy** - Run the SQL policy creation command
7. ✅ **Refresh Dashboard** - Should now show 7 leads

---

## 🎯 **Expected Result After Fix**

- ✅ Dashboard shows all 7 leads
- ✅ Total Leads card shows `7`
- ✅ Leads table displays all rows
- ✅ Console shows: `✅ Fetched leads: 7 rows`

---

## 📝 **Files Changed**

1. ✅ `src/pages/Dashboard.jsx` - Added better error logging
2. ✅ `SUPABASE_RLS_FIX.sql` - SQL script to create RLS policy
3. ✅ `DASHBOARD_DEBUG_FIX.md` - Complete debugging guide

---

## 🚀 **Quick Fix Command**

Run this in **Supabase SQL Editor**:

```sql
CREATE POLICY IF NOT EXISTS "Allow anonymous read access"
ON public.leads
FOR SELECT
TO anon
USING (true);
```

Then refresh your Dashboard page!

