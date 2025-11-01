# Supabase Setup Guide for Asenay Leadsense

## 🎯 Quick Setup

### Option 1: Migrate Existing Table (Recommended)

If you already have a `leads` table with some columns, use the migration script:

1. Open **Supabase Dashboard** → Your Project
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-migration.sql`
4. Click **Run** to execute

This will add all missing columns to your existing table without losing data.

### Option 2: Create Fresh Table

If you're starting fresh or want to recreate the table:

1. Open **Supabase Dashboard** → Your Project
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-complete-schema.sql`
4. Click **Run** to execute

⚠️ **Warning**: This will drop and recreate the table, deleting all existing data!

---

## 📋 Required Fields Checklist

After running the migration, verify these fields exist in your `leads` table:

### ✅ Basic Info (Required)
- [ ] `name` (text, NOT NULL)
- [ ] `email` (text, NOT NULL)
- [ ] `phone` (text, nullable)
- [ ] `company` (text, nullable)
- [ ] `website` (text, nullable)

### ✅ Lead Content
- [ ] `message` (text, NOT NULL)
- [ ] `tags` (text[], nullable)
- [ ] `interest_category` (text, nullable)

### ✅ Qualification & Scoring
- [ ] `score` (integer, nullable)
- [ ] `category` (text, nullable) - 'Hot', 'Warm', 'Cold'
- [ ] `status` (text, default 'New')
- [ ] `deal_value` (numeric, nullable)
- [ ] `contact_preference` (text, nullable)

### ✅ Metadata
- [ ] `source` (text, default 'form')
- [ ] `ip_address` (text, nullable)
- [ ] `location` (text, nullable)
- [ ] `user_agent` (text, nullable)

### ✅ System Fields
- [ ] `created_at` (timestamp, default now())
- [ ] `updated_at` (timestamp, default now())

### ✅ CRM Fields (Internal)
- [ ] `assigned_to` (text, nullable)
- [ ] `last_contacted_at` (timestamp, nullable)
- [ ] `internal_notes` (text, nullable)

---

## 🔍 Verify Table Structure

After running the migration, verify in Supabase:

1. Go to **Table Editor** → `leads` table
2. Click **Definition** tab
3. Check that all columns listed above exist

Or run this query in SQL Editor:

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
```

---

## 🐛 Troubleshooting

### Error: "column already exists"
- This is normal! The migration script uses `ADD COLUMN IF NOT EXISTS`
- Safe to run multiple times

### Error: "permission denied"
- Check that RLS policies are set correctly
- Verify you're using the correct database user

### Form Still Failing?
1. Open browser **Developer Tools** → **Network** tab
2. Submit the form again
3. Look for the Supabase POST request
4. Check the **Response** tab for exact error message
5. Common issues:
   - Field name mismatch (case-sensitive!)
   - Missing NOT NULL field
   - Wrong data type

---

## ✅ Next Steps

Once the table is set up correctly:

1. ✅ Test form submission
2. ✅ Verify data appears in Supabase table
3. ✅ Check Dashboard shows submitted leads
4. ✅ Confirm AI scoring works
5. ✅ Verify Slack notifications for HOT leads

---

## 📞 Need Help?

If you're still seeing errors:

1. **Check field names** - Must match exactly (case-sensitive)
2. **Check data types** - Must match expected types
3. **Check RLS policies** - Must allow INSERT operations
4. **Check console errors** - Browser DevTools → Console tab

