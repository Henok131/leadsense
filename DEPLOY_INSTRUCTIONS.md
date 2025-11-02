# 🚀 Deploy LeadSense to Production

You're seeing the default NGINX page because your React app hasn't been deployed yet!

## Current Status

✅ NGINX is running with HTTPS  
✅ SSL certificate is working  
❌ React app not deployed  

## Next Steps

### 1. First, finish fixing NGINX config

Make sure you have the complete HTTPS config in `/etc/nginx/sites-available/lead.asenaytech.com`

### 2. Deploy your React app

From your local LeadSense project:

```bash
# Build the production bundle
npm run build

# Create the deploy directory on server
ssh root@your.server.ip "mkdir -p /usr/share/nginx/html"

# Upload your built files
scp -r dist/* root@your.server.ip:/usr/share/nginx/html/

# Restart NGINX
ssh root@your.server.ip "sudo systemctl reload nginx"
```

### 3. Or use the deploy.sh script

Update `deploy.sh` with your server IP, then:

```bash
./deploy.sh
```

## What You Should See

After deploying, you should see your LeadSense landing page, not the "Welcome to nginx!" page!

