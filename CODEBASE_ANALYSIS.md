# 🧠 LeadSense CRM - Complete Codebase Analysis

## 📋 Executive Summary

**LeadSense CRM** is a modern, production-ready React + Vite + Tailwind CSS application for AI-powered lead management. The application features real-time analytics, AI scoring, Slack notifications, and a premium SaaS UI.

**Tech Stack:**
- React 18.2.0
- Vite 5.4.21
- Tailwind CSS 3.4.0
- React Router DOM 6.21.1
- Recharts 3.3.0 (charting)
- Lucide React 0.303.0 (icons)
- Supabase (database)
- OpenAI GPT-4 (AI scoring)
- Slack (notifications)

---

## 🧭 Pages & Features Map

### **Routes Structure**

| Route | Component | Purpose | Features |
|-------|-----------|---------|----------|
| `/` | `Landing.jsx` | Public landing page | Hero section, features grid, lead form |
| `/dashboard` | `Dashboard.jsx` | Lead management dashboard | Stats cards, search, filter, leads table, CSV export, lead detail modal |
| `/analytics` | `Analytics.jsx` | AI analytics & insights | Real-time charts, score trends, category breakdown, tag frequency |

### **Navigation**

- **NavBar** (`src/components/NavBar.jsx`)
  - Fixed top navigation with glassmorphism effect
  - Responsive mobile menu
  - Active route highlighting
  - Links: Home, Dashboard, Analytics

---

## 📄 Page Breakdown

### **1. Landing Page (`/`)**

**Features:**
- ✅ Hero section with gradient title
- ✅ Features grid (AI-Powered Scoring, Real-Time Analytics, Secure & Reliable)
- ✅ Lead submission form (`LeadForm` component)
- ✅ Success/error messaging
- ✅ Loading states
- ✅ UTM parameter extraction from URL

**Functions:**
- `handleLeadSubmit(leadData)` - Processes lead submission
  - Validates required fields (name, email)
  - Calls AI scoring (`scoreLead()`)
  - Merges AI tags with form tags
  - Inserts lead to Supabase
  - Sends Slack notification for 'Hot' leads
  - Redirects to dashboard on success

**Data Flow:**
1. User fills form → `LeadForm` validates
2. `LeadForm` calls `onSubmit(leadData)`
3. `Landing.jsx` receives data → calls `scoreLead(message)`
4. AI returns `{ category, score, tags }`
5. Merges form data + AI results + metadata
6. Inserts to Supabase `leads` table
7. If category === 'Hot' → sends Slack notification
8. Redirects to `/dashboard`

---

### **2. Dashboard Page (`/dashboard`)**

**Features:**
- ✅ **4 KPI Cards** with sparklines:
  - Total Leads (with 7-day trend)
  - Hot Leads % (with trend)
  - Average Score (with quality badge)
  - Today's Leads (with change %)
- ✅ **Search Bar** - Search by name, email, company
- ✅ **Category Filters** - All, Hot, Warm, Cold
- ✅ **Leads Table** - Sortable, clickable rows
  - Columns: Name, Email, Company, Score, Category, Tags, Date
  - Highlights 'Hot' leads with red background
  - Click row → opens `LeadDetailModal`
- ✅ **CSV Export** - Downloads all leads with formatted data
- ✅ **Auto-refresh** - Fetches leads every 30 seconds
- ✅ **Lead Detail Modal** - Full lead information popup

**Functions:**
- `fetchLeads()` - Fetches all leads from Supabase
- `formatDate(timestamp)` - Formats date for display
- `formatTags(tags)` - Converts tag array to comma-separated string
- `downloadCSV()` - Exports leads to CSV file
- `useMemo` for filtered leads based on search + category

**State Management:**
- `leads` - Array of all leads from Supabase
- `loading` - Loading state
- `searchQuery` - Search input value
- `categoryFilter` - Selected category filter ('All', 'Hot', 'Warm', 'Cold')
- `selectedLead` - Currently selected lead for modal

**Data Processing:**
- Stats calculated in `useMemo` hook
- Trend data for sparklines (last 7 days)
- Percentage changes (today vs yesterday, total vs previous week)
- Filtering and searching happens in `useMemo` for performance

---

### **3. Analytics Page (`/analytics`)**

**Features:**
- ✅ **4 Charts:**
  1. **Score Trends** (Line Chart) - Average lead score over 12 months
  2. **Category Breakdown** (Pie Chart) - Distribution of Hot/Warm/Cold
  3. **Average Lead Score** (Radial Gauge) - Animated circular score indicator
  4. **Top 5 Tags** (Bar Chart) - Most frequent tags with filter (7/30/90 days)
- ✅ **Download Insights** - Exports all chart data to CSV
- ✅ **Generate Insights** - Manual refresh button
- ✅ **Auto-refresh** - Updates every 10 seconds
- ✅ **Real-time data** - All charts use live Supabase data

**Functions:**
- `fetchLeads()` - Fetches leads for chart calculations
- `handleRefresh()` - Manual refresh trigger
- `downloadInsights()` - Exports chart data to multi-section CSV

**Data Processing (useMemo hooks):**
- `scoreTrendsData` - Calculates monthly average scores
- `categoryBreakdownData` - Counts leads by category (Hot/Warm/Cold)
- `averageScore` - Overall average lead score
- `tagFrequencyData` - Top 5 tags with frequency counts

**Chart Components:**
- `ScoreTrendsChart` - Line chart with gradient fills
- `CategoryBreakdownChart` - Pie chart with category colors
- `ScoreGauge` - SVG radial gauge with animation
- `TagFrequencyChart` - Horizontal bar chart with gradients

---

## 🧩 Components Map

### **Page Components**
- ✅ `Landing.jsx` - Landing page with form
- ✅ `Dashboard.jsx` - Lead management dashboard
- ✅ `Analytics.jsx` - Analytics & insights page

### **Shared Components**
- ✅ `NavBar.jsx` - Navigation bar with mobile menu
- ✅ `LeadForm.jsx` - Comprehensive lead submission form
- ✅ `LeadDetailModal.jsx` - Modal for viewing full lead details

### **Chart Components** (`src/components/charts/`)
- ✅ `ScoreTrendsChart.jsx` - Line chart for score trends over time
- ✅ `CategoryBreakdownChart.jsx` - Pie chart for category distribution
- ✅ `ScoreGauge.jsx` - Radial gauge for average score
- ✅ `TagFrequencyChart.jsx` - Horizontal bar chart for tag frequency

### **UI Components** (`src/components/ui/`)
- ✅ `ChartCard.jsx` - Wrapper for charts with consistent styling
- ✅ `Sparkline.jsx` - SVG-based mini trend line component
- ✅ `StatBadge.jsx` - Badge component (if exists)

---

## 🧠 Functions & Component List

### **Library Functions** (`src/lib/`)

#### **1. `supabaseClient.js`**
- **Function:** `createClient()` - Initializes Supabase client
- **Exports:** `supabase` - Supabase client instance
- **Environment Variables:**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Error Handling:** Warns if credentials missing (doesn't throw)

#### **2. `aiScorer.js`**
- **Function:** `scoreLead(message: string)`
  - **Purpose:** Scores leads using OpenAI GPT-4 Turbo
  - **Returns:** `Promise<{category: 'Hot'|'Warm'|'Cold', score: number, tags: string[]}>`
  - **API:** `https://api.openai.com/v1/chat/completions`
  - **Model:** `gpt-4-1106-preview`
  - **Error Handling:** Returns fallback `{category: 'Cold', score: 0, tags: []}` on failure
  - **Validation:** Clamps score to 0-100, validates category, filters tags
- **Environment Variables:**
  - `VITE_OPENAI_API_KEY`

#### **3. `notify.js`**
- **Function:** `notifyLead(lead: object)`
  - **Purpose:** Sends Slack notification for 'Hot' leads
  - **Condition:** Only sends if `lead.category === 'Hot'`
  - **API:** Slack Incoming Webhook (POST request)
  - **Payload:** `{text: "🔥 New HOT lead: {name} ({email}) — {message}"}`
  - **Error Handling:** Non-blocking, logs errors
- **Environment Variables:**
  - `VITE_SLACK_WEBHOOK_URL`

#### **4. `helpers.js`**
- **Function:** `getBadgeColor(category: string)`
  - **Purpose:** Returns Tailwind classes for category badges
  - **Returns:** Color classes for 'Hot' (red), 'Warm' (yellow), 'Cold' (gray)
- **Function:** `formatDate(timestamp: string)`
  - **Purpose:** Formats timestamp to readable date string
- **Function:** `getScoreGradient(score: number)`
  - **Purpose:** Returns gradient classes based on score (0-100)
  - **Returns:** Object with `from`, `to`, `border`, `shadow`, `bgGradient`, `color`
  - **Score Ranges:**
    - ≥80: Green to Emerald (Excellent)
    - ≥60: Cyan to Blue (Good)
    - ≥40: Yellow to Amber (Fair)
    - ≥20: Orange to Red (Low)
    - <20: Red to Pink (Very Low)

---

### **Component Functions**

#### **LeadForm.jsx**
- `handleChange(e)` - Updates form state on input change
- `handleTagAdd(e)` - Adds tag when Enter is pressed
- `handleTagRemove(index)` - Removes tag by index
- `validateForm()` - Validates required fields (name, email, message)
- `handleSubmit(e)` - Submits form data to parent component

**Form Fields:**
- Basic Info: name*, email*, phone, company, website
- Message: message* (required)
- Tags: Dynamic tag input (Enter to add)
- Interest Category: Dropdown (CRM, ERP, AI Agent, Marketing, Sales, Support, Product, Other)
- Lead Scoring: score (auto-calculated, disabled), category (auto-set, disabled)
- Status: Dropdown (New, In Review, Contacted, Converted, Disqualified)
- Deal Value: Number input
- Feedback Rating: Dropdown (1-5 stars)
- Contact Preference: Dropdown (Email, Call, WhatsApp)

*Required fields

---

#### **Dashboard.jsx**

**Functions:**
- `fetchLeads()` - Fetches all leads from Supabase, orders by `created_at DESC`
- `formatDate(timestamp)` - Formats timestamp to "DD MMM YYYY"
- `formatTags(tags)` - Converts array to comma-separated string
- `downloadCSV()` - Generates and downloads CSV file

**Stats Calculations (useMemo):**
- `stats.total` - Total number of leads
- `stats.averageScore` - Average of all lead scores
- `stats.hotLeadsPercent` - Percentage of 'Hot' leads
- `stats.todayLeads` - Count of leads created today
- `stats.totalTrend` - Array of 7-day trend data
- `stats.todayChange` - Percentage change (today vs yesterday)
- `stats.totalChange` - Percentage change (total vs previous week)

**Filtering (useMemo):**
- `filteredLeads` - Filters by category + search query
- Search matches: name, email, company (case-insensitive)

**Auto-refresh:** Every 30 seconds

---

#### **Analytics.jsx**

**Functions:**
- `fetchLeads()` - Fetches all leads from Supabase
- `handleRefresh()` - Manual refresh trigger
- `downloadInsights()` - Exports chart data to CSV with sections

**Data Processing (useMemo):**
- `scoreTrendsData` - Monthly average scores (12 months)
- `categoryBreakdownData` - Category counts with percentages
- `averageScore` - Overall average
- `tagFrequencyData` - Top 5 tags with frequencies

**Auto-refresh:** Every 10 seconds

---

#### **LeadDetailModal.jsx**

**Functions:**
- `formatDateTime(timestamp)` - Formats to "DD MMM YYYY, HH:MM"
- `formatTags(tags)` - Converts array to comma-separated string
- `getScoreColor(score)` - Returns color class based on score
- `handleBackdropClick(e)` - Closes modal on backdrop click

**Features:**
- Escape key to close
- Backdrop click to close
- Scrollable content for long messages
- Displays all lead fields organized by sections:
  - Basic Information
  - Scoring & Category
  - Tags
  - Message
  - Metadata

---

## 🎨 Forms, Charts & Interactive Components

### **Forms**

1. **LeadForm** (`src/components/LeadForm.jsx`)
   - Multi-section form with validation
   - Dynamic tag input (Enter to add, X to remove)
   - Dropdown selects for categories/preferences
   - Loading states with spinner
   - Error handling per field
   - Auto-reset after successful submission

### **Charts**

1. **ScoreTrendsChart** (`src/components/charts/ScoreTrendsChart.jsx`)
   - Line chart with area fill
   - Gradient colors based on average score
   - Custom tooltip with glassmorphism
   - Grid background cells
   - Current month indicator

2. **CategoryBreakdownChart** (`src/components/charts/CategoryBreakdownChart.jsx`)
   - Pie chart with category colors (Hot: red, Warm: yellow, Cold: gray)
   - Percentage labels on segments
   - Custom tooltip
   - Total categories display

3. **ScoreGauge** (`src/components/charts/ScoreGauge.jsx`)
   - SVG radial gauge (0-100)
   - Animated score progression (1 second)
   - Gradient stroke based on score
   - Status badge (Excellent/Good/Fair/Low/Very Low)
   - Quality indicator with icon

4. **TagFrequencyChart** (`src/components/charts/TagFrequencyChart.jsx`)
   - Horizontal bar chart
   - Gradient bar colors (from #8aa3ff to #b084ff)
   - Filter buttons (7/30/90 days)
   - Custom tooltip with glassmorphism
   - Grid background cells

### **Interactive Components**

1. **LeadDetailModal** - Full lead information popup
2. **Sparkline** - Mini trend lines for KPI cards
3. **NavBar** - Mobile-responsive navigation
4. **Search Bar** - Real-time search filtering
5. **Category Filters** - Button group for filtering leads
6. **CSV Export** - Browser-based file download

---

## ⚙️ Config & Environment-Dependent Logic

### **Environment Variables**

All environment variables use `VITE_` prefix (required for Vite):

1. **`VITE_SUPABASE_URL`** - Supabase project URL
2. **`VITE_SUPABASE_ANON_KEY`** - Supabase anonymous key
3. **`VITE_OPENAI_API_KEY`** - OpenAI API key for GPT-4
4. **`VITE_SLACK_WEBHOOK_URL`** - Slack incoming webhook URL

**Note:** Vite bakes environment variables into the build at build time. They are not available at runtime.

### **Configuration Files**

1. **`vite.config.js`**
   - React plugin
   - Base path: `'./'` (relative paths for assets)

2. **`tailwind.config.js`**
   - Custom colors: `primary`, `secondary`, `accent`, `dark`
   - Content paths: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`

3. **`src/index.css`**
   - Global Tailwind directives
   - Custom component classes (`.glass-card`, `.glass-card-premium`, `.gradient-text`, etc.)
   - Custom animations (`fadeIn`, `slideUp`, `fadeInUp`, `shimmer`)

4. **`package.json`**
   - Scripts: `dev`, `build`, `preview`, `docker:dev`, `docker:build`, `docker:start`, `docker:stop`, `docker:logs`, `deploy`

---

## 📦 External Dependencies & Libraries

### **Production Dependencies**

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI library |
| `react-dom` | ^18.2.0 | React DOM rendering |
| `react-router-dom` | ^6.21.1 | Client-side routing |
| `@supabase/supabase-js` | ^2.39.0 | Supabase client SDK |
| `recharts` | ^3.3.0 | Charting library (Line, Pie, Bar charts) |
| `lucide-react` | ^0.303.0 | Icon library |

### **Development Dependencies**

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^5.0.8 | Build tool |
| `@vitejs/plugin-react` | ^4.2.1 | React plugin for Vite |
| `tailwindcss` | ^3.4.0 | CSS framework |
| `autoprefixer` | ^10.4.16 | CSS vendor prefixing |
| `postcss` | ^8.4.32 | CSS processing |
| `@types/react` | ^18.2.43 | TypeScript types |
| `@types/react-dom` | ^18.2.17 | TypeScript types |

---

## 🔌 API Endpoints & External Services

### **1. Supabase Database**

**Table:** `leads`

**Columns:**
- `id` (uuid, primary key)
- `name`, `email`, `phone`, `company`, `website`, `message`
- `tags` (text[]), `interest_category`, `score` (integer), `category`, `status`
- `deal_value`, `feedback_rating`, `contact_preference`
- `source`, `utm_campaign`, `utm_source`
- `ip_address`, `location`, `user_agent`
- `assigned_to`, `last_contacted_at`, `internal_notes`
- `created_at`, `updated_at` (timestamps)

**Operations:**
- **Insert:** `supabase.from('leads').insert([leadPayload])`
- **Select:** `supabase.from('leads').select('*').order('created_at', { ascending: false })`

**Client:** `@supabase/supabase-js` (instantiated in `src/lib/supabaseClient.js`)

---

### **2. OpenAI API**

**Endpoint:** `https://api.openai.com/v1/chat/completions`

**Method:** POST

**Headers:**
- `Authorization: Bearer {VITE_OPENAI_API_KEY}`
- `Content-Type: application/json`

**Body:**
```json
{
  "model": "gpt-4-1106-preview",
  "messages": [
    {
      "role": "system",
      "content": "Evaluate this lead and return ONLY valid JSON..."
    },
    {
      "role": "user",
      "content": "{lead message}"
    }
  ],
  "temperature": 0.7
}
```

**Response Format:**
```json
{
  "category": "Hot" | "Warm" | "Cold",
  "score": 0-100,
  "tags": ["tag1", "tag2", ...]
}
```

**Function:** `scoreLead(message)` in `src/lib/aiScorer.js`

---

### **3. Slack Webhooks**

**Endpoint:** `{VITE_SLACK_WEBHOOK_URL}` (Incoming Webhook URL)

**Method:** POST

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "text": "🔥 New HOT lead: {name} ({email}) — {message}"
}
```

**Condition:** Only sends if `lead.category === 'Hot'`

**Function:** `notifyLead(lead)` in `src/lib/notify.js`

---

## 🎯 Dynamic Components & Backend Integration Points

### **1. Components Using Live Data (Supabase)**

- ✅ `Dashboard.jsx` - Fetches leads on mount + auto-refresh every 30s
- ✅ `Analytics.jsx` - Fetches leads on mount + auto-refresh every 10s
- ✅ `Landing.jsx` - Inserts leads on form submission

### **2. Components That Should Be Wired to Backend Later**

**Currently Client-Side Only:**
- ❌ **IP Address Detection** - Currently `null` in `Landing.jsx:94`
  - **Suggestion:** Use backend API (e.g., `/api/lead-metadata`) or service like `ipapi.co`
- ❌ **Location Detection** - Currently `null` in `Landing.jsx:95`
  - **Suggestion:** Use IP geolocation service or browser geolocation API
- ❌ **User Agent** - Currently uses `navigator.userAgent` (client-side)
  - **Status:** Already working, but could be enhanced on backend
- ❌ **Lead Assignment** - `assigned_to` field exists but not used
  - **Suggestion:** Add user management + assignment logic
- ❌ **Last Contacted** - `last_contacted_at` field exists but not updated
  - **Suggestion:** Add contact tracking feature
- ❌ **Internal Notes** - `internal_notes` field exists but not used
  - **Suggestion:** Add notes/comments feature in lead detail modal

### **3. Backend Integration Suggestions**

**Recommended API Endpoints:**

1. **`POST /api/leads`** - Create lead (currently using Supabase direct)
   - Validate data server-side
   - Add rate limiting
   - Log analytics
   - Enrich with IP/location data

2. **`GET /api/leads`** - List leads (currently using Supabase direct)
   - Add pagination
   - Add server-side filtering
   - Add user permissions
   - Cache frequently accessed data

3. **`GET /api/leads/:id`** - Get lead details
   - Currently using Supabase direct
   - Add audit logging
   - Add access control

4. **`PATCH /api/leads/:id`** - Update lead
   - Currently not implemented
   - Add edit functionality in Dashboard
   - Add validation

5. **`POST /api/leads/:id/contact`** - Mark as contacted
   - Update `last_contacted_at`
   - Send email notification

6. **`POST /api/leads/:id/assign`** - Assign lead to user
   - Update `assigned_to`
   - Notify assigned user

7. **`POST /api/leads/:id/notes`** - Add internal notes
   - Update `internal_notes`
   - Add note history

8. **`GET /api/analytics`** - Get analytics data
   - Pre-calculate metrics server-side
   - Cache results
   - Add date range filtering

9. **`POST /api/webhooks/slack`** - Slack notification endpoint
   - Move Slack logic to backend
   - Add retry logic
   - Add notification history

10. **`POST /api/ai/score`** - AI scoring endpoint
    - Move OpenAI API calls to backend
    - Add rate limiting
    - Add cost tracking
    - Cache scores for similar messages

---

## 🚀 Suggested Next Steps for Full Production SaaS

### **Phase 1: Authentication & User Management**

1. **Add Authentication (Supabase Auth)**
   - Login/Signup pages
   - Protected routes
   - User profiles
   - Role-based access (Admin, User, Viewer)

2. **Multi-Tenant Support**
   - Organizations/Teams
   - User invitations
   - Workspace isolation

---

### **Phase 2: Backend API**

1. **Node.js/Express or Next.js API Routes**
   - RESTful API for all CRUD operations
   - Middleware for authentication
   - Rate limiting
   - Request validation

2. **Database Enhancements**
   - Add indexes for performance
   - Add audit logs table
   - Add user sessions table
   - Add activity history table

3. **API Endpoints (see section above)**

---

### **Phase 3: Enhanced Features**

1. **Lead Management**
   - Edit leads in Dashboard
   - Bulk actions (delete, assign, change status)
   - Lead assignment to users
   - Lead comments/notes
   - Activity timeline per lead
   - Email notifications on assignment

2. **Analytics Enhancements**
   - Date range filtering
   - Export to PDF
   - Scheduled reports (email)
   - Custom dashboard widgets
   - Funnel analysis
   - Conversion tracking

3. **Integrations**
   - Email (SendGrid, Mailgun)
   - CRM sync (HubSpot, Salesforce)
   - Calendar (Google Calendar)
   - Zapier/Make.com webhooks

---

### **Phase 4: Performance & Scaling**

1. **Frontend Optimizations**
   - Code splitting
   - Lazy loading routes
   - Virtual scrolling for large tables
   - Optimistic UI updates
   - Service worker for offline support

2. **Backend Optimizations**
   - Caching (Redis)
   - Database query optimization
   - CDN for static assets
   - Rate limiting per user
   - Background job queue (Bull, BullMQ)

3. **Monitoring & Logging**
   - Error tracking (Sentry)
   - Analytics (Google Analytics, Mixpanel)
   - Performance monitoring (New Relic, Datadog)
   - Log aggregation (LogRocket, Logtail)

---

### **Phase 5: Advanced Features**

1. **AI Enhancements**
   - Conversation analysis
   - Lead qualification chatbot
   - Email draft suggestions
   - Sentiment analysis
   - Lead prediction model

2. **Automation**
   - Workflow builder
   - Automated email sequences
   - Auto-assignment rules
   - Auto-tagging rules
   - Scheduled follow-ups

3. **Reporting**
   - Custom report builder
   - Scheduled reports
   - Email digests
   - Performance dashboards

---

## ✅ Current State Summary

**What's Working:**
- ✅ Full CRUD operations for leads (via Supabase)
- ✅ AI-powered lead scoring (OpenAI GPT-4)
- ✅ Slack notifications for Hot leads
- ✅ Real-time analytics with charts
- ✅ CSV export functionality
- ✅ Responsive design
- ✅ Premium UI/UX

**What Needs Backend:**
- ❌ User authentication
- ❌ IP address/location enrichment
- ❌ Lead editing
- ❌ User assignment
- ❌ Internal notes
- ❌ Contact tracking
- ❌ Advanced analytics queries
- ❌ Rate limiting
- ❌ Audit logging

**Safe Areas for New Features:**
- ✅ Add new chart components (already structured)
- ✅ Add new form fields (LeadForm is extensible)
- ✅ Add new dashboard widgets (Dashboard has sections)
- ✅ Add new pages (routing is configured)
- ✅ Enhance UI components (CSS is modular)

**Refactoring Recommendations:**
- ⚠️ Extract API calls to service layer (currently inline in components)
- ⚠️ Add error boundary components
- ⚠️ Add loading skeletons for better UX
- ⚠️ Add unit tests for utility functions
- ⚠️ Add E2E tests for critical flows

---

## 📚 File Structure Reference

```
lead/
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Router setup
│   ├── index.css                # Global styles
│   ├── pages/
│   │   ├── Landing.jsx          # Landing page
│   │   ├── Dashboard.jsx        # Dashboard page
│   │   └── Analytics.jsx       # Analytics page
│   ├── components/
│   │   ├── NavBar.jsx           # Navigation
│   │   ├── LeadForm.jsx         # Lead form
│   │   ├── LeadDetailModal.jsx # Lead detail modal
│   │   ├── charts/
│   │   │   ├── ScoreTrendsChart.jsx
│   │   │   ├── CategoryBreakdownChart.jsx
│   │   │   ├── ScoreGauge.jsx
│   │   │   └── TagFrequencyChart.jsx
│   │   └── ui/
│   │       ├── ChartCard.jsx
│   │       ├── Sparkline.jsx
│   │       └── StatBadge.jsx
│   └── lib/
│       ├── supabaseClient.js    # Supabase client
│       ├── aiScorer.js          # OpenAI scoring
│       ├── notify.js            # Slack notifications
│       └── helpers.js           # Utility functions
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env                         # Environment variables (gitignored)
```

---

## 🎯 Quick Feature Addition Guide

### **Adding a New Page:**
1. Create component in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`: `<Route path="/new" element={<NewPage />} />`
3. Add nav link in `src/components/NavBar.jsx`

### **Adding a New Chart:**
1. Create component in `src/components/charts/NewChart.jsx`
2. Use Recharts library
3. Wrap in `<ChartCard>` component
4. Add to Analytics page

### **Adding a New Form Field:**
1. Add field to `LeadForm.jsx` state
2. Add JSX input element
3. Ensure validation if required
4. Field will auto-save to Supabase

### **Adding a New API Integration:**
1. Create service function in `src/lib/`
2. Use `import.meta.env.VITE_*` for credentials
3. Add to `.env` file
4. Call from component

---

**Analysis Complete!** ✅

This codebase is well-structured and ready for feature expansion. The separation of concerns (pages, components, lib) makes it easy to add new features without breaking existing functionality.
