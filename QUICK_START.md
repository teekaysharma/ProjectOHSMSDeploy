# 🚀 Quick Start - Deploy to GitHub Pages in 5 Minutes

## ⚡ Fast Track Deployment

### 1️⃣ Update Base Path (1 minute)

Open `vite.config.js` and change this line:
```javascript
base: '/YOUR_REPO_NAME/',  // Replace YOUR_REPO_NAME with your actual repository name
```

### 2️⃣ Create GitHub Repository (1 minute)

1. Go to https://github.com/new
2. Enter repository name (same as base path above)
3. Keep it **Public**
4. Click "Create repository"

### 3️⃣ Push Code (2 minutes)

Run these commands in your terminal:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 4️⃣ Enable GitHub Pages (1 minute)

1. Go to your repo → Settings → Pages
2. Under "Source", select **"GitHub Actions"**
3. Done!

### 5️⃣ Access Your Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

Wait 1-2 minutes for the first deployment to complete.

---

## 🔄 Making Updates

After initial setup, just:

```bash
git add .
git commit -m "Updated features"
git push
```

Your site updates automatically! ✨

---

## 📖 Full Documentation

For detailed instructions and troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md)
