# 🚀 LeadSense CRM – Deployment Guide

Complete production deployment setup with Docker, Nginx, and HTTPS.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [Server Setup](#server-setup)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Monitoring](#monitoring)

---

## Prerequisites

### Local Machine
- Node.js 18+ and npm
- Docker and Docker Compose
- SSH access to your server

### Server (VPS)
- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Domain name pointing to server IP
- Ports 80 and 443 open in firewall

---

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

App will be available at `http://localhost:5173`

---

## Production Build

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Test Production Build Locally

```bash
# Using Docker
npm run docker:dev

# Or manually with npx
npx serve -s dist
```

---

## Server Setup

### 1. Connect to Your Server

```bash
ssh root@your.server.ip
```

### 2. Install Docker

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker --version
docker compose version
```

### 3. Create Application Directory

```bash
mkdir -p /var/www/lead.asenaytech.com
cd /var/www/lead.asenaytech.com
```

### 4. Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

---

## SSL Certificate Setup

### Option 1: Automated Setup (Recommended)

```bash
# Install Certbot
apt install certbot -y

# Generate certificate (standalone mode)
certbot certonly --standalone -d lead.asenaytech.com

# Auto-renewal setup
crontab -e
# Add this line:
0 0,12 * * * certbot renew --quiet
```

### Option 2: Manual DNS Validation

```bash
certbot certonly --manual --preferred-challenges dns -d lead.asenaytech.com
```

### Verify Certificates

```bash
ls -la /etc/letsencrypt/live/lead.asenaytech.com/
```

You should see:
- `fullchain.pem` (certificate + chain)
- `privkey.pem` (private key)

---

## Deployment

### Automated Deployment (One-Command)

#### 1. Configure Deployment Script

Edit `deploy.sh` and set your server details:

```bash
SERVER_IP="your.server.ip"
SERVER_USER="root"
APP_PATH="/var/www/lead.asenaytech.com"
```

#### 2. Make Script Executable

```bash
chmod +x deploy.sh
```

#### 3. Deploy

```bash
npm run deploy
```

Or manually:

```bash
./deploy.sh
```

### Manual Deployment

If you prefer manual steps:

```bash
# 1. Build locally
npm run build

# 2. Upload files
scp -r dist/* root@your.server.ip:/var/www/lead.asenaytech.com/dist/
scp docker-compose.yml root@your.server.ip:/var/www/lead.asenaytech.com/
scp nginx.conf root@your.server.ip:/var/www/lead.asenaytech.com/

# 3. SSH into server
ssh root@your.server.ip

# 4. Navigate to app directory
cd /var/www/lead.asenaytech.com

# 5. Start services
docker compose down
docker compose up -d
```

---

## Environment Variables

### Production Environment Setup

Create `.env` file locally with your production variables:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-openai-key
VITE_SLACK_WEBHOOK_URL=your-slack-webhook
```

**Note:** Vite environment variables must be prefixed with `VITE_` and are baked into the build. For sensitive data, consider using a backend API.

### Build with Environment Variables

```bash
# Build with production env
npm run build

# Check that variables are included
grep -r "your-key" dist/
```

---

## Docker Commands

### Development Docker

```bash
# Start development container
npm run docker:dev

# Access: http://localhost:8080
```

### Production Docker

```bash
# Build and start
npm run docker:build
npm run docker:start

# Stop services
npm run docker:stop

# View logs
npm run docker:logs
```

### Manual Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f web

# Restart specific service
docker compose restart web

# Check container status
docker compose ps

# Execute command in container
docker compose exec web sh
```

---

## Supabase Configuration

### Database Schema

Ensure your Supabase `leads` table has the correct schema:

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

-- Enable RLS
alter table leads enable row level security;

-- Allow inserts
create policy "Allow insert" on leads
for insert using (true);

-- Allow selects
create policy "Allow select" on leads
for select using (true);
```

### Row Level Security (RLS)

Make sure RLS policies are configured correctly in Supabase dashboard.

---

## Monitoring

### Check Application Status

```bash
# Docker container status
docker compose ps

# Container logs
docker compose logs -f web

# Nginx logs inside container
docker compose exec web tail -f /var/log/nginx/access.log
docker compose exec web tail -f /var/log/nginx/error.log
```

### Server Resources

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

---

## Troubleshooting

### Common Issues

#### 1. "Connection Refused" Error

```bash
# Check if ports are open
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Check Docker status
docker compose ps

# Check container logs
docker compose logs web
```

#### 2. SSL Certificate Issues

```bash
# Verify certificate exists
ls -la /etc/letsencrypt/live/lead.asenaytech.com/

# Test certificate
openssl x509 -in /etc/letsencrypt/live/lead.asenaytech.com/fullchain.pem -text -noout

# Renew certificate
certbot renew
```

#### 3. Blank Page / SPA Routing Issues

Check that `nginx.conf` has:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

And test:

```bash
curl -I https://lead.asenaytech.com/dashboard
```

#### 4. Form Not Submitting

- Check browser console for errors
- Verify Supabase credentials in `.env`
- Check RLS policies in Supabase dashboard
- View container logs: `docker compose logs web`

#### 5. Docker Compose Errors

```bash
# Stop all containers
docker compose down

# Remove volumes if needed
docker compose down -v

# Rebuild and start
docker compose up -d --build
```

#### 6. "Permission Denied" on deploy.sh

```bash
chmod +x deploy.sh
```

---

## Security Checklist

- [ ] HTTPS enabled and working
- [ ] Domain DNS properly configured
- [ ] SSL certificate auto-renewal set up
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] Supabase RLS policies configured
- [ ] Environment variables secured
- [ ] Server regularly updated
- [ ] Docker images updated
- [ ] Logs monitored for issues

---

## Backup

### Create Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/leadsense"

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/leadsense_$DATE.tar.gz /var/www/lead.asenaytech.com

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "leadsense_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/leadsense_$DATE.tar.gz"
```

### Automated Backups

Add to crontab:

```bash
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## Scaling

### Multiple Containers

Update `docker-compose.yml`:

```yaml
services:
  web:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Load Balancer

Consider using Traefik or Nginx as a reverse proxy for multiple containers.

---

## Updates

### Rolling Update Process

```bash
# 1. Build new version locally
npm run build

# 2. Deploy
./deploy.sh

# 3. Verify
curl -I https://lead.asenaytech.com

# 4. Check logs
docker compose logs -f web
```

---

## Support

For issues or questions:

1. Check container logs: `docker compose logs web`
2. Check browser console for client-side errors
3. Verify Supabase dashboard for database issues
4. Review this deployment guide

---

## Quick Reference

```bash
# Build
npm run build

# Deploy
./deploy.sh

# Check status
docker compose ps

# View logs
docker compose logs -f web

# Restart
docker compose restart web

# Stop
docker compose down
```

