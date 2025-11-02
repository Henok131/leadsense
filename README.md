# 🚀 LeadSense CRM

A modern, AI-powered lead management system built with React, Vite, Tailwind CSS, and Supabase.

## ✨ Features

- 🤖 **AI-Powered Lead Scoring** - Automatically score leads using OpenAI GPT-4
- 📊 **Real-Time Dashboard** - Track and analyze your leads with beautiful charts
- 🔔 **Slack Notifications** - Get instant alerts for HOT leads
- 💾 **Supabase Integration** - Secure cloud database with real-time updates
- 🎨 **Beautiful UI** - Glass morphism design with custom gradient theme
- 🔍 **Advanced Filtering** - Search, filter by category, and export to CSV
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Supabase** - PostgreSQL database + Auth
- **OpenAI** - GPT-4 for lead scoring
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Docker** - Containerization
- **Nginx** - Web server with HTTPS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for deployment)
- Supabase account
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd asenay-leadsense

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_OPENAI_API_KEY=your_openai_key
# VITE_SLACK_WEBHOOK_URL=your_slack_webhook_url
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Development

```bash
# Build and start development container
npm run docker:dev

# Access at http://localhost:8080
```

## 📋 Supabase Setup

### 1. Create Database Table

Run this SQL in your Supabase SQL Editor:

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

-- Enable Row Level Security
alter table leads enable row level security;

-- Create policies
create policy "Allow insert" on leads for insert using (true);
create policy "Allow select" on leads for select using (true);
```

### 2. Get Your Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy your `Project URL` and `anon public` key
4. Add them to your `.env` file

## 🚢 Deployment

### Production Deployment with Docker + Nginx

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete deployment guide.

### Quick Deploy

```bash
# Make deploy script executable (Linux/Mac)
chmod +x deploy.sh

# Deploy to production
./deploy.sh
```

### Manual Deployment

```bash
# Build
npm run build

# Start Docker containers
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## 📁 Project Structure

```
asenay-leadsense/
├── src/
│   ├── components/
│   │   ├── LeadForm.jsx    # Lead submission form
│   │   └── NavBar.jsx      # Navigation bar
│   ├── pages/
│   │   ├── Landing.jsx     # Landing page with form
│   │   └── Dashboard.jsx   # Leads dashboard
│   ├── lib/
│   │   ├── supabaseClient.js  # Supabase connection
│   │   ├── aiScorer.js        # OpenAI integration
│   │   ├── notify.js          # Slack notifications
│   │   └── helpers.js         # Utility functions
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── docker-compose.yml     # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── nginx.conf             # Production Nginx config
├── nginx-dev.conf         # Development Nginx config
├── deploy.sh              # Automated deployment script
├── .env.example           # Environment variables template
└── package.json           # Dependencies
```

## 🎨 Design System

### Colors

- **Background**: `#0b1020`
- **Primary**: `#78c8ff`
- **Secondary**: `#8aa3ff`
- **Accent**: `#b084ff`
- **Text**: White with glass morphism effects

### Components

- **Glass Cards**: `bg-white/10 backdrop-blur-md border border-white/20`
- **Gradient Text**: `bg-gradient-to-r from-primary via-secondary to-accent`
- **Gradient Buttons**: Multi-color gradient with glow effect

## 📊 Dashboard Features

- ✅ Auto-refresh every 30 seconds
- ✅ Filter by category (All/Hot/Warm/Cold)
- ✅ Search by name, email, or company
- ✅ Export to CSV
- ✅ Expand rows to view messages
- ✅ Real-time statistics
- ✅ Responsive design

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Docker commands
npm run docker:dev   # Start dev container
npm run docker:build # Build containers
npm run docker:start # Start containers
npm run docker:stop  # Stop containers
npm run docker:logs  # View logs

# Deployment
npm run deploy       # Deploy to production
```

## 🧪 Testing

```bash
# Run local development server
npm run dev

# Test production build locally
npm run build
npm run preview

# Test Docker setup
npm run docker:dev
```

## 🔐 Security

- ✅ Row Level Security (RLS) enabled in Supabase
- ✅ HTTPS with Let's Encrypt certificates
- ✅ Security headers configured
- ✅ Environment variables for sensitive data
- ✅ Input validation and sanitization

## 🐛 Troubleshooting

### Common Issues

1. **Form not submitting**
   - Check browser console for errors
   - Verify Supabase credentials in `.env`
   - Ensure RLS policies are configured

2. **Blank page after deployment**
   - Verify Nginx config has `try_files` directive
   - Check Docker container logs
   - Ensure `dist/` folder exists

3. **SSL certificate issues**
   - Run `certbot renew` on server
   - Check certificate permissions
   - Verify domain DNS settings

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed troubleshooting.

## 📚 Additional Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [DASHBOARD_FEATURES.md](DASHBOARD_FEATURES.md) - Dashboard feature list
- [FORM_SUBMISSION_FIXES.md](FORM_SUBMISSION_FIXES.md) - Form submission details
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Supabase configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- Supabase for the amazing database platform
- OpenAI for AI capabilities
- Tailwind CSS for beautiful styling
- React team for the awesome framework

---

**Built with ❤️ by Asenay Tech**
