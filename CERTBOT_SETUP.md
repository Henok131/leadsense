# 🔐 Certbot Setup Guide for NGINX

Complete guide to setting up SSL certificates with Let's Encrypt and Certbot on NGINX.

## Quick Fix for Your Current Issue

Your NGINX config needs to use `alias` instead of `root` for the ACME challenge:

```nginx
location /.well-known/acme-challenge/ {
    alias /var/www/certbot/.well-known/acme-challenge/;
}
```

---

## Complete Setup Process

### Step 1: Install Certbot

```bash
sudo apt update
sudo apt install certbot -y
```

### Step 2: Create Certbot Directory

```bash
# Create the directory structure
sudo mkdir -p /var/www/certbot/.well-known/acme-challenge

# Set proper permissions
sudo chown -R www-data:www-data /var/www/certbot
sudo chmod -R 755 /var/www/certbot
```

### Step 3: Configure NGINX (HTTP Only)

Create/edit your site config:

```bash
sudo nano /etc/nginx/sites-available/sales.asenaytech.com
```

Use this configuration:

```nginx
server {
    listen 80;
    server_name sales.asenaytech.com;

    # ACME challenge - MUST use alias, not root!
    location /.well-known/acme-challenge/ {
        alias /var/www/certbot/.well-known/acme-challenge/;
    }

    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}
```

### Step 4: Enable Site and Test Configuration

```bash
# Create symlink to enable site
sudo ln -sf /etc/nginx/sites-available/sales.asenaytech.com /etc/nginx/sites-enabled/

# Test NGINX configuration
sudo nginx -t

# If test passes, reload NGINX
sudo systemctl reload nginx
```

### Step 5: Test ACME Challenge Path

```bash
# Create test file
echo "test123" | sudo tee /var/www/certbot/.well-known/acme-challenge/test123

# Test HTTP request
curl http://sales.asenaytech.com/.well-known/acme-challenge/test123
```

**Expected output:** `test123`

If you see `test123`, the NGINX config is working correctly! 🎉

### Step 6: Request Certificate with Certbot

Use one of these methods:

#### Method A: Using Certbot Standalone (No NGINX Plugin)

```bash
# Stop NGINX temporarily
sudo systemctl stop nginx

# Request certificate
sudo certbot certonly --standalone -d sales.asenaytech.com

# Start NGINX
sudo systemctl start nginx
```

#### Method B: Using Certbot Webroot (Recommended)

```bash
# Request certificate using webroot method
sudo certbot certonly --webroot \
    -w /var/www/certbot \
    -d sales.asenaytech.com
```

This method doesn't require stopping NGINX!

### Step 7: Verify Certificate

```bash
# Check certificate exists
sudo ls -la /etc/letsencrypt/live/sales.asenaytech.com/

# You should see:
# - cert.pem
# - chain.pem
# - fullchain.pem
# - privkey.pem
```

### Step 8: Update NGINX Config for HTTPS

Now edit your NGINX config again:

```bash
sudo nano /etc/nginx/sites-available/sales.asenaytech.com
```

Add the HTTPS server block:

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

    # SPA routing (for React apps)
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

### Step 9: Test and Reload NGINX

```bash
# Test configuration
sudo nginx -t

# If successful, reload NGINX
sudo systemctl reload nginx
```

### Step 10: Configure Auto-Renewal

```bash
# Edit crontab
sudo crontab -e

# Add this line for automatic renewal
0 0,12 * * * certbot renew --quiet
```

---

## Troubleshooting

### Issue: "Invalid response from http://..."

**Cause:** NGINX can't find the challenge file.

**Solutions:**

1. **Check directory structure:**
   ```bash
   ls -la /var/www/certbot/.well-known/acme-challenge/
   ```

2. **Use `alias` instead of `root`:**
   ```nginx
   location /.well-known/acme-challenge/ {
       alias /var/www/certbot/.well-known/acme-challenge/;  # Use alias!
   }
   ```

3. **Check permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/certbot
   sudo chmod -R 755 /var/www/certbot
   ```

4. **Test manually:**
   ```bash
   echo "test" > /var/www/certbot/.well-known/acme-challenge/test
   curl http://sales.asenaytech.com/.well-known/acme-challenge/test
   ```

### Issue: "Certificate already exists but NGINX points to wrong path"

**Solution:** Remove old config and request fresh certificate:

```bash
# Remove old certificate
sudo certbot delete --cert-name sales.asenaytech.com

# Request new certificate
sudo certbot certonly --webroot -w /var/www/certbot -d sales.asenaytech.com
```

### Issue: "nginx: [emerg] cannot load certificate"

**Solution:** This happens when NGINX config references certificates that don't exist yet.

1. Comment out the HTTPS server block
2. Run Certbot to get certificate
3. Uncomment HTTPS block
4. Reload NGINX

### Debug Commands

```bash
# Check NGINX config syntax
sudo nginx -t

# Check NGINX error logs
sudo tail -f /var/log/nginx/error.log

# Check Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Test HTTP headers
curl -I http://sales.asenaytech.com

# Test HTTPS (after certificate installed)
curl -I https://sales.asenaytech.com

# Check certificate validity
sudo certbot certificates

# Dry run renewal
sudo certbot renew --dry-run
```

---

## Important Notes

### Key Difference: `root` vs `alias`

- **`root`**: Appends the location path to the root directory
  ```nginx
  location /.well-known/acme-challenge/ {
      root /var/www/certbot;
  }
  # File lookup: /var/www/certbot/.well-known/acme-challenge/file
  ```

- **`alias`**: Replaces the location path entirely
  ```nginx
  location /.well-known/acme-challenge/ {
      alias /var/www/certbot/.well-known/acme-challenge/;
  }
  # File lookup: /var/www/certbot/.well-known/acme-challenge/file
  ```

For Certbot webroot method, **use `alias`** to avoid path duplication!

### Directory Structure

Certbot expects this structure for webroot method:

```
/var/www/certbot/.well-known/acme-challenge/
└── [token-files]
```

### SSL Testing

After setup, test your SSL configuration:

- **SSL Labs:** https://www.ssllabs.com/ssltest/
- **Check certificate:** `openssl x509 -in /etc/letsencrypt/live/sales.asenaytech.com/fullchain.pem -text -noout`

---

## Complete Example Config

See `nginx-certbot-example.conf` for a complete working configuration.

---

## Summary

**Quick fix for your issue:**

1. Change `root` to `alias` in ACME challenge location
2. Reload NGINX: `sudo systemctl reload nginx`
3. Test path: `curl http://sales.asenaytech.com/.well-known/acme-challenge/test123`
4. Run Certbot: `sudo certbot certonly --webroot -w /var/www/certbot -d sales.asenaytech.com`

You should now be able to obtain your SSL certificate! 🎉

