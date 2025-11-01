# 🚨 URGENT: NGINX Not Starting + Certbot 404 Fix

## The Problem

Your NGINX config is trying to load SSL certificates that don't exist yet, causing it to fail on start.

## The Solution: Start Fresh

You need to completely remove SSL certificate references from your NGINX config until AFTER you get the certificate.

---

## Step-by-Step Fix (Run These Commands)

### Step 1: Kill All NGINX Processes

```bash
sudo pkill -9 nginx
ps aux | grep nginx  # Should show nothing
```

### Step 2: Edit Your Site Config

```bash
sudo nano /etc/nginx/sites-available/sales.asenaytech.com
```

**Delete EVERYTHING and replace with ONLY this:**

```nginx
server {
    listen 80;
    server_name sales.asenaytech.com;

    # ACME challenge - MUST use alias!
    location /.well-known/acme-challenge/ {
        alias /var/www/certbot/.well-known/acme-challenge/;
    }

    # For now, just return OK instead of redirecting
    # We'll add HTTPS redirect after getting certificate
    location / {
        return 200 "OK - Certificate setup in progress";
        add_header Content-Type text/plain;
    }
}
```

Save and exit: `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 3: Remove Old Symlink and Create New One

```bash
# Remove old symlink if exists
sudo rm -f /etc/nginx/sites-enabled/sales.asenaytech.com

# Create new symlink
sudo ln -s /etc/nginx/sites-available/sales.asenaytech.com /etc/nginx/sites-enabled/

# Remove default site to avoid conflicts
sudo rm -f /etc/nginx/sites-enabled/default
```

### Step 4: Create Directory Structure

```bash
# Create full path with proper permissions
sudo mkdir -p /var/www/certbot/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/certbot
sudo chmod -R 755 /var/www/certbot
```

### Step 5: Test NGINX Config

```bash
sudo nginx -t
```

This MUST pass with "syntax is ok" and "test is successful"

### Step 6: Start NGINX

```bash
sudo systemctl start nginx
sudo systemctl status nginx
```

Should show "active (running)" ✅

### Step 7: Test ACME Challenge Path

```bash
# Create test file
echo "acme-test-123" | sudo tee /var/www/certbot/.well-known/acme-challenge/test

# Test locally
curl http://localhost/.well-known/acme-challenge/test

# Test from internet
curl http://sales.asenaytech.com/.well-known/acme-challenge/test
```

Both should return: `acme-test-123`

### Step 8: If Test Works, Request Certificate

```bash
# Clean any previous failed attempts
sudo certbot delete --cert-name sales.asenaytech.com 2>/dev/null || true

# Request new certificate
sudo certbot certonly --webroot \
    -w /var/www/certbot \
    -d sales.asenaytech.com \
    --email your-email@example.com \
    --agree-tos
```

### Step 9: Add HTTPS Configuration

After certificate is obtained, edit config again:

```bash
sudo nano /etc/nginx/sites-available/sales.asenaytech.com
```

Replace with full configuration:

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

### Step 10: Reload NGINX

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 11: Verify HTTPS

```bash
curl -I https://sales.asenaytech.com
```

Should return HTTP 200

---

## Troubleshooting

### If nginx -t still fails

```bash
# Check what's wrong
sudo nginx -t

# Look at detailed error
sudo cat /var/log/nginx/error.log

# Check if there's a main nginx.conf with SSL references
sudo nano /etc/nginx/nginx.conf
# Look for any "ssl_certificate" lines and comment them out
```

### If curl test returns 404

```bash
# Verify file exists
ls -la /var/www/certbot/.well-known/acme-challenge/test

# Check permissions
sudo chmod 644 /var/www/certbot/.well-known/acme-challenge/test

# Verify NGINX can read it
sudo -u www-data cat /var/www/certbot/.well-known/acme-challenge/test

# Check NGINX error log
sudo tail -f /var/log/nginx/error.log
```

### If Certbot still returns 404

```bash
# Test from command line exactly like Certbot does
curl http://sales.asenaytech.com/.well-known/acme-challenge/test123

# If this doesn't work, NGINX config is still wrong

# Double-check you used alias, not root
sudo grep -A 3 "acme-challenge" /etc/nginx/sites-available/sales.asenaytech.com

# Should show:
# location /.well-known/acme-challenge/ {
#     alias /var/www/certbot/.well-known/acme-challenge/;
# }
```

---

## Key Point

**You CANNOT have any SSL certificate references in NGINX config until AFTER you get the certificate.**

This is the chicken-and-egg problem: NGINX needs the cert to start, but Certbot needs NGINX running to get the cert.

**Solution:** Start with HTTP-only config → Get certificate → Then add HTTPS.

---

## Quick Copy-Paste Sequence

```bash
# Kill NGINX
sudo pkill -9 nginx

# Edit config (use the HTTP-only config above)
sudo nano /etc/nginx/sites-available/sales.asenaytech.com

# Setup directories
sudo mkdir -p /var/www/certbot/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/certbot
sudo chmod -R 755 /var/www/certbot

# Enable site
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/sales.asenaytech.com
sudo ln -s /etc/nginx/sites-available/sales.asenaytech.com /etc/nginx/sites-enabled/

# Test and start
sudo nginx -t
sudo systemctl start nginx
sudo systemctl status nginx

# Test path
echo "test" | sudo tee /var/www/certbot/.well-known/acme-challenge/test
curl http://sales.asenaytech.com/.well-known/acme-challenge/test

# Get certificate
sudo certbot certonly --webroot -w /var/www/certbot -d sales.asenaytech.com --email your@email.com --agree-tos

# Add HTTPS config
sudo nano /etc/nginx/sites-available/sales.asenaytech.com

# Reload
sudo nginx -t && sudo systemctl reload nginx
```

---

## Critical Success Checklist

- [ ] NGINX starts without errors
- [ ] `nginx -t` passes
- [ ] Test curl returns "test" (not 404)
- [ ] Certbot obtains certificate
- [ ] HTTPS works in browser
- [ ] HTTP redirects to HTTPS

Good luck! 🚀

