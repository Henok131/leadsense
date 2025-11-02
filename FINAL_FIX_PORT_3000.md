# 🔥 FINAL FIX - Port 3000 Blocked (VPS)

## 🚨 Problem

Port 3000 is **still blocked** even after deployment. Container can't start.

---

## ✅ Solution: Kill Port 3000 + Restart Everything

**Run this SINGLE command on your VPS:**

```bash
cd /var/www/lead.asenaytech.com && \
lsof -i :3000 && \
sudo fuser -k 3000/tcp && \
sudo kill -9 $(sudo lsof -t -i:3000) 2>/dev/null || true && \
sleep 3 && \
docker compose down --remove-orphans && \
docker compose up -d && \
sleep 2 && \
docker ps
```

---

## ✅ Alternative: If Above Doesn't Work

### Step 1: Find What's Using Port 3000

```bash
# Show detailed info
lsof -i :3000
netstat -tulpn | grep 3000
ss -tulpn | grep 3000
```

### Step 2: Kill It Manually

```bash
# Find the PID from above
sudo kill -9 <PID>

# Or kill all node processes
pkill -9 node

# Or kill all Docker containers
docker stop $(docker ps -aq)
docker rm -f $(docker ps -aq)
```

### Step 3: Verify Port is Free

```bash
lsof -i :3000
# Should show nothing
```

### Step 4: Start Docker

```bash
cd /var/www/lead.asenaytech.com
docker compose down --remove-orphans
docker compose up -d
```

---

## ✅ Nuclear Option: Restart Docker Service

If nothing works, restart Docker itself:

```bash
# Restart Docker service
sudo systemctl restart docker

# Wait a moment
sleep 5

# Now try again
cd /var/www/lead.asenaytech.com
docker compose down --remove-orphans
docker compose up -d
```

---

## ✅ Alternative Solution: Change Port Again

If port 3000 keeps getting blocked, change to 3001:

**On VPS:**
```bash
cd /var/www/lead.asenaytech.com
nano docker-compose.yml
```

Change:
```yaml
ports:
  - "3000:80"
```

To:
```yaml
ports:
  - "3001:80"
```

Save (Ctrl+X, Y, Enter), then:
```bash
docker compose down
docker compose up -d
```

Access via: `http://your-vps-ip:3001`

---

## 🎯 Complete Fix Command (Try This First)

```bash
cd /var/www/lead.asenaytech.com && \
echo "=== Finding what's using port 3000 ===" && \
lsof -i :3000 && \
echo "=== Killing port 3000 ===" && \
sudo fuser -k 3000/tcp 2>/dev/null || true && \
sudo kill -9 $(sudo lsof -t -i:3000) 2>/dev/null || true && \
pkill -9 node 2>/dev/null || true && \
sleep 3 && \
echo "=== Verifying port is free ===" && \
lsof -i :3000 || echo "Port 3000 is free!" && \
echo "=== Starting Docker ===" && \
docker compose down --remove-orphans && \
docker compose up -d && \
sleep 3 && \
echo "=== Checking container status ===" && \
docker ps
```

---

**Run the fix command above on your VPS - this should resolve the port conflict!** 🚀

