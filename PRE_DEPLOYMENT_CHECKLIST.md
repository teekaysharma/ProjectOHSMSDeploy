# ✅ Pre-Deployment Checklist

Before pushing to GitHub, verify everything is configured correctly.

## 📋 Configuration Check

### 1. vite.config.js
- [ ] File exists in root directory
- [ ] `base` path is set to `'/YOUR_REPO_NAME/'`
- [ ] Repository name matches exactly (including case)
- [ ] Has leading and trailing slashes

**Current configuration:**
```javascript
base: '/ohs-audit-tool/',  // ⚠️ Update this!
```

---

### 2. GitHub Actions Workflow
- [ ] `.github/workflows/deploy.yml` exists
- [ ] File is properly formatted
- [ ] Branch set to `main` (or your default branch)

**Location:** `.github/workflows/deploy.yml`

---

### 3. package.json
- [ ] Contains build script: `"build": "vite build"`
- [ ] Contains dev script: `"dev": "vite"`
- [ ] `gh-pages` in devDependencies (for manual deploy option)

---

### 4. .gitignore
- [ ] Excludes `node_modules/`
- [ ] Excludes `dist/`
- [ ] Excludes `.env` files

---

## 🧪 Local Testing

### Build Test
```bash
# Run these commands and verify no errors:
npm install          # ✓ Should complete without errors
npm run build        # ✓ Should create dist/ folder
npm run preview      # ✓ Should start server on port 4173
```

Visit http://localhost:4173 and verify:
- [ ] Page loads completely
- [ ] No console errors (press F12)
- [ ] All features work
- [ ] Charts display correctly
- [ ] Forms and inputs function
- [ ] Tabs navigate properly

---

## 📁 File Structure Verification

Ensure these files exist:

```
✓ /app/
  ✓ .github/
    ✓ workflows/
      ✓ deploy.yml
  ✓ public/
    ✓ css/
    ✓ js/
    ✓ .nojekyll              (prevents Jekyll processing)
  ✓ index.html
  ✓ main.js
  ✓ vite.config.js           (CRITICAL!)
  ✓ package.json
  ✓ .gitignore
  ✓ README.md
  ✓ DEPLOYMENT.md
  ✓ QUICK_START.md
```

---

## 🔍 Quick Validation Script

Run this to check your configuration:

```bash
# Check if critical files exist
echo "Checking configuration files..."

if [ -f "vite.config.js" ]; then
  echo "✓ vite.config.js exists"
  grep -n "base:" vite.config.js
else
  echo "✗ vite.config.js MISSING!"
fi

if [ -f ".github/workflows/deploy.yml" ]; then
  echo "✓ GitHub Actions workflow exists"
else
  echo "✗ GitHub Actions workflow MISSING!"
fi

if [ -f "package.json" ]; then
  echo "✓ package.json exists"
else
  echo "✗ package.json MISSING!"
fi

echo ""
echo "Building project to test..."
npm run build

if [ $? -eq 0 ]; then
  echo "✓ Build successful!"
else
  echo "✗ Build failed - fix errors before deploying"
fi
```

---

## 🚀 Ready to Deploy?

If all checks pass:

### First-Time Deployment:

1. **Create GitHub Repository**
   - Name must match `base` in vite.config.js
   - Must be public
   - Don't initialize with README

2. **Update vite.config.js**
   - Set `base` to your repository name

3. **Commit and Push**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: GitHub Actions

5. **Wait and Verify**
   - Check Actions tab for deployment
   - Visit: https://USERNAME.github.io/REPO/

---

## ⚠️ Common Issues to Avoid

- [ ] Don't forget to update `base` in vite.config.js
- [ ] Don't use private repository (requires GitHub Pro for Pages)
- [ ] Don't initialize repo with README (conflicts with existing files)
- [ ] Don't forget leading/trailing slashes in base path
- [ ] Don't push before testing locally

---

## 📊 Post-Deployment Verification

After deployment completes:

1. **Visit your live site**
2. **Open browser DevTools (F12)**
3. **Check Console tab** - should be no errors
4. **Check Network tab** - all assets should load (200 status)
5. **Test all features** - ensure everything works

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Site loads without blank page
- ✅ No 404 errors in browser console
- ✅ All CSS/JS assets load correctly
- ✅ Charts render properly
- ✅ All interactive features work
- ✅ Data persists in localStorage
- ✅ Navigation works smoothly

---

**Once verified, you're ready to deploy!** 🚀

See [QUICK_START.md](./QUICK_START.md) for fast deployment or [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
