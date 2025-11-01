# 🚀 Quick Deployment Guide for Updates

## ⚡ Simple 3-Step Process (After You Push to GitHub)

---

## **STEP 1: PUSH TO GITHUB (You Do This Locally)**

```bash
# 1. Make your changes in code
# 2. Commit and push
git add .
git commit -m "Add new feature X"
git push origin main
```

That's it for GitHub! ✅

---

## **STEP 2: SSH INTO YOUR VPS**

```bash
ssh root@YOUR_VPS_IP
```

---

## **STEP 3: DEPLOY ON VPS (Copy & Paste These Commands)**

```bash
# Navigate to project directory
cd /var/www/lead.asenaytech.com

# Pull latest code from GitHub
git pull origin main

# Install any new dependencies (if package.json changed)
npm install

# Build the app (Vite bakes .env values into build)
npm run build

# Restart Docker containers
docker compose down && docker compose up -d

# Done! ✅
```

---

## 📋 **Complete Command Sequence (Copy All At Once)**

```bash
cd /var/www/lead.asenaytech.com && \
git pull origin main && \
npm install && \
npm run build && \
docker compose down && \
docker compose up -d
```

---

## ✅ **Verify It Worked**

```bash
# Check Docker is running
docker compose ps

# Check logs (if needed)
docker compose logs -f
```

Visit: https://lead.asenaytech.com

---

## 🎯 **For Single Feature Updates**

Same process! Just push your changes and run the VPS commands above.

---

## ⚠️ **Important Notes**

1. **.env file**: Only needs to be created once on VPS. Don't delete it!
2. **New packages**: If you add new npm packages, `npm install` will handle them automatically.
3. **Build time**: Takes ~10-15 seconds. Normal!
4. **No downtime**: `docker compose down && up -d` restarts containers instantly.

---

## 🔄 **Quick Reference**

**Every time you update:**
1. ✅ Push to GitHub (local)
2. ✅ SSH to VPS
3. ✅ Run the 3-step commands above

That's it! 🎉

