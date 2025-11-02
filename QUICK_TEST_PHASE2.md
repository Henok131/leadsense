# 🧪 Quick Test Guide - Phase 2 Lead Editor

## ✅ Implementation Complete!

All Phase 2 files have been created and integrated. Here's how to test the new feature.

---

## 🚀 How to Test

### **1. Start Development Server**
```bash
npm run dev
```

### **2. Navigate to Dashboard**
Go to: `http://localhost:5173/dashboard`

### **3. Test the Flow**

#### **Step 1: Click a Lead Row**
- Click any lead in the table
- ✅ A modal should pop up showing lead details

#### **Step 2: Click "Edit Lead"**
- In the modal footer, click the "Edit Lead" button
- ✅ Should navigate to `/leads/:id` page
- ✅ Should show lead edit form

#### **Step 3: Make Changes**
- Change the **Score** (e.g., from 75 to 85)
- Change the **Category** (e.g., from "Warm" to "Hot")
- Add **Internal Notes** (e.g., "Follow up next week")

#### **Step 4: Save Changes**
- Click "Save Changes" button
- ✅ Should show loading spinner
- ✅ Should show "✅ Lead updated successfully!" alert
- ✅ Should auto-navigate to `/dashboard`
- ✅ Dashboard stats should update

#### **Step 5: Verify Updates**
- Check the lead you edited
- ✅ Score should be updated
- ✅ Category should be updated
- ✅ Stats reflect the changes

---

## 🎯 Alternative Test Flow

### **Direct URL Access**
1. Go to: `http://localhost:5173/leads/[ANY_LEAD_ID]`
2. Replace `[ANY_LEAD_ID]` with an actual UUID from your leads table
3. ✅ Page should load with that lead's data

### **Test Error Handling**
1. Go to: `http://localhost:5173/leads/invalid-id`
2. ✅ Should show "Lead not found" error
3. ✅ Should show "Back to Dashboard" button

---

## 🔍 What to Verify

### **Visual Elements**
- ✅ Dark theme glassmorphism cards
- ✅ Gradient buttons and text
- ✅ Icons load correctly
- ✅ Animations work smoothly
- ✅ Responsive on mobile

### **Functionality**
- ✅ Lead data loads correctly
- ✅ Editable fields work
- ✅ Notes textarea expands
- ✅ Character counter works
- ✅ Save button only enabled when changes exist
- ✅ Cancel button works
- ✅ Unsaved changes indicator shows

### **User Experience**
- ✅ Loading states appear
- ✅ Success message shows
- ✅ Error handling works
- ✅ Navigation flows smoothly
- ✅ Mobile responsive

---

## 🐛 Common Issues & Fixes

### **Issue: "Lead not found"**
- **Cause:** Invalid UUID or lead doesn't exist
- **Fix:** Use a valid lead ID from your database

### **Issue: "Failed to update lead"**
- **Cause:** RLS policy blocking updates
- **Fix:** Check Supabase RLS policies allow UPDATE

### **Issue: Changes don't persist**
- **Cause:** Update query failing silently
- **Fix:** Check browser console for errors

### **Issue: Route not found**
- **Cause:** Route not added to App.jsx
- **Fix:** Verify route exists in `src/App.jsx`

---

## 📊 Expected Behavior

### **Dashboard → Modal → Edit**
1. Click row → Modal opens
2. Click "Edit Lead" → Navigate to `/leads/:id`
3. Make changes → Save
4. Alert shown → Return to dashboard
5. Data updated ✅

### **Cancel Flow**
1. Make changes → Click "Cancel"
2. Confirmation dialog → Click "OK"
3. Return to dashboard → Changes lost ✅

### **Error Flow**
1. Invalid lead ID → Error shown
2. "Back to Dashboard" → Return safely ✅

---

## 🎨 UI Components to Check

### **LeadDetailCard**
- Basic info section
- Scoring section (editable)
- Tags display
- Metadata section

### **LeadNotesPanel**
- Textarea input
- Character counter
- Loading state

### **LeadActionsBar**
- Save button (disabled when no changes)
- Cancel button
- Delete button (disabled)
- Unsaved changes badge

---

## ✅ Success Criteria

When all tests pass:
- ✅ Can view lead details
- ✅ Can edit score, category, notes
- ✅ Changes save to Supabase
- ✅ Dashboard updates after save
- ✅ Error handling works
- ✅ Loading states work
- ✅ Mobile responsive
- ✅ No console errors

---

## 🚀 Ready for Production

Once tested locally:
1. Run `npm run build`
2. Deploy to VPS (as per deployment guide)
3. Test on production
4. Monitor logs

---

## 📝 Test Checklist

Copy and paste this to mark items as you test:

```
[ ] Development server starts
[ ] Dashboard loads
[ ] Click lead row → Modal opens
[ ] Click "Edit Lead" → Navigate to edit page
[ ] Edit score → Save → Success
[ ] Edit category → Save → Success
[ ] Edit notes → Save → Success
[ ] Cancel with no changes → Works
[ ] Cancel with unsaved changes → Confirmation shown
[ ] Invalid lead ID → Error shown
[ ] Mobile responsive → Layout works
[ ] Loading states → Show correctly
[ ] Error states → Show correctly
[ ] Browser console → No errors
```

---

**Happy Testing!** 🎉

