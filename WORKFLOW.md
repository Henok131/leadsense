# 🔄 Development Workflow

## ✅ Agreed Workflow

### Step 1: Push to GitHub (Auto - I handle this)

Whenever we add new features, I will automatically:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

**You don't need to do anything for this step.**

---

### Step 2: Deploy on VPS (You handle this)

After I push to GitHub, SSH into your VPS and run:

```bash
cd /var/www/lead.asenaytech.com && git pull origin main && npm install && npm run build && docker compose down && docker compose up -d
```

**This single command will:**
1. Navigate to project directory
2. Pull latest changes from GitHub
3. Install any new dependencies
4. Build the project
5. Restart Docker containers

---

## 📝 Notes

- **GitHub**: I handle all commits and pushes automatically
- **VPS Deployment**: You run the deployment command when ready
- **Production Path**: `/var/www/lead.asenaytech.com` (production setup)

---

**Going forward, I'll handle all GitHub pushes!** 🚀

