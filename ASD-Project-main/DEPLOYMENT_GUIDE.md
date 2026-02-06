# ASD Project Deployment Guide

This guide covers deploying the ASD Detection System on Vercel (Frontend) and a Python-compatible hosting service (Backend).

---

## Part 1: Frontend Deployment on Vercel

### Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub account with the project pushed

### Step 1: Prepare Frontend for Vercel

The frontend is already configured for deployment. The only thing you need is the environment variable pointing to your backend API.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# In the project root, login to Vercel
vercel login

# Deploy
vercel deploy
```

#### Option B: Using GitHub Integration (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Select your GitHub repository (AbhinandanSuryawanshi/ASD-Project)
5. Configure project:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
6. Add Environment Variables (see Step 3)
7. Click "Deploy"

### Step 3: Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

(Replace with your actual backend URL from Step 2)

---

## Part 2: Backend Deployment

Vercel doesn't support Python FastAPI directly. Choose one of these options:

### Option 1: Deploy on Render (Recommended for Free)

1. **Create Render Account**: https://render.com
2. **Connect GitHub**: Link your GitHub account
3. **Create Web Service**:
   - Name: `asd-detection-backend`
   - Runtime: `Python 3.10`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
   - Root Directory: `.` (leave as is)
4. **Add Environment Variables** (optional):
   - `MONGO_URL=mongodb://localhost:27017` (or your MongoDB Atlas URL)
   - `DB_NAME=asd_db`
5. **Deploy** - Render will auto-deploy when you push to GitHub

**Cost**: Free tier available (sleeps after 15 minutes of inactivity)

### Option 2: Deploy on Railway.app

1. **Create Railway Account**: https://railway.app
2. **Connect GitHub** and select your repository
3. **Create Service**:
   - Select "Python"
   - Set Start Command: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
4. **Add Variables** (in Railway dashboard)
5. **Deploy**

**Cost**: Pay-as-you-go ($5 free monthly credits)

### Option 3: Deploy on Heroku

1. **Create Heroku Account**: https://heroku.com (requires credit card even for free tier)
2. **Create `Procfile`** in root directory:
   ```
   web: uvicorn backend.server:app --host 0.0.0.0 --port $PORT
   ```
3. **Install Heroku CLI** and deploy:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

**Cost**: No longer free (paid tiers start at $7/month)

---

## Configuration Updates

### Update Frontend API URL

In Vercel environment variables, set:
```
REACT_APP_BACKEND_URL=https://your-backend-name.onrender.com
```

Or for local development, create `.env.local` in frontend folder:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Update Backend CORS

If deploying frontend and backend on different domains, update CORS in [backend/server.py](backend/server.py):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Database Setup

The app uses MongoDB. You have two options:

### Option 1: Local MongoDB (for testing)
The backend defaults to `mongodb://localhost:27017`

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/asd_db`
4. Set environment variable in your hosting service:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/asd_db
   ```

---

## Testing After Deployment

1. **Test Frontend**: Visit https://your-app-name.vercel.app
2. **Test Backend**: Visit https://your-backend-url/api/ (should return JSON)
3. **Test Full Flow**: Submit an assessment from the frontend

---

## Troubleshooting

### Frontend 404 Errors
- Check if `REACT_APP_BACKEND_URL` is set correctly in Vercel
- Verify backend is running and accessible

### Backend Connection Issues
- Check MongoDB connection string
- Verify CORS settings allow your frontend domain
- Check environment variables are set

### Image Upload Fails
- Ensure backend has write permissions to uploads directory
- For cloud deployments, consider using cloud storage (AWS S3, Cloudinary)

---

## Next Steps

1. Deploy frontend to Vercel first
2. Deploy backend to Render/Railway
3. Update environment variables with correct URLs
4. Test the complete application flow
5. Monitor logs for any errors

---

## Quick Deploy Checklist

- [ ] Git repository updated and pushed
- [ ] Frontend environment variables configured
- [ ] Backend deployed to Render/Railway/Heroku
- [ ] MongoDB connection configured
- [ ] CORS settings updated with frontend URL
- [ ] Tested assessment submission flow
- [ ] Verified PDF report generation works
