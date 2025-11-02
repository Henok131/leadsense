# 🌐 Fix Domain Connection - Reverse Proxy Issue

## 🚨 Problem

**Docker container is running** on port 3000 ✅  
**But domain `lead.asenaytech.com` still shows ERR_CONNECTION_REFUSED** ❌

This means: **The domain isn't pointing to the Docker container on port 3000**

---

## ✅ Solution: Check Reverse Proxy Configuration

Your domain needs to route to `localhost:3000` (where Docker is running).

### Step 1: Check if Nginx is Running

```bash
systemctl status nginx
# Or
nginx -v
```

### Step 2: Check Nginx Configuration

```bash
# Find nginx config files
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Check for your domain config
cat /etc/nginx/sites-available/lead.asenaytech.com
# Or
cat /etc/nginx/sites-enabled/lead.asenaytech.com
```

### Step 3: Create/Update Nginx Config

**Create nginx config for your domain:**

```bash
sudo nano /etc/nginx/sites-available/lead.asenaytech.com
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name lead.asenaytech.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save:** Ctrl+X, Y, Enter

### Step 4: Enable the Site

```bash
# Create symlink if not exists
sudo ln -s /etc/nginx/sites-available/lead.asenaytech.com /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Step 5: Check Nginx Status

```bash
sudo systemctl status nginx
```

---

## ✅ Alternative: Direct Access Test

**First, test if the container responds on port 3000:**

```bash
# From VPS, test localhost:3000
curl http://localhost:3000

# Or from your local machine, test VPS IP:3000
curl http://<your-vps-ip>:3000
```

If this works, the issue is definitely the reverse proxy/domain configuration.

---

## ✅ Quick Fix: Temporary Test

**Test if container works on IP:port:**

1. Get your VPS IP:
```bash
hostname -I
# Or
curl ifconfig.me
```

2. Try accessing: `http://<your-vps-ip>:3000` in your browser

If this works → Domain/nginx issue  
If this doesn't work → Container issue

---

## ✅ Check Domain DNS

**Verify domain DNS points to your VPS:**

```bash
# Check DNS records
nslookup lead.asenaytech.com
dig lead.asenaytech.com
```

**Should show your VPS IP address**

---

## ✅ Complete Setup Checklist

1. ✅ Docker container running on port 3000
2. ⚠️ Nginx configured to proxy to localhost:3000
3. ⚠️ Nginx enabled and running
4. ⚠️ Domain DNS points to VPS IP
5. ⚠️ Firewall allows ports 80/443

**Check firewall:**

```bash
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # Optional, for direct testing
```

---

## 🎯 Most Likely Fix

**Run these commands on your VPS:**

```bash
# 1. Check if nginx exists
nginx -v 2>/dev/null || echo "Nginx not installed"

# 2. If nginx exists, create/update config
sudo nano /etc/nginx/sites-available/lead.asenaytech.com
# Paste the nginx config above, save

# 3. Enable and restart
sudo ln -sf /etc/nginx/sites-available/lead.asenaytech.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 4. Test
curl http://localhost:3000
```

---

**The container is working - we just need to connect your domain to it!** 🚀

