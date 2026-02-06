# Fix Vercel 404 Error

Your Vercel deployment is showing 404 because the build configuration isn't correct for the monorepo structure.

## Solution 1: Update Vercel Project Settings (Quickest)

1. **Go to Vercel Dashboard** → Select your project
2. **Go to Settings** → **Build & Development Settings**
3. **Change "Root Directory"** from `.` to `frontend`
4. **Make sure these are set**:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Output Directory**: `build` (auto-filled)
5. **Save** → **Redeploy**

This should fix the 404 error immediately!

## Solution 2: Via Vercel.json (Already Done)

The `vercel.json` file has been updated with correct build commands. 

Just **redeploy** from Vercel's dashboard:
1. Go to Deployments
2. Click on the latest deployment
3. Click "Redeploy"

## Solution 3: Manual Redeploy (If Needed)

Go to Vercel Dashboard → Click "Redeploy" button on the latest failed deployment.

---

## After Fix

Once you redeploy, you should see:
- ✅ Your app loads at `https://asd-project-omega.vercel.app`
- ✅ Assessment form displays
- ✅ You can fill and submit assessments

---

## If Still Getting 404

Check:
1. **Build succeeded**: Go to Deployments → Click latest → Check logs
2. **Root directory**: Should be `frontend`
3. **Output directory**: Should be `build`
4. **No build errors**: Check the build log for npm/package errors

If build contains errors about missing packages:
```bash
npm install --legacy-peer-deps
```

---

## Common Causes of 404

| Issue | Solution |
|-------|----------|
| Root Directory not set | Set to `frontend` in project settings |
| Wrong output directory | Should be `build` (Create React App default) |
| Build failed | Check build logs, may need `--legacy-peer-deps` |
| Missing environment vars | Set `REACT_APP_BACKEND_URL` in project settings |
| Package not found | Run `npm install --legacy-peer-deps` in frontend folder |

