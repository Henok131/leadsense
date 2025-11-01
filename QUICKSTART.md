# 🚀 LeadSense Quick Start Guide

Get LeadSense up and running in 5 minutes!

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Supabase Account** - [Sign up](https://supabase.com)
3. **OpenAI API Key** - [Get key](https://platform.openai.com)
4. **Slack Webhook** (Optional) - [Create webhook](https://api.slack.com/messaging/webhooks)

---

## Step 1: Install & Configure (2 minutes)

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
notepad .env  # Windows
# or
nano .env     # Linux/Mac
```

Fill in your `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-...
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## Step 2: Set Up Supabase (2 minutes)

### A. Create Database Table

Go to your Supabase dashboard → SQL Editor → Run:

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  company text,
  phone text,
  website text,
  message text,
  tags text[],
  interest_category text,
  score integer,
  category text,
  status text,
  feedback_rating integer,
  deal_value numeric,
  contact_preference text,
  source text default 'form',
  utm_campaign text,
  utm_source text,
  user_agent text,
  ip_address text,
  location text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table leads enable row level security;

create policy "Allow insert" on leads for insert using (true);
create policy "Allow select" on leads for select using (true);
```

### B. Get Your Credentials

Go to Settings → API and copy:
- Project URL → `VITE_SUPABASE_URL`
- anon key → `VITE_SUPABASE_ANON_KEY`

---

## Step 3: Run Locally (1 minute)

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:5173
```

🎉 **You're live!** Try submitting a test lead.

---

## Step 4: Deploy to Production (Optional)

### Quick Deploy with Docker

```bash
# Build production bundle
npm run build

# Start Docker container
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Access at
# http://localhost (port 80)
```

### Full Production Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete server setup with HTTPS.

---

## Test the Application

### Landing Page
1. Go to `http://localhost:5173`
2. Fill out the form
3. Submit a lead
4. See success message

### Dashboard
1. Navigate to Dashboard
2. See your test lead
3. Try filters and search
4. Expand a row to see message
5. Export to CSV

---

## What's Working?

✅ Form submission with validation  
✅ AI-powered lead scoring  
✅ Real-time dashboard  
✅ Search and filtering  
✅ CSV export  
✅ Slack notifications (HOT leads)  
✅ Auto-refresh every 30s  
✅ Responsive design  

---

## Troubleshooting

### Form won't submit?
- Check browser console (F12)
- Verify Supabase credentials in `.env`
- Ensure RLS policies are set

### No leads showing?
- Check Supabase dashboard for data
- Verify RLS allows SELECT
- Refresh the dashboard

### AI scoring not working?
- Check OpenAI API key in `.env`
- Verify API key has credits
- Check browser console for errors

---

## Next Steps

- [ ] Customize design colors
- [ ] Add more form fields
- [ ] Set up Slack notifications
- [ ] Deploy to production
- [ ] Configure custom domain

---

## Need Help?

- 📖 Read [DEPLOYMENT.md](DEPLOYMENT.md)
- 🔧 Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- 🐛 Review [TROUBLESHOOTING](#troubleshooting)

**Happy leading! 🚀**

