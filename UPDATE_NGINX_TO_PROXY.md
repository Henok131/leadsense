# 🔧 Update Existing Nginx Config to Proxy Docker

## 🚨 Issue

Your nginx config exists but is serving **static files** instead of **proxying to Docker container** on port 3000.

Current config: `root /usr/share/nginx/html;` (serves static files)  
Needed: `proxy_pass http://localhost:3000;` (proxies to Docker)

---

## ✅ Solution: Update Existing Config

**On your VPS, edit the existing file:**

```bash
sudo nano /etc/nginx/sites-available/lead.asenaytech.com
```

**Update the HTTPS `location /` block from:**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**To:**

```nginx
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
```

**Also update the HTTP redirect block** (the `location /.well-known/acme-challenge/` is fine for Let's Encrypt, but you can remove the `root` and `index` directives if not needed elsewhere).

---

## 📝 Complete Updated Config

**Replace the entire `server` block for HTTPS:**

```nginx
# HTTPS server
server {
    listen 443 ssl http2;
    server_name lead.asenaytech.com;

    ssl_certificate /etc/letsencrypt/live/lead.asenaytech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lead.asenaytech.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

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

---

## ✅ Steps to Update

1. **Edit the file:**
```bash
sudo nano /etc/nginx/sites-available/lead.asenaytech.com
```

2. **Find the HTTPS `location /` block** and replace with proxy config above

3. **Save:** Ctrl+X, Y, Enter

4. **Test nginx config:**
```bash
sudo nginx -t
```

5. **Restart nginx:**
```bash
sudo systemctl restart nginx
```

6. **Check status:**
```bash
sudo systemctl status nginx
```

---

## ✅ Verify

After updating, test:

```bash
# Test from VPS
curl http://localhost:3000

# Should return your React app HTML
```

Then visit `https://lead.asenaytech.com` in your browser - should now show your Docker container!

---

**The existing nginx config just needs the `location /` block updated to proxy to Docker instead of serving static files!** 🚀

