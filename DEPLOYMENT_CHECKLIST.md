# 📋 LeadSense Deployment Checklist

Use this checklist to ensure a smooth production deployment.

## Pre-Deployment Checklist

### Local Development
- [ ] App runs successfully with `npm run dev`
- [ ] All features tested and working
- [ ] Form submission works
- [ ] Dashboard displays leads correctly
- [ ] Filters and search working
- [ ] CSV export working
- [ ] No console errors

### Environment Setup
- [ ] `.env` file created with all credentials
- [ ] Supabase URL and key configured
- [ ] OpenAI API key configured
- [ ] Slack webhook URL configured
- [ ] Environment variables tested

### Build Verification
- [ ] `npm run build` completes without errors
- [ ] Production build tested with `npm run preview`
- [ ] All assets load correctly
- [ ] No build warnings
- [ ] Bundle size reasonable

### Supabase Configuration
- [ ] Database table created with correct schema
- [ ] Row Level Security (RLS) enabled
- [ ] Insert policy configured
- [ ] Select policy configured
- [ ] Test insert works from Supabase dashboard

### Docker Setup
- [ ] Docker and Docker Compose installed locally
- [ ] `docker-compose.dev.yml` tested locally
- [ ] Development container runs without errors
- [ ] Nginx serves static files correctly
- [ ] SPA routing works in Docker

---

## Server Setup Checklist

### Server Requirements
- [ ] Ubuntu 20.04+ or similar Linux distro
- [ ] Docker installed on server
- [ ] Docker Compose installed
- [ ] SSH access configured
- [ ] Firewall configured (ports 22, 80, 443)

### Domain Configuration
- [ ] Domain name purchased
- [ ] DNS A record pointing to server IP
- [ ] DNS propagation verified
- [ ] `dig lead.asenaytech.com` shows correct IP

### SSL Certificate
- [ ] Certbot installed on server
- [ ] SSL certificate generated
- [ ] Certificates verified at `/etc/letsencrypt/live/lead.asenaytech.com/`
- [ ] Auto-renewal configured in crontab
- [ ] Certificate test passes

### Server Directory Setup
- [ ] `/var/www/lead.asenaytech.com` directory created
- [ ] Proper permissions set
- [ ] `dist/` subdirectory created
- [ ] Backup strategy in place

---

## Deployment Checklist

### Pre-Deployment
- [ ] Deploy script configured with correct server IP
- [ ] Deploy script made executable
- [ ] SSH key authentication set up
- [ ] Server firewall allows necessary ports
- [ ] Backup of current version (if updating)

### Build & Deploy
- [ ] Latest code pulled from git
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables updated in `.env`
- [ ] Production build created (`npm run build`)
- [ ] Build artifacts verified in `dist/` folder
- [ ] Deploy script executed successfully

### Configuration Files
- [ ] `docker-compose.yml` uploaded to server
- [ ] `nginx.conf` uploaded to server
- [ ] Nginx config tested for syntax errors
- [ ] SSL certificate paths verified in nginx.conf
- [ ] Domain name matches in nginx.conf

### Docker Services
- [ ] Old containers stopped
- [ ] New containers started successfully
- [ ] Container logs checked for errors
- [ ] Container restart policy set to `unless-stopped`

---

## Post-Deployment Verification

### Website Access
- [ ] Site accessible via HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate valid and trusted
- [ ] No mixed content warnings
- [ ] Mobile responsive design working

### Landing Page
- [ ] Landing page loads correctly
- [ ] Navigation menu visible
- [ ] Form displays properly
- [ ] All form fields functional
- [ ] Submit button works
- [ ] Success message appears
- [ ] Redirect to dashboard works

### Dashboard
- [ ] Dashboard loads without errors
- [ ] Stats cards display correct data
- [ ] Leads table populates
- [ ] Search functionality works
- [ ] Category filters work
- [ ] Expand row shows message
- [ ] CSV export downloads file
- [ ] Auto-refresh working

### Form Submission
- [ ] Form validates required fields
- [ ] Form submits successfully
- [ ] Lead appears in Supabase database
- [ ] Lead visible in dashboard
- [ ] AI scoring applied
- [ ] Category assigned correctly
- [ ] Slack notification sent (for HOT leads)

### Performance
- [ ] Page load time acceptable (<2s)
- [ ] Images optimized and loading
- [ ] No console errors
- [ ] Gzip compression working
- [ ] Static assets cached properly

### Monitoring
- [ ] Container logs monitored
- [ ] Server resources checked
- [ ] Disk space sufficient
- [ ] Memory usage normal
- [ ] CPU usage normal

---

## Production Checklist

### Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] RLS policies active
- [ ] Environment variables secured
- [ ] No sensitive data in client code
- [ ] CORS configured if needed

### Backup & Recovery
- [ ] Backup script created
- [ ] Automated daily backups configured
- [ ] Backup restoration tested
- [ ] Database backup strategy in place

### Monitoring & Logging
- [ ] Container logs accessible
- [ ] Error logging configured
- [ ] Monitoring tools installed (optional)
- [ ] Uptime monitoring set up (optional)

### Maintenance
- [ ] Update strategy defined
- [ ] Rollback procedure documented
- [ ] SSL renewal automated
- [ ] Docker images kept updated

---

## Troubleshooting Reference

### If Deployment Fails

1. **Check Build Output**
   ```bash
   npm run build
   # Review for warnings/errors
   ```

2. **Check Server Logs**
   ```bash
   ssh root@your.server.ip
   cd /var/www/lead.asenaytech.com
   docker compose logs web
   ```

3. **Verify Container Status**
   ```bash
   docker compose ps
   docker compose ps -a  # Show all containers
   ```

4. **Check Nginx Configuration**
   ```bash
   docker compose exec web nginx -t
   ```

5. **Verify Files Uploaded**
   ```bash
   ls -la /var/www/lead.asenaytech.com/dist/
   ls -la /var/www/lead.asenaytech.com/
   ```

6. **Check SSL Certificates**
   ```bash
   ls -la /etc/letsencrypt/live/lead.asenaytech.com/
   ```

### Common Fixes

- **Port in use**: Kill process on port 80/443
- **SSL errors**: Run `certbot renew`
- **Blank page**: Check nginx config `try_files`
- **404 errors**: Verify SPA routing in nginx
- **Database errors**: Check Supabase RLS policies

---

## Quick Commands

```bash
# Local
npm run dev              # Development server
npm run build            # Production build
npm run docker:dev       # Test Docker locally

# Server
docker compose ps        # Check containers
docker compose logs -f   # View logs
docker compose restart   # Restart services
docker compose down      # Stop services
docker compose up -d     # Start services

# Deploy
./deploy.sh              # Automated deployment
```

---

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Docker Docs](https://docs.docker.com)
- [Nginx Docs](https://nginx.org/en/docs)
- [Certbot Docs](https://certbot.eff.org/docs)

---

**✅ Complete this checklist before going live!**

