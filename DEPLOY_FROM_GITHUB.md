# Deploy LeadSense from GitHub to VPS - Clean Process

## Your Setup
- **VPS:** srv1057930 (72.61.156.126)
- **GitHub:** Henok131/leadsense

---

## Step 1: SSH to Your VPS

Open terminal and connect:

```bash
ssh root@72.61.156.126
```

---

## Step 2: Navigate and Pull Latest Code

```bash
cd /var/www/lead.asenaytech.com

# Pull latest from GitHub
git pull origin main
```

---

## Step 3: Install Dependencies (if needed)

```bash
npm install
```

---

## Step 4: Rebuild the Production Bundle

```bash
# Clean old build
rm -rf dist

# Build new version with your .env credentials
npm run build

# Verify dist was created
ls -la dist/
```

---

## Step 5: Restart Docker Containers

```bash
docker compose down
docker compose up -d

# Check status
docker compose ps
```

---

## Step 6: Verify Deployment

```bash
# View logs
docker compose logs web

# Check container is serving files
docker exec leadsense-web ls -la /usr/share/nginx/html/
```

---

## Step 7: Clear Browser Cache

On your computer:
1. Press `Ctrl + Shift + Delete`
2. Select "All time"
3. Check "Cached images and files"
4. Click "Clear data"
5. Visit: https://lead.asenaytech.com
6. Press `Ctrl + F5` (hard refresh)

---

## That's It!

Your site should now be live with all the new features.

