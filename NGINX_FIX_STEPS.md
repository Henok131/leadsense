# 🔧 Step-by-Step Fix for NGINX + Certbot Issue

## Current Problem

1. Your NGINX config is trying to load certificates that don't exist yet
2. NGINX service is not active
3. ACME challenge path needs fixing

## Complete Fix Process

### Step 1: Stop All NGINX Processes

```bash
# Kill any running nginx processes
sudo pkill -f nginx

# Verify nothing is running
ps aux | grep nginx
```

### Step 2: Fix NGINX Config (Remove SSL References)

Edit your site config:

```bash
sudo nano /etc/nginx/sites-available/sales.asenaytech.com
```

**For now, ONLY use this HTTP-only config:**

```nginx
server {
    listen 80;
    server_name sales.asenaytech.com;

    # ACME challenge - use ALIAS not root!
    location /.well-known/acme-challenge/ {
        alias /var/www/certbot/.well-known/acme-challenge/;
    }

    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}
```

**IMPORTANT:** Make sure you remove or comment out any SSL certificate references!

### Step 3: Check Main NGINX Config

```bash
sudo nano /etc/nginx/nginx.conf
```

Verify there are NO certificate references in the main file.

### Step 4: Create Proper Directory Structure

```bash
# Create the full path
sudo mkdir -p /var/www/certbot/.well-known/acme-challenge

# Set correct ownership
sudo chown -R www-data:www-data /var/www/certbot

# Set correct permissions
sudo chmod -R 755 /var/www/certbot
```

### Step 5: Test NGINX Configuration

```bash
# Test syntax
sudo nginx -t
```

This should pass without errors.

### Step 6: Start NGINX

```bash
# Start NGINX
sudo systemctl start nginx

# Check status
sudo systemctl status nginx

# Enable auto-start on boot
sudo systemctl enable nginx
```

### Step 7: Test ACME Challenge Path

```bash
# Create test file
echo "test-acme-123" | sudo tee /var/www/certbot/.well-known/acme-challenge/test123

# Test HTTP request
curl http://sales.asenaytech.com/.well-known/acme-challenge/test123
```

**Expected output:** `test-acme-123`

If this works, proceed to Step 8.

### Step 8: Request Certificate with Certbot

```bash
# Request certificate using webroot method
sudo certbot certonly --webroot \
    -w /var/www/certbot \
    -d sales.asenaytech.com \
    --agree-tos \
    --email your-email@example.com
```

Replace `your-email@example.com` with your actual email.

### Step 9: Verify Certificate

```bash
# Check certificate exists
sudo ls -la /etc/letsencrypt/live/sales.asenaytech.com/

# You should see:
# cert.pem
# chain.pem
# fullchain.pem
# privkey.pem
```

### Step 10: Add HTTPS Block to NGINX

Now edit your NGINX config again:

```bash
sudo nano /etc/nginx/sites-available/sales.asenaytech.com
```

Add the complete configuration:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name sales.asenaytech.com;

    # ACME challenge
    location /.well-known/acme-challenge/ {
        alias /var/www/certbot/.well-known/acme-challenge/;
    }

    # Redirect to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name sales.asenaytech.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/sales.asenaytech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sales.asenaytech.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Root directory
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/x-javascript 
               application/json application/xml+rss;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /index.html;
}
```

### Step 11: Final Test and Reload

```bash
# Test configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

### Step 12: Verify HTTPS Works

```bash
# Test HTTPS
curl -I https://sales.asenaytech.com

# Check in browser
# https://sales.asenaytech.com
```

### Step 13: Configure Auto-Renewal

```bash
# Edit crontab
sudo crontab -e

# Add this line
0 0,12 * * * certbot renew --quiet && systemctl reload nginx
```

---

## Quick Reference Commands

```bash
# Check NGINX syntax
sudo nginx -t

# Start NGINX
sudo systemctl start nginx

# Stop NGINX
sudo systemctl stop nginx

# Reload NGINX (preserves connections)
sudo systemctl reload nginx

# Restart NGINX (closes all connections)
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log

# List Certbot certificates
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## If Something Goes Wrong

### Reset Everything

```bash
# Stop NGINX
sudo systemctl stop nginx

# Remove site symlink
sudo rm /etc/nginx/sites-enabled/sales.asenaytech.com

# Keep only sites-enabled/default temporarily
sudo nginx -t

# Start NGINX
sudo systemctl start nginx

# Then redo the process above
```

### Emergency Access

If NGINX won't start at all:

```bash
# Check what's wrong
sudo nginx -t

# Look at errors in detail
cat /var/log/nginx/error.log
```

---

## Success Indicators

✅ NGINX starts without errors  
✅ `sudo nginx -t` passes  
✅ Test curl returns `test-acme-123`  
✅ Certbot obtains certificate  
✅ HTTPS works in browser  
✅ Auto-renewal configured  

---

**Most Common Issue:** Using `root` instead of `alias` for ACME challenge path!

