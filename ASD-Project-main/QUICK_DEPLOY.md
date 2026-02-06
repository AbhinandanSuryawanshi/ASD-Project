# 🚀 Quick Deployment Guide - Vercel + Render

This guide will help you deploy your ASD Detection System in **10 minutes**.

## ⚡ The Fast Path

### 1️⃣ Deploy Backend on Render (5 minutes)

1. **Go to** https://render.com and sign up (free)
2. **Click** "New +" → "Web Service"
3. **Connect GitHub** and select `ASD-Project` repository
4. **Configure**:
   - **Name**: `asd-detection-backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
   - **Region**: Choose closest to you
5. **Environment Variables** (Add these):
   - `MONGO_URL` = MongoDB connection URL (or leave as default)
   - `DB_NAME` = `asd_db`
6. **Click "Create Web Service"**
7. **Wait** 2-3 minutes for deployment
8. **Copy** the Render URL (e.g., `https://asd-detection-backend.onrender.com`)

### 2️⃣ Deploy Frontend on Vercel (3 minutes)

1. **Go to** https://vercel.com and sign up (free)
2. **Click** "Add New" → "Project"
3. **Import** your GitHub repository
4. **Configure**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
5. **Environment Variables** (Add this):
   - **Key**: `REACT_APP_BACKEND_URL`
   - **Value**: Paste your Render backend URL (e.g., `https://asd-detection-backend.onrender.com`)
6. **Click "Deploy"**
7. **Wait** 1-2 minutes
8. **Get your Frontend URL** (e.g., `https://asd-detection.vercel.app`)

### 3️⃣ Test Your Deployment

1. **Visit** your Vercel frontend URL
2. **Fill** the assessment form
3. **Check** browser DevTools (F12 → Console) for any errors
4. **If errors occur**, check if backend URL is correct in Vercel environment variables

---

## 📋 Manual Configuration (If Needed)

### Update Backend CORS

If frontend and backend are on different domains, update [backend/server.py](backend/server.py):

**Find this line (~line 115):**
```python
allow_origins=["*"],
```

**Replace with:**
```python
allow_origins=[
    "https://your-frontend.vercel.app",
    "http://localhost:3000"  # Keep for local development
],
```

Then commit and push to GitHub for auto-redeploy.

### MongoDB Setup (Optional)

If you want to persist data to the cloud:

1. **Create MongoDB Atlas account**: https://www.mongodb.com/cloud/atlas
2. **Create a free cluster**
3. **Get connection string** from Atlas
4. **Add to Render environment variables**:
   - `MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/asd_db`

---

## ✅ Deployment Checklist

- [ ] GitHub repository is up to date
- [ ] Render backend is deployed and running
- [ ] Vercel frontend is deployed
- [ ] Environment variables are set correctly
- [ ] Frontend can connect to backend (check console)
- [ ] Assessment submission works end-to-end
- [ ] PDF reports can be generated and downloaded

---

## 🔗 Summary of URLs

After deployment, you'll have:

```
Frontend:  https://your-app.vercel.app
Backend:   https://your-app.onrender.com
API:       https://your-app.onrender.com/api
Docs:      https://your-app.onrender.com/docs  (FastAPI Swagger UI)
```

---

## ⚠️ Troubleshooting

### Frontend shows "Failed to connect to backend"
- Check `REACT_APP_BACKEND_URL` in Vercel is correct
- Verify Render backend is actually running
- Open browser console (F12) to see exact error

### Render backend keeps sleeping
- Free tier sleeps after 15 minutes of inactivity
- Upgrade to paid plan to keep it always on
- Or use Railway.app for better free tier

### Assessment submission returns 422 error
- Check all form fields are filled
- Check backend logs in Render dashboard
- Verify backend environment variables are set

### PDF generation fails
- Ensure backend has proper permissions
- Check disk space on Render
- Download time limit via `FileResponse` might need adjustment

---

## 📞 Need Help?

1. **Check logs in Render dashboard** - Most issues are visible there
2. **Check browser console** (F12) - Network errors are shown there
3. **Check Vercel deployment log** - Build errors are listed there
4. **Check GitHub Actions** - If auto-deploy failed
5. **Email backend logs** - Contact Render support with details

---

## 🎉 You're Done!

Your ASD Detection System is now live on the internet! Share the Vercel URL with users.

