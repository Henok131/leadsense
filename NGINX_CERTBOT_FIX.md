# 🔧 Fix for NGINX + Certbot ACME Challenge Issue

## Problem

When Certbot tries to validate the domain via ACME challenge, it gets a 404 error even though the file exists.

## Root Cause

The NGINX `location /.well-known/acme-challenge/` block is using `root /var/www/certbot`, which makes NGINX look for files at `/var/www/certbot/.well-known/acme-challenge/`, but Certbot typically uses a different directory structure.

## Solution

Use `alias` instead of `root` for the ACME challenge location, or adjust the directory structure.

### Option 1: Use `alias` (Recommended)

Update your NGINX config to use `alias`:

```nginx
location /.well-known/acme-challenge/ {
    alias /var/www/certbot/.well-known/acme-challenge/;
}
```

### Option 2: Adjust Directory Structure

If you prefer to use `root`, ensure the directory structure matches:

```bash
# Certbot uses /var/www/certbot as root, then appends .well-known/acme-challenge
# So the file should be at: /var/www/certbot/.well-known/acme-challenge/token-file

sudo mkdir -p /var/www/certbot/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/certbot
```

Then your NGINX config using `root` will work.

