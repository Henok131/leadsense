# 🔥 FIX: Node Process Auto-Restarting on Port 3000

## 🚨 Problem Identified

**Node process keeps restarting** after being killed:
- Killed PID `1166628` → New process PID `1167229` starts immediately
- Something is **auto-managing** the Node process (PM2, systemd, supervisor, etc.)

---

## ✅ Solution: Find and Stop the Process Manager

**Run this on your VPS:**

```bash
cd /var/www/lead.asenaytech.com && \
echo "=== Step 1: Kill current Node process ===" && \
sudo kill -9 $(sudo lsof -t -i:3000) 2>/dev/null || true && \
sleep 1 && \
echo "=== Step 2: Check for PM2 ===" && \
pm2 list && \
pm2 stop all && \
pm2 delete all && \
echo "=== Step 3: Check for systemd services ===" && \
systemctl list-units --type=service --state=running | grep -i node && \
systemctl list-units --type=service --state=running | grep -i lead && \
systemctl list-units --type=service --state=running | grep -i asenay && \
echo "=== Step 4: Check for supervisor ===" && \
supervisorctl status 2>/dev/null || echo "Supervisor not running" && \
echo "=== Step 5: Kill ALL node processes ===" && \
pkill -9 node && \
pkill -9 nodejs && \
sleep 3 && \
echo "=== Step 6: Verify port is free ===" && \
lsof -i :3000 || echo "✅ Port 3000 is FREE!" && \
echo "=== Step 7: Start Docker ===" && \
docker compose down --remove-orphans && \
docker compose up -d && \
sleep 3 && \
docker ps
```

---

## ✅ Quick Fix: Stop Everything Node-Related

**Simpler version (run this):**

```bash
cd /var/www/lead.asenaytech.com && \
pm2 stop all 2>/dev/null; pm2 delete all 2>/dev/null; \
pkill -9 node; pkill -9 nodejs; \
sleep 3 && \
docker compose down --remove-orphans && \
docker compose up -d && \
docker ps
```

---

## 🔍 Find What's Running Node

**Check for different process managers:**

```bash
# Check PM2
pm2 list
pm2 stop all

# Check systemd services
systemctl list-units --type=service | grep -i node
systemctl list-units --type=service | grep -i lead
systemctl stop <service-name>

# Check supervisor
supervisorctl status
supervisorctl stop all

# Check for nohup or screen sessions
ps aux | grep node
ps aux | grep -v grep | grep 3000

# Check for Docker containers running Node
docker ps -a | grep node
```

---

## ✅ Nuclear Option: Kill Everything + Restart Docker

```bash
cd /var/www/lead.asenaytech.com && \
pm2 stop all 2>/dev/null; pm2 delete all 2>/dev/null; \
systemctl stop lead* 2>/dev/null; systemctl stop asenay* 2>/dev/null; \
supervisorctl stop all 2>/dev/null; \
pkill -9 node; pkill -9 nodejs; \
sudo fuser -k 3000/tcp 2>/dev/null; \
sleep 5 && \
lsof -i :3000 || echo "✅ Port 3000 is free!" && \
docker compose down --remove-orphans && \
docker compose up -d && \
sleep 3 && \
docker ps
```

---

## 🎯 Most Likely Culprits

1. **PM2** - Most common for Node.js apps
   ```bash
   pm2 list
   pm2 stop all
   pm2 delete all
   ```

2. **systemd service**
   ```bash
   systemctl list-units | grep -i node
   # Then stop: systemctl stop <service-name>
   ```

3. **nohup/screen session**
   ```bash
   ps aux | grep node
   # Find the process, then: kill -9 <PID>
   ```

---

## ✅ Recommended: Stop PM2 First

**If PM2 is installed, stop it first:**

```bash
pm2 list
pm2 stop all
pm2 delete all
```

**Then start Docker:**

```bash
cd /var/www/lead.asenaytech.com
docker compose down --remove-orphans
docker compose up -d
docker ps
```

---

**Run the quick fix command above - it should stop PM2 and allow Docker to start!** 🚀

