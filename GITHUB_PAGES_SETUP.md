# 📘 Complete GitHub Pages Setup Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Configuration Files Explained](#configuration-files-explained)
4. [Deployment Steps](#deployment-steps)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying your OHS Audit Tool to GitHub Pages with **automatic deployment** using GitHub Actions. Every push to the main branch will automatically build and deploy your site.

**What You'll Get:**
- ✅ Free hosting on GitHub Pages
- ✅ Automatic deployments on every push
- ✅ HTTPS enabled by default
- ✅ Custom domain support (optional)
- ✅ Fast CDN delivery worldwide

---

## Prerequisites

**Required:**
- GitHub account (free)
- Git installed on your computer
- Node.js 16+ installed
- Basic knowledge of command line/terminal

**Check Your Installations:**
```bash
git --version        # Should show git version
node --version       # Should show v16 or higher
npm --version        # Should show npm version
```

---

## Configuration Files Explained

### 1. `vite.config.js` (Build Configuration)

This file tells Vite how to build your project for GitHub Pages.

```javascript
base: '/ohs-audit-tool/',  // ⚠️ CRITICAL: Must match repository name!
```

**Why is this important?**
- GitHub Pages serves your site at: `username.github.io/repository-name/`
- All your assets (CSS, JS, images) need to load from this path
- If the base path is wrong, your site will show a blank page

**How to set it:**
1. Decide on your repository name (e.g., `my-audit-tool`)
2. Open `vite.config.js`
3. Change the base to: `base: '/my-audit-tool/',`
4. Save the file

### 2. `.github/workflows/deploy.yml` (GitHub Actions)

This file defines the automatic deployment process.

**What it does:**
1. **Trigger**: Runs when you push to the `main` branch
2. **Build**: Installs dependencies and builds your project
3. **Deploy**: Uploads the built files to GitHub Pages

**You don't need to modify this file** - it works automatically!

### 3. `package.json` (Project Configuration)

Updated with deployment script:
```json
"scripts": {
  "deploy": "gh-pages -d dist"  // Manual deployment option
}
```

---

## Deployment Steps

### Step 1: Configure Base Path

**File**: `vite.config.js`

```javascript
// Change this line:
base: '/ohs-audit-tool/',

// To match your repository name:
base: '/your-repo-name/',
```

⚠️ **Important**: 
- Include the leading and trailing slashes: `/repo-name/`
- Use exact repository name (case-sensitive)
- No spaces allowed in repository names

---

### Step 2: Create GitHub Repository

**Option A: Via GitHub Website**

1. Navigate to https://github.com/new
2. Fill in:
   ```
   Repository name: ohs-audit-tool (or your chosen name)
   Description: OHS Management System & Site Audit Tool
   Visibility: ⚪ Public (required for free GitHub Pages)
   ```
3. **Important**: Leave all checkboxes UNCHECKED
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
4. Click "Create repository"

**Option B: Via GitHub CLI (Advanced)**

```bash
gh repo create ohs-audit-tool --public --source=. --remote=origin
```

---

### Step 3: Initialize Git and Push

**First-time setup:**

```bash
# 1. Navigate to your project folder
cd /path/to/ohs-audit-tool

# 2. Initialize git repository
git init

# 3. Add all files to staging
git add .

# 4. Create first commit
git commit -m "Initial commit - OHS Audit Tool ready for deployment"

# 5. Add GitHub as remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 6. Rename branch to main (GitHub standard)
git branch -M main

# 7. Push to GitHub
git push -u origin main
```

**Example with real values:**
```bash
# If your GitHub username is "johndoe" and repo is "ohs-audit-tool"
git remote add origin https://github.com/johndoe/ohs-audit-tool.git
git branch -M main
git push -u origin main
```

**Troubleshooting Authentication:**

If you get authentication errors:

**Option 1: HTTPS with Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Copy the token
5. When pushing, use token as password

**Option 2: SSH (Recommended for regular use)**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then use SSH remote URL:
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

---

### Step 4: Enable GitHub Pages

1. **Navigate to your repository** on GitHub
2. **Click "Settings"** (top navigation bar)
3. **Click "Pages"** (left sidebar, under "Code and automation")
4. **Under "Build and deployment"**:
   - Source: **GitHub Actions** ← Select this!
   - (Not "Deploy from a branch")
5. Click **Save** if prompted

**Visual Reference:**
```
Settings → Pages → Source: [GitHub Actions ▼]
```

---

### Step 5: Monitor First Deployment

1. **Go to "Actions" tab** in your repository
2. You should see a workflow: "Deploy to GitHub Pages"
3. **Status indicators**:
   - 🟡 Yellow circle: Running
   - ✅ Green checkmark: Success!
   - ❌ Red X: Failed (check logs)

**First deployment takes**: 1-3 minutes

**What's happening:**
```
1. Checkout code        ✓
2. Setup Node.js        ✓
3. Install dependencies ✓
4. Build project        ✓
5. Upload to Pages      ✓
6. Deploy               ✓
```

---

### Step 6: Access Your Live Site

**Your site URL:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**Real example:**
- Username: `johndoe`
- Repository: `ohs-audit-tool`
- Live URL: `https://johndoe.github.io/ohs-audit-tool/`

**Finding your URL:**
1. Go to Settings → Pages
2. Look for: "Your site is live at..."
3. Click the link to visit

---

## Verification

### ✅ Checklist: Is Everything Working?

**After deployment, verify:**

- [ ] Site loads without blank page
- [ ] CSS styles are applied correctly
- [ ] Charts render properly (Chart.js working)
- [ ] Navigation tabs work
- [ ] Forms and inputs function
- [ ] Data saves to localStorage
- [ ] All images load (if any)

### 🧪 Test Locally Before Deploying

**Always test production build locally:**

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

Then visit: `http://localhost:4173`

This shows exactly how it will look on GitHub Pages!

---

## Troubleshooting

### Problem 1: Blank Page or 404 Errors

**Symptom**: Site loads but shows blank white page

**Solution**:
```javascript
// Check vite.config.js
base: '/ohs-audit-tool/',  // Must match repo name EXACTLY!
```

**Common mistakes:**
- ❌ `base: '/ohs-audit-tool'` (missing trailing slash)
- ❌ `base: 'ohs-audit-tool/'` (missing leading slash)
- ❌ `base: '/OHS-Audit-Tool/'` (wrong case)
- ✅ `base: '/ohs-audit-tool/'` (correct!)

**After fixing:**
```bash
git add vite.config.js
git commit -m "Fix base path"
git push
```

---

### Problem 2: Assets Not Loading (CSS/JS)

**Symptom**: Page loads but no styling, broken layout

**Diagnosis**: Open browser DevTools (F12) → Console
- Look for 404 errors on CSS/JS files

**Solution**: Same as Problem 1 - check base path

---

### Problem 3: GitHub Actions Workflow Fails

**Symptom**: Red X on Actions tab

**Steps to fix:**

1. **Click the failed workflow** to see logs
2. **Common issues**:

**Error: "npm ci can find no package-lock.json"**
```bash
# Solution: Generate package-lock.json
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

**Error: "Build failed"**
```bash
# Test build locally first:
npm run build

# If it fails locally, fix the errors, then push
```

**Error: "Permission denied"**
- Go to Settings → Actions → General
- Under "Workflow permissions", select:
  - ✅ "Read and write permissions"
- Click Save

---

### Problem 4: Changes Not Showing Up

**Symptom**: Pushed changes but site looks the same

**Solutions:**

1. **Hard refresh browser**:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache**:
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data

3. **Wait for CDN**:
   - GitHub's CDN can take 5-10 minutes to update globally

4. **Check deployment**:
   - Go to Actions tab
   - Ensure latest workflow completed successfully

---

### Problem 5: Site Works Locally But Not on GitHub Pages

**Check these:**

1. **Base path in vite.config.js**
2. **Case sensitivity**: Linux servers are case-sensitive
   - ❌ `import './App.js'` but file is `app.js`
   - ✅ `import './app.js'`
3. **Absolute paths**: Avoid absolute paths
   - ❌ `/assets/logo.png`
   - ✅ `./assets/logo.png` or `../assets/logo.png`

---

## Making Updates After Initial Deployment

### Workflow for Updates:

```bash
# 1. Make your changes in the code

# 2. Test locally
npm run dev          # Test in development
npm run build        # Build for production
npm run preview      # Test production build

# 3. Commit and push
git add .
git commit -m "Add new feature: description"
git push

# 4. Wait 1-2 minutes
# GitHub Actions will automatically build and deploy!
```

### Monitoring Deployments:

- **Actions tab**: See all deployments
- **Environments**: Click "deployments" in right sidebar
- **History**: Settings → Pages → View deployments

---

## Advanced: Manual Deployment

If you prefer manual control instead of automatic deployment:

```bash
# Build locally
npm run build

# Deploy to gh-pages branch
npm run deploy
```

Then configure in GitHub:
- Settings → Pages → Source: **Deploy from a branch**
- Branch: **gh-pages** / **(root)**

---

## Advanced: Custom Domain

To use your own domain (e.g., `audit.mycompany.com`):

### 1. Configure DNS:
```
Type: CNAME
Name: audit (or @ for root)
Value: YOUR_USERNAME.github.io
```

### 2. Update vite.config.js:
```javascript
base: '/',  // Change to root for custom domain
```

### 3. Configure in GitHub:
- Settings → Pages → Custom domain: `audit.mycompany.com`
- Enable HTTPS (automatic after DNS propagates)

### 4. Push changes:
```bash
git add vite.config.js
git commit -m "Configure custom domain"
git push
```

---

## Best Practices

### 🎯 Development Workflow

```bash
# Feature development
git checkout -b feature-name
# ... make changes ...
git commit -m "Add feature"
git push origin feature-name
# Create Pull Request on GitHub
# After review, merge to main
# Automatic deployment happens!
```

### 🔒 Branch Protection (Teams)

For collaborative projects:
1. Settings → Branches → Add rule
2. Branch name: `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks
   - ✅ Include administrators

### 📊 Monitoring

- **Uptime**: GitHub Pages has 99.9% uptime
- **Analytics**: Add Google Analytics if needed
- **Status**: https://www.githubstatus.com/

---

## Quick Reference

### Common Commands:
```bash
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Test production build
npm run deploy           # Manual deploy (if configured)

git add .                # Stage changes
git commit -m "msg"      # Commit changes
git push                 # Push to GitHub (triggers deployment)
git status               # Check status
git log --oneline        # View commit history
```

### Important URLs:
```
Repository: https://github.com/USERNAME/REPO
Live Site: https://USERNAME.github.io/REPO/
Actions: https://github.com/USERNAME/REPO/actions
Settings: https://github.com/USERNAME/REPO/settings/pages
```

---

## Need More Help?

**Resources:**
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

**Check:**
- Actions tab logs for deployment errors
- Browser console (F12) for client-side errors
- Network tab (F12) for failed asset loads

---

**🎉 Congratulations! Your OHS Audit Tool is now live on GitHub Pages!**

Your site will automatically update whenever you push changes to the main branch.
