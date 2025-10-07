# GitHub Pages Deployment Guide

This guide will help you deploy your OHS Audit Tool to GitHub Pages with automatic deployment.

## 📋 Prerequisites

- A GitHub account
- Git installed on your computer
- Node.js and npm installed

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Configure the Base Path

Before creating your repository, you need to set the correct base path in `vite.config.js`.

1. Open `vite.config.js`
2. Find the line: `base: '/ohs-audit-tool/',`
3. Replace `ohs-audit-tool` with your actual repository name
   - Example: If your repo will be `my-safety-audit`, change it to `base: '/my-safety-audit/',`
4. Save the file

**Important**: The base path must match your repository name exactly!

### Step 2: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: Choose a name (e.g., `ohs-audit-tool`)
   - **Description**: "OHS Management System & Site Audit Tool"
   - **Visibility**: Public (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 3: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these steps:

```bash
# Navigate to your project directory
cd /path/to/your/ohs-audit-tool

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your files
git commit -m "Initial commit - OHS Audit Tool"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" (top right)
3. In the left sidebar, click on "Pages"
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
5. That's it! The GitHub Actions workflow will automatically deploy your site

### Step 5: Wait for Deployment

1. Go to the "Actions" tab in your repository
2. You should see a workflow running called "Deploy to GitHub Pages"
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once complete, your site will be live!

### Step 6: Access Your Deployed Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

For example:
- Username: `johndoe`
- Repository: `ohs-audit-tool`
- URL: `https://johndoe.github.io/ohs-audit-tool/`

## 🔄 Automatic Updates

Once set up, every time you push changes to the `main` branch, GitHub Actions will automatically:
1. Build your project
2. Deploy the new version to GitHub Pages
3. Make it live within 1-2 minutes

### Making Updates

```bash
# Make your changes to the code
# Then commit and push:

git add .
git commit -m "Description of your changes"
git push origin main
```

The site will automatically update!

## 🛠️ Manual Deployment (Alternative Method)

If you prefer to deploy manually instead of automatic deployment:

```bash
# Build the project
npm run build

# Install gh-pages package (one-time)
npm install -D gh-pages

# Add this script to package.json:
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Then in GitHub Settings > Pages, set:
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / root

## 📝 Important Configuration Files

### 1. `vite.config.js`
- Controls the build process
- **base**: Must match your repository name
- Update this if you rename your repository

### 2. `.github/workflows/deploy.yml`
- GitHub Actions workflow
- Automatically builds and deploys on push to main branch
- Runs on Node.js 18

### 3. `package.json`
- Contains build scripts
- `npm run build` creates production files in `dist/` folder

## 🐛 Troubleshooting

### Issue: Site shows blank page or 404 errors

**Solution**: Check that the `base` path in `vite.config.js` matches your repository name exactly.

```javascript
// If your repo is github.com/username/my-audit-tool
base: '/my-audit-tool/',  // Must match repo name!
```

### Issue: GitHub Actions workflow fails

**Solution**: 
1. Check the Actions tab for error messages
2. Ensure GitHub Pages is enabled in Settings > Pages
3. Verify the workflow has proper permissions (should be automatic)

### Issue: Changes not showing up

**Solution**:
1. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Wait a few minutes for GitHub's CDN to update

### Issue: Assets (CSS/JS) not loading

**Solution**: Verify the base path is correct in `vite.config.js`. All asset paths are relative to this base.

## 🔒 Using a Custom Domain (Optional)

If you want to use your own domain instead of github.io:

1. Go to Settings > Pages
2. Under "Custom domain", enter your domain (e.g., `audit.mycompany.com`)
3. Add a CNAME record in your DNS provider:
   - Type: `CNAME`
   - Name: `audit` (or `@` for root domain)
   - Value: `YOUR_USERNAME.github.io`
4. Update `vite.config.js`:
   ```javascript
   base: '/',  // Change to root for custom domain
   ```
5. Commit and push changes

## 📊 Monitoring Deployments

- **Actions Tab**: See all deployment runs and their status
- **Environments**: Check deployment history under Settings > Environments
- **Pages Settings**: View current deployment URL and status

## 🔐 Branch Protection (Recommended for Teams)

If working with a team:

1. Go to Settings > Branches
2. Add a branch protection rule for `main`
3. Enable:
   - "Require pull request reviews before merging"
   - "Require status checks to pass before merging"

This ensures code is reviewed before automatic deployment.

## 📱 Testing Before Deployment

Always test locally before pushing:

```bash
# Development server with hot reload
npm run dev

# Build and preview production version
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build locally.

## 🎯 Quick Reference Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Git commands
git add .
git commit -m "Your message"
git push origin main
```

## 📞 Need Help?

- Check GitHub Actions logs in the "Actions" tab
- Review [GitHub Pages documentation](https://docs.github.com/en/pages)
- Review [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)

---

**Your site will be live at**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

Happy deploying! 🚀
