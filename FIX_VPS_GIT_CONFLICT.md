# 🔧 Fix Git Conflict on VPS - package-lock.json

## 🚨 Problem

**Error on VPS:**
```
error: Your local changes to the following files would be overwritten by merge: package-lock.json
Please commit your changes or stash them before you merge. Aborting.
```

---

## ✅ Solution: Reset and Pull

**Run this on your VPS:**

```bash
cd /var/www/lead.asenaytech.com && \
git stash && \
git fetch origin && \
git reset --hard origin/main && \
npm install && \
npm run build && \
docker compose down && \
docker compose up -d
```

---

## 🎯 Complete One-Liner Fix

**Copy and paste this entire command on your VPS:**

```bash
cd /var/www/lead.asenaytech.com && git stash && git fetch origin && git reset --hard origin/main && npm install && npm run build && docker compose down && docker compose up -d
```

---

## ✅ What This Does

1. **`git stash`** - Saves local changes temporarily
2. **`git fetch origin`** - Fetches latest from GitHub
3. **`git reset --hard origin/main`** - Forces local to match remote exactly
4. **`npm install`** - Installs dependencies (creates fresh package-lock.json)
5. **`npm run build`** - Builds the project
6. **`docker compose down`** - Stops containers
7. **`docker compose up -d`** - Starts containers

---

## 🔄 Alternative (If Above Doesn't Work)

```bash
cd /var/www/lead.asenaytech.com

# Backup and remove package-lock.json
mv package-lock.json package-lock.json.backup 2>/dev/null || true

# Force reset to remote
git fetch origin
git reset --hard origin/main

# Install dependencies (will create new package-lock.json)
npm install

# Build and deploy
npm run build
docker compose down
docker compose up -d
```

---

**Run the one-liner fix above to resolve the Git conflict and deploy!** 🚀

