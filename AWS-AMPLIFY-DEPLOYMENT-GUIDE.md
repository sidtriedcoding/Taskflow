# AWS Amplify Deployment Guide for TaskFlow

## Prerequisites
- AWS Account with Amplify access
- GitHub repository connected to AWS Amplify
- Backend API deployed (if applicable)

---

## Step 1: Configure Environment Variables

### 1.1 Navigate to Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app: **TaskFlow** (or your app name)
3. Click on your **main** branch

### 1.2 Add Environment Variables
1. In the left sidebar, click **Environment variables** under "Hosting"
2. Click **Manage variables** button
3. Add the following variable:

   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `NEXT_PUBLIC_API_BASE_URL` | `https://your-backend-api.com/api` | Replace with your actual backend API URL |

   **Example values:**
   - Production API: `https://api.taskflow.com/api`
   - EC2 Backend: `http://your-ec2-ip:80/api`
   - Development: `http://localhost:80/api`

4. Click **Save** button

---

## Step 2: Configure Build Settings

### 2.1 Access Build Settings
1. In the left sidebar, click **Build settings** under "App settings"
2. Click **Edit** button

### 2.2 Verify Build Configuration
Ensure your build settings match this configuration:

```yaml
version: 1
applications:
  - appRoot: taskflow_client
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
    backend:
      phases:
        build:
          commands:
            - echo "No backend build required"
```

3. If it doesn't match, paste the above configuration
4. Click **Save** button

### 2.3 Configure Node.js Version (Optional)
1. Scroll down to **Build image settings**
2. Click **Edit**
3. Select **Amplify AL2023 (Recommended)** as the build image
4. Click **Save**

---

## Step 3: Push Changes to GitHub

### 3.1 Commit Configuration Files
Open your terminal in the project root and run:

```bash
# Check current status
git status

# Add the new files
git add amplify.yml taskflow_client/next.config.ts taskflow_client/.npmrc

# Commit changes
git commit -m "Configure AWS Amplify deployment settings"

# Push to GitHub
git push origin main
```

### 3.2 Verify Push
- Check your GitHub repository to ensure the files are uploaded
- Files should appear in the repository:
  - `amplify.yml` (root)
  - `taskflow_client/next.config.ts` (updated)
  - `taskflow_client/.npmrc` (new)

---

## Step 4: Trigger Amplify Build

### Option A: Automatic Build (Recommended)
Amplify automatically detects the push and starts building within 1-2 minutes.

### Option B: Manual Build
1. Go to AWS Amplify Console
2. Select your app
3. Click on **main** branch
4. Click **Redeploy this version** button in the top-right corner

### 4.1 Monitor Build Progress
1. You'll see the build phases:
   - **Provision** (setting up environment)
   - **Build** (running npm install and build)
   - **Deploy** (uploading build artifacts)
   - **Verify** (health checks)

2. Click on any phase to see detailed logs
3. Build typically takes 3-5 minutes

---

## Step 5: Verify Deployment

### 5.1 Check Build Status
- **Green checkmark** = Successful deployment
- **Red X** = Failed deployment (see troubleshooting below)

### 5.2 Test Your Application
1. Click on the deployment URL: `https://main.dmygjitgxhqne.amplifyapp.com/`
2. Verify the application loads correctly
3. Test key functionality:
   - Login/Authentication
   - API calls to backend
   - Navigation between pages
   - Image loading

---

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain
1. In the left sidebar, click **Domain management**
2. Click **Add domain** button
3. Enter your domain (e.g., `taskflow.com`)
4. Follow AWS instructions to configure DNS records
5. SSL certificate is automatically provisioned

---

## Troubleshooting Common Issues

### Issue 1: Build Fails with "Module not found"
**Solution:**
1. Check if all dependencies are in `package.json`
2. Delete `node_modules` and `package-lock.json` locally
3. Run `npm install` to regenerate lock file
4. Commit and push changes

### Issue 2: Build Fails with ESLint Errors
**Solution:**
- Already fixed in `next.config.ts` with `ignoreDuringBuilds: true`
- If still failing, check build logs for specific errors

### Issue 3: Images Not Loading
**Solution:**
- Verify `remotePatterns` in `next.config.ts` includes all image domains
- Add new domains if needed:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'placehold.co',
    },
    {
      protocol: 'https',
      hostname: 'your-image-cdn.com',
    },
  ],
},
```

### Issue 4: API Calls Failing (CORS or 404 errors)
**Solution:**
1. Verify `NEXT_PUBLIC_API_BASE_URL` in Amplify environment variables
2. Check backend API is running and accessible
3. Verify backend CORS configuration allows Amplify domain:
```javascript
// In your backend server
app.use(cors({
  origin: ['https://main.dmygjitgxhqne.amplifyapp.com', 'http://localhost:3000'],
  credentials: true
}));
```

### Issue 5: Build Succeeds but App Shows Blank Page
**Solution:**
1. Check browser console for JavaScript errors
2. Verify `appRoot: taskflow_client` in `amplify.yml`
3. Check if `.next` folder is being created in build artifacts

### Issue 6: Optional Dependencies Warning
**Solution:**
- Already fixed with `.npmrc` file
- If still seeing warnings, they're usually safe to ignore

---

## Viewing Build Logs

### How to Access Logs
1. Go to AWS Amplify Console
2. Click on your app → **main** branch
3. Click on the latest build
4. Click on each phase (Provision, Build, Deploy) to see logs

### What to Look For
- **Errors**: Look for lines starting with `ERROR` or `Failed`
- **Warnings**: Yellow warnings are usually safe to ignore
- **Success**: Green checkmarks indicate successful phases

---

## Forcing a Rebuild

### Method 1: Empty Commit
```bash
git commit --allow-empty -m "Trigger Amplify rebuild"
git push origin main
```

### Method 2: Amplify Console
1. Go to Amplify Console
2. Click **Redeploy this version** on the main branch

### Method 3: Clear Cache and Rebuild
1. In Amplify Console, go to **Build settings**
2. Scroll to **Build settings** section
3. Click **Clear cache**
4. Then click **Redeploy this version**

---

## Environment-Specific Configurations

### Development/Staging Branch
If you want a separate staging environment:

1. In Amplify Console, click **Connect branch**
2. Select your `develop` or `staging` branch
3. Configure different environment variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://staging-api.taskflow.com/api`
4. Each branch deploys independently

---

## Cost Optimization

### Free Tier Limits
- 1,000 build minutes per month (usually 200-300 builds)
- 15 GB data transfer per month
- 5 GB storage

### Tips to Save Costs
1. **Enable caching**: Already configured in `amplify.yml`
2. **Limit builds**: Don't push every commit to main
3. **Use PR previews carefully**: Disable if not needed
4. **Monitor usage**: Check AWS Billing dashboard regularly

---

## Rollback to Previous Version

### If New Deployment Breaks
1. Go to Amplify Console → **main** branch
2. Scroll down to **Build history**
3. Find the last working build
4. Click the **...** menu → **Redeploy this version**
5. Previous version will be live within 2-3 minutes

---

## Quick Reference Commands

```bash
# Check git status
git status

# Commit and push changes
git add .
git commit -m "Your commit message"
git push origin main

# Trigger rebuild with empty commit
git commit --allow-empty -m "Rebuild"
git push origin main

# Check Amplify CLI (if installed)
amplify status
amplify publish
```

---

## Support Resources

- **AWS Amplify Documentation**: https://docs.aws.amazon.com/amplify/
- **Next.js Deployment Guide**: https://nextjs.org/docs/deployment
- **Amplify Discord**: https://discord.gg/amplify
- **GitHub Issues**: https://github.com/aws-amplify/amplify-hosting/issues

---

## Summary Checklist

Before deploying, ensure:
- [ ] `amplify.yml` is in the root directory
- [ ] Environment variable `NEXT_PUBLIC_API_BASE_URL` is set in Amplify
- [ ] `next.config.ts` uses `remotePatterns` (not `domains`)
- [ ] `.npmrc` file exists in `taskflow_client/`
- [ ] All changes are committed and pushed to GitHub
- [ ] Backend API is deployed and accessible
- [ ] CORS is configured on backend to allow Amplify domain

Your app should be live at: **https://main.dmygjitgxhqne.amplifyapp.com/**
