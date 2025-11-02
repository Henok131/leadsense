# 🔧 Fix Divergent Branches on VPS

## 🚨 Problem

**Error on VPS:**
```
fatal: Need to specify how to reconcile divergent branches.
```

This happens because the local branch on VPS has diverged from the remote (GitHub) after history was rewritten with force push.

---

## ✅ Solution: Force Reset to Remote

**Run this on your VPS:**

```bash
cd /var/www/lead.asenaytech.com && \
git fetch origin && \
git reset --hard origin/main && \
npm install && \
npm run build && \
docker compose down && \
docker compose up -d
```

---

## 🔄 Alternative: Full Reset

If the above doesn't work:

```bash
cd /var/www/lead.asenaytech.com

# Backup current changes (optional)
git stash

# Force reset to remote
git fetch origin
git reset --hard origin/main

# Clean any untracked files (optional)
git clean -fd

# Deploy
npm install
npm run build
docker compose down
docker compose up -d
```

---

## 🎯 One-Line Fix

**Copy and paste this on your VPS:**

```bash
cd /var/www/lead.asenaytech.com && git fetch origin && git reset --hard origin/main && npm install && npm run build && docker compose down && docker compose up -d
```

---

## ✅ Verify

After running, check:

```bash
git log --oneline -5
# Should match GitHub commits

docker ps
# Should show container running
```

---

**This will sync your VPS with the latest GitHub code!** 🚀

