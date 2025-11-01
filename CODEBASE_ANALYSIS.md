# 🧠 LeadSense Codebase Analysis

**Version:** Production-ready  
**Tech Stack:** React 18 + Vite 5 + Tailwind CSS 3 + Supabase  
**Repository:** `Henok131/leadsense` (Private)  
**Production URL:** `https://lead.asenaytech.com`

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Existing Features](#existing-features)
3. [Routes & Navigation](#routes--navigation)
4. [Components & Pages](#components--pages)
5. [Services & Libraries](#services--libraries)
6. [Database Schema](#database-schema)
7. [External Integrations](#external-integrations)
8. [Safe Areas for New Features](#safe-areas-for-new-features)
9. [Naming Conventions](#naming-conventions)
10. [Refactoring Recommendations](#refactoring-recommendations)
11. [Development Checklist](#development-checklist)

---

## 📁 Project Structure

```
lead/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LeadForm.jsx    # Lead submission form (536 lines)
│   │   └── NavBar.jsx      # Navigation bar with mobile menu
│   ├── pages/              # Route-level components
│   │   ├── Landing.jsx     # Homepage with hero & form (200 lines)
│   │   └── Dashboard.jsx   # Leads dashboard (366 lines)
│   ├── lib/                # Service layer & utilities
│   │   ├── supabaseClient.js  # Supabase connection (12 lines)
│   │   ├── aiScorer.js        # OpenAI GPT-4 integration (42 lines)
│   │   ├── notify.js           # Slack webhook notifications (25 lines)
│   │   └── helpers.js          # UI utilities (17 lines)
│   ├── App.jsx             # Main router & layout wrapper
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles & Tailwind directives
├── public/                 # Static assets
├── dist/                   # Production build (gitignored)
├── docker-compose.yml      # Production Docker setup
├── nginx.conf              # NGINX config for HTTPS
├── deploy.sh               # One-command deployment script
└── package.json            # Dependencies & scripts
```

---

## ✨ Existing Features

### ✅ **Core Functionality**

1. **Lead Capture Form** (`LeadForm.jsx`)
   - Comprehensive form with 15+ fields
   - Real-time validation (name, email, message)
   - Dynamic tag system (add/remove tags)
   - Dropdown selectors (category, status, rating, contact preference)
   - Loading states with spinner
   - Auto-reset after successful submission
   - Glass morphism design with gradients

2. **Landing Page** (`Landing.jsx`)
   - Hero section with gradient branding
   - 3 feature cards (AI Scoring, Analytics, Security)
   - Integrated lead form
   - Success/error messaging
   - UTM parameter capture from URL
   - Auto-redirect to dashboard after submission

3. **Dashboard** (`Dashboard.jsx`)
   - 4 stat cards (Total Leads, % Hot Leads, Avg Score, Today's Leads)
   - Real-time lead table with sorting
   - Search functionality (name, email, company)
   - Category filtering (All, Hot, Warm, Cold)
   - Expandable rows to view messages
   - CSV export functionality
   - Auto-refresh every 30 seconds
   - Empty state handling
   - Loading skeletons

4. **Navigation** (`NavBar.jsx`)
   - Fixed top navbar with glass effect
   - Responsive mobile menu
   - Active route highlighting
   - Logo with gradient text

### ✅ **Backend Integration**

1. **Supabase Database**
   - `leads` table with 20+ columns
   - Row Level Security (RLS) enabled
   - Auto-updating `updated_at` trigger
   - Indexed fields (email, status, category, created_at)

2. **AI Lead Scoring** (`aiScorer.js`)
   - OpenAI GPT-4 Turbo integration
   - Returns: `{ category, score, tags }`
   - Fallback to 'Cold' if API fails
   - Currently **NOT being called** (needs integration)

3. **Slack Notifications** (`notify.js`)
   - Webhook-based alerts for 'Hot' leads
   - Currently **NOT being called** (needs integration)

### ✅ **UI/UX Design System**

1. **Tailwind Theme**
   - Custom colors: `primary`, `secondary`, `accent`, `dark`
   - Glass morphism utilities (`glass-card`)
   - Gradient utilities (`gradient-text`, `gradient-bg`)

2. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: `md:`, `lg:`
   - Mobile menu for navigation

3. **Accessibility**
   - Semantic HTML
   - ARIA labels (can be improved)
   - Keyboard navigation support

---

## 🗺️ Routes & Navigation

### **Current Routes**

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Landing` | Homepage with hero section and lead form |
| `/dashboard` | `Dashboard` | Leads dashboard with stats and table |

### **Router Setup**

```jsx
// src/App.jsx
<Router>
  <NavBar />           {/* Fixed navigation */}
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Router>
```

**✅ Safe to Add:** New routes like `/analytics`, `/settings`, `/leads/:id`

---

## 🧩 Components & Pages

### **Components** (`src/components/`)

#### 1. `LeadForm.jsx` (536 lines)
**Purpose:** Comprehensive lead submission form  
**Props:** `onSubmit: (leadData) => Promise<void>`  
**State:** 
- `formData` - All form fields
- `tagInput` - Current tag being typed
- `isSubmitting` - Loading state
- `errors` - Validation errors

**Key Features:**
- Sections: Basic Info, Message, Tags & Category, Lead Scoring, Contact Preference
- Validation: name, email, message required
- Auto-reset after 2 seconds on success
- Disabled inputs during submission

**⚠️ Warning:** This component is complex. Modifications require careful testing.

**✅ Safe Areas:**
- Add new form fields (extend `formData` state)
- Add new dropdown options
- Modify styling/classes
- Add new validation rules

**⚠️ Risky Areas:**
- Changing `handleSubmit` logic (affects data flow)
- Modifying `onSubmit` prop signature
- Changing form reset timing

#### 2. `NavBar.jsx` (82 lines)
**Purpose:** Top navigation with mobile menu  
**State:** `mobileMenuOpen` - Mobile menu toggle

**✅ Safe to Add:**
- New navigation links
- Dropdown menus
- User profile menu
- Search bar
- Notifications badge

### **Pages** (`src/pages/`)

#### 1. `Landing.jsx` (200 lines)
**Purpose:** Homepage with lead form integration  
**State:**
- `isSubmitting` - Submission loading
- `submitStatus` - 'success' | 'error' | null
- `errorMessage` - Error details

**Key Flow:**
1. User fills form → `LeadForm` calls `onSubmit`
2. `handleLeadSubmit` validates → formats payload
3. Inserts to Supabase
4. Shows success/error message
5. Redirects to dashboard after 2 seconds

**✅ Safe Areas:**
- Hero section content/styling
- Feature cards (text, icons, layout)
- Success/error message UI
- UTM parameter handling

**⚠️ Risky Areas:**
- `handleLeadSubmit` function (data submission logic)
- Supabase insert payload structure

#### 2. `Dashboard.jsx` (366 lines)
**Purpose:** Leads dashboard with stats and table  
**State:**
- `leads` - All leads from Supabase
- `loading` - Initial load state
- `searchQuery` - Search input
- `categoryFilter` - Active filter
- `expandedRow` - Currently expanded lead ID

**Key Features:**
- Auto-refresh every 30 seconds
- Memoized stats calculation
- Memoized filtering
- CSV export

**✅ Safe Areas:**
- Stats card styling/layout
- Table columns (add new columns safely)
- Search/filter UI
- Empty state design

**⚠️ Risky Areas:**
- `fetchLeads` function (Supabase query)
- Stats calculation logic
- Filtering logic

---

## 🔧 Services & Libraries

### **Supabase Client** (`src/lib/supabaseClient.js`)

```javascript
// Singleton Supabase client
export const supabase = createClient(url, anonKey)
```

**Usage:** Imported in `Landing.jsx` and `Dashboard.jsx`  
**Table:** `leads`  
**Operations:** `select()`, `insert()`

**✅ Safe Areas:**
- Add new tables (create new client files)
- Add real-time subscriptions
- Add storage buckets

**⚠️ Risky Areas:**
- Modifying the singleton export
- Changing RLS policies (requires Supabase dashboard)

### **AI Scorer** (`src/lib/aiScorer.js`)

```javascript
export async function scoreLead(message: string): Promise<{
  category: 'Hot' | 'Warm' | 'Cold',
  score: number,
  tags: string[]
}>
```

**Status:** ⚠️ **Defined but NOT called**  
**Integration Needed:** Call this in `Landing.jsx` before Supabase insert

**✅ Safe Areas:**
- Adjust AI prompt/instructions
- Change model (e.g., `gpt-4-turbo-preview`)
- Adjust temperature
- Add error handling

**⚠️ Risky Areas:**
- Changing return type (breaks callers)
- Removing fallback values

### **Slack Notifier** (`src/lib/notify.js`)

```javascript
export async function notifyLead(lead: object): Promise<void>
```

**Status:** ⚠️ **Defined but NOT called**  
**Integration Needed:** Call this in `Landing.jsx` after successful insert if `category === 'Hot'`

**✅ Safe Areas:**
- Customize message format
- Add rich formatting (blocks, attachments)
- Add emojis/icons

**⚠️ Risky Areas:**
- Changing function signature
- Removing category check (would spam all leads)

### **Helpers** (`src/lib/helpers.js`)

```javascript
getBadgeColor(category: string): string  // Tailwind classes
formatDate(timestamp: string): string    // Date formatting
```

**✅ Safe Areas:**
- Add new utility functions
- Modify formatting logic
- Add date/timezone support

---

## 🗄️ Database Schema

### **Supabase Table: `leads`**

```sql
CREATE TABLE leads (
  -- Primary Key
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info (Required)
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  website text,
  
  -- Lead Content
  message text NOT NULL,
  tags text[],              -- Array of strings
  interest_category text,
  
  -- Qualification & Scoring
  score integer,
  category text,            -- 'Hot', 'Warm', 'Cold'
  status text DEFAULT 'New',
  deal_value numeric,
  feedback_rating integer,  -- 1-5
  contact_preference text,  -- 'Email', 'Call', 'WhatsApp'
  
  -- Metadata
  source text DEFAULT 'form',
  utm_campaign text,
  utm_source text,
  ip_address text,
  location text,
  user_agent text,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### **Indexes**

- `idx_leads_email` - Fast email lookups
- `idx_leads_status` - Filter by status
- `idx_leads_category` - Filter by category
- `idx_leads_created_at` - Sort by date

### **Policies (RLS)**

- ✅ **Allow insert** - Public form submission
- ✅ **Allow select** - Dashboard viewing
- ✅ **Allow update** - Status updates

### **Triggers**

- `update_updated_at_column()` - Auto-updates `updated_at` on row changes

**✅ Safe to Add:**
- New columns (via migration)
- New indexes for performance
- New policies for auth
- New tables (e.g., `users`, `notes`, `activities`)

**⚠️ Risky Changes:**
- Dropping columns (data loss)
- Changing column types (requires migration)
- Modifying RLS policies (security impact)

---

## 🔌 External Integrations

### **1. Supabase** (`@supabase/supabase-js` v2.39.0)

**Purpose:** Database + Auth + Storage  
**Usage:** 
- Database: `leads` table
- Auth: Not currently used (can add)
- Storage: Not currently used (can add for file uploads)

**Environment Variables:**
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### **2. OpenAI API** (GPT-4 Turbo)

**Purpose:** AI lead scoring  
**Status:** ⚠️ Code exists but **NOT integrated**  
**Function:** `scoreLead(message)` in `aiScorer.js`

**Environment Variables:**
```bash
VITE_OPENAI_API_KEY=sk-xxx...
```

**⚠️ Integration Needed:**
Call `scoreLead()` in `Landing.jsx` before Supabase insert:

```javascript
// In handleLeadSubmit, before creating leadPayload:
const aiScore = await scoreLead(form.message)
const leadPayload = {
  ...form,
  score: aiScore.score,
  category: aiScore.category,
  tags: [...form.tags, ...aiScore.tags],
  // ...
}
```

### **3. Slack Webhooks**

**Purpose:** Notifications for Hot leads  
**Status:** ⚠️ Code exists but **NOT integrated**  
**Function:** `notifyLead(lead)` in `notify.js`

**Environment Variables:**
```bash
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx...
```

**⚠️ Integration Needed:**
Call `notifyLead()` in `Landing.jsx` after successful insert:

```javascript
// After successful Supabase insert:
if (leadPayload.category === 'Hot') {
  await notifyLead(leadPayload)
}
```

### **4. React Router DOM** (v6.21.1)

**Purpose:** Client-side routing  
**Usage:** Navigation between pages  
**✅ Safe:** Add new routes, nested routes, route guards

### **5. Lucide React** (v0.303.0)

**Purpose:** Icon library  
**Usage:** Icons throughout UI (User, Mail, Phone, etc.)  
**✅ Safe:** Import new icons as needed

---

## ✅ Safe Areas for New Features

### **🟢 Green Zone: Zero Risk**

1. **Styling & UI Tweaks**
   - Modify Tailwind classes
   - Add new CSS utilities
   - Update color scheme
   - Adjust spacing/layout

2. **New Routes**
   - Create new page components
   - Add routes to `App.jsx`
   - Add navigation links

3. **New Utility Functions**
   - Add to `src/lib/helpers.js`
   - Create new utility files
   - Add date/time formatters

4. **New Form Fields**
   - Add to `LeadForm.jsx` `formData`
   - Add input fields (safe if following patterns)
   - Add validation rules

5. **New Stats Cards**
   - Add to `Dashboard.jsx` stats grid
   - Calculate new metrics
   - Display new charts (add chart library)

### **🟡 Yellow Zone: Low Risk (Test Thoroughly)**

1. **New Database Columns**
   - Create migration script
   - Update TypeScript types (if added)
   - Update form submission payload
   - Update dashboard display

2. **New API Integrations**
   - Create new service file in `src/lib/`
   - Add environment variables
   - Integrate in components

3. **Form Logic Changes**
   - Modify `handleSubmit` in `LeadForm.jsx`
   - Change validation rules
   - Update submission flow

4. **Dashboard Enhancements**
   - Add new filters
   - Add sorting functionality
   - Add pagination
   - Add export formats (Excel, PDF)

### **🔴 Red Zone: High Risk (Requires Careful Planning)**

1. **Database Schema Changes**
   - Dropping columns
   - Changing column types
   - Modifying RLS policies

2. **Core Service Modifications**
   - Changing Supabase client setup
   - Modifying AI scorer return type
   - Changing notification logic

3. **Router/Routing Changes**
   - Changing base path
   - Modifying route structure
   - Adding authentication guards

---

## 📝 Naming Conventions

### **Current Patterns** (Maintain These)

1. **Components:** PascalCase
   - `LeadForm.jsx`
   - `NavBar.jsx`
   - `Dashboard.jsx`

2. **Files/Folders:** camelCase for JS files, kebab-case for configs
   - `supabaseClient.js`
   - `aiScorer.js`
   - `vite.config.js`
   - `docker-compose.yml`

3. **Functions:** camelCase
   - `handleSubmit()`
   - `fetchLeads()`
   - `getBadgeColor()`

4. **State Variables:** camelCase
   - `isSubmitting`
   - `searchQuery`
   - `expandedRow`

5. **Constants:** UPPER_SNAKE_CASE (not used yet, but recommended for env vars)
   - `VITE_SUPABASE_URL`

### **Recommendations for New Code**

1. **New Components:**
   - Location: `src/components/`
   - Naming: `FeatureName.jsx` (PascalCase)
   - Examples: `LeadCard.jsx`, `StatCard.jsx`, `FilterPanel.jsx`

2. **New Pages:**
   - Location: `src/pages/`
   - Naming: `PageName.jsx` (PascalCase)
   - Examples: `Analytics.jsx`, `Settings.jsx`, `LeadDetail.jsx`

3. **New Services:**
   - Location: `src/lib/`
   - Naming: `serviceName.js` (camelCase)
   - Examples: `emailService.js`, `exportService.js`, `analyticsService.js`

4. **New Utilities:**
   - Location: `src/lib/` or `src/utils/` (create if needed)
   - Naming: `utilityName.js` (camelCase)
   - Examples: `dateUtils.js`, `validationUtils.js`, `formatUtils.js`

5. **New Hooks:**
   - Location: `src/hooks/` (create if needed)
   - Naming: `useHookName.js` (camelCase with `use` prefix)
   - Examples: `useLeads.js`, `useFormValidation.js`, `useDebounce.js`

---

## 🔨 Refactoring Recommendations

### **Priority 1: Critical Issues**

1. **⚠️ Integrate AI Scoring**
   - **Current:** Code exists but never called
   - **Fix:** Call `scoreLead()` in `Landing.jsx` before Supabase insert
   - **Impact:** Leads will get AI scores instead of default 0

2. **⚠️ Integrate Slack Notifications**
   - **Current:** Code exists but never called
   - **Fix:** Call `notifyLead()` after successful insert for Hot leads
   - **Impact:** Team gets notified of hot leads

### **Priority 2: Code Quality**

3. **Extract Custom Hooks**
   - Create `src/hooks/useLeads.js` for dashboard data fetching
   - Create `src/hooks/useForm.js` for form state management
   - **Benefit:** Reusability, testability

4. **Separate Form Logic from UI**
   - Create `src/lib/leadValidation.js` for validation rules
   - Create `src/lib/leadFormatter.js` for payload formatting
   - **Benefit:** Easier testing, cleaner components

5. **Add Error Boundaries**
   - Wrap routes in error boundaries
   - Add error logging (e.g., Sentry)
   - **Benefit:** Better error handling, user experience

6. **Type Safety** (Optional)
   - Add TypeScript or JSDoc types
   - Type props, state, function returns
   - **Benefit:** Catch errors early, better IDE support

### **Priority 3: Performance**

7. **Code Splitting**
   - Lazy load Dashboard component
   - Split large components
   - **Benefit:** Faster initial load

8. **Memoization**
   - Memoize expensive calculations (already done in Dashboard)
   - Add React.memo to heavy components
   - **Benefit:** Reduce re-renders

### **Priority 4: Cleanup**

9. **Remove Unused Code**
   - Clean up deployment troubleshooting scripts
   - Remove commented code
   - **Benefit:** Cleaner codebase

10. **Environment Variables Documentation**
    - Create `.env.example` with all required vars
    - Document each variable's purpose
    - **Benefit:** Easier onboarding

---

## ✅ Development Checklist

### **Pre-Development Setup**

- [ ] Create feature branch: `git checkout -b feature/your-feature-name`
- [ ] Pull latest from main: `git pull origin main`
- [ ] Install dependencies: `npm install`
- [ ] Verify `.env` has all required variables
- [ ] Test local dev server: `npm run dev`

### **During Development**

- [ ] Write code following naming conventions
- [ ] Test locally with `npm run dev`
- [ ] Test form submissions end-to-end
- [ ] Test dashboard displays correctly
- [ ] Check browser console for errors
- [ ] Test on mobile/responsive design
- [ ] Verify Supabase queries work
- [ ] Test error handling (network failures, API errors)

### **Before Committing**

- [ ] Run build: `npm run build` (check for errors)
- [ ] Test production build: `npm run preview`
- [ ] Check for console warnings/errors
- [ ] Verify no breaking changes to existing features
- [ ] Update documentation if needed
- [ ] Remove debug console.logs (keep important ones)

### **Git Workflow**

```bash
# 1. Create feature branch
git checkout -b feature/dashboard-analytics

# 2. Make changes
# ... edit files ...

# 3. Stage changes
git add .

# 4. Commit with clear message
git commit -m "feat: add analytics chart to dashboard"

# 5. Push branch
git push origin feature/dashboard-analytics

# 6. Create Pull Request on GitHub
# - Add description of changes
# - List any breaking changes
# - Add screenshots if UI changes
```

### **Pre-Merge Testing**

- [ ] Review code changes
- [ ] Test locally one more time
- [ ] Check for merge conflicts
- [ ] Verify CI/CD passes (if set up)
- [ ] Get code review approval

### **Post-Merge Deployment**

- [ ] Merge PR to main
- [ ] Pull latest on local: `git checkout main && git pull`
- [ ] Build production: `npm run build`
- [ ] Deploy: `./deploy.sh` or manual deployment
- [ ] Verify production site works
- [ ] Check Supabase dashboard for data integrity
- [ ] Monitor for errors (browser console, server logs)

---

## 🚀 Recommended Next Features (Safe to Build)

### **Easy Wins (Low Risk)**

1. **Analytics Page** (`/analytics`)
   - Add new route
   - Create `Analytics.jsx` page
   - Use existing `leads` data
   - Add charts (use Chart.js or Recharts)

2. **Lead Detail Page** (`/leads/:id`)
   - Add dynamic route
   - Create `LeadDetail.jsx` page
   - Fetch single lead from Supabase
   - Display full lead information

3. **Enhanced Filtering**
   - Add date range filter
   - Add status filter (not just category)
   - Add multi-select filters
   - Add saved filter presets

4. **Export Enhancements**
   - Export to Excel (xlsx)
   - Export to PDF
   - Email export functionality
   - Scheduled exports

5. **Search Improvements**
   - Add search suggestions
   - Add search history
   - Add advanced search modal
   - Add search by tags

### **Medium Complexity**

6. **Lead Notes/Activity**
   - Add `notes` table in Supabase
   - Create note-taking UI
   - Display activity timeline
   - Add notes to lead detail page

7. **Lead Assignment**
   - Add `assigned_to` field (already in schema)
   - Create user selection dropdown
   - Filter by assigned user
   - Add assignment history

8. **Bulk Actions**
   - Select multiple leads
   - Bulk update status
   - Bulk assign to user
   - Bulk export

9. **Email Integration**
   - Send emails to leads
   - Email templates
   - Track email opens
   - Email history

10. **Charts & Visualizations**
    - Lead trend charts
    - Category distribution pie chart
    - Score distribution histogram
    - Conversion funnel

### **Advanced Features**

11. **Authentication**
    - Add Supabase Auth
    - Protect dashboard route
    - User profiles
    - Role-based access

12. **Real-time Updates**
    - Supabase real-time subscriptions
    - Live dashboard updates
    - Browser notifications
    - WebSocket integration

13. **AI Enhancements**
    - Sentiment analysis
    - Auto-tagging
    - Lead scoring explanation
    - Conversation analysis

---

## ⚠️ Warnings & Gotchas

### **Critical Warnings**

1. **AI Scoring Not Integrated**
   - `scoreLead()` exists but is never called
   - Leads currently get `score: 0` and `category: 'Cold'`
   - **Action:** Integrate before production use

2. **Slack Notifications Not Integrated**
   - `notifyLead()` exists but is never called
   - No alerts for Hot leads
   - **Action:** Integrate after AI scoring works

3. **No Error Boundaries**
   - Component errors will crash entire app
   - **Action:** Add error boundaries before major releases

4. **No Form Validation on Server**
   - All validation is client-side
   - **Action:** Add Supabase RLS validation or edge functions

### **Common Pitfalls**

1. **Environment Variables**
   - Must have `VITE_` prefix for client-side access
   - Don't commit `.env` to git
   - Must rebuild after changing `.env`

2. **Supabase RLS**
   - All policies currently allow public access
   - **Security Risk:** Consider adding user-based policies

3. **Asset Paths**
   - Uses `base: './'` in Vite config (relative paths)
   - Don't change this unless you understand the impact

4. **Build Process**
   - Must run `npm run build` before deploying
   - Old files in `dist/` can cause issues
   - Always deploy fresh build

---

## 📚 Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Router:** https://reactrouter.com
- **Tailwind CSS:** https://tailwindcss.com
- **Lucide Icons:** https://lucide.dev

---

## 🎯 Summary

**Your codebase is well-structured and production-ready!**

✅ **Strengths:**
- Clean component separation
- Consistent naming conventions
- Good error handling patterns
- Responsive design
- Production deployment setup

⚠️ **Areas for Improvement:**
- Integrate AI scoring (high priority)
- Integrate Slack notifications (high priority)
- Add error boundaries
- Extract custom hooks for reusability

🚀 **Safe to Build:**
- New routes and pages
- UI enhancements
- New utility functions
- New form fields
- Dashboard enhancements

**Follow the checklist above, and you'll build features safely without breaking production!**

---

**Last Updated:** 2025-01-01  
**Maintained By:** Henok131/leadsense

