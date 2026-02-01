# ASD Detection System

A comprehensive fullstack application for Autism Spectrum Disorder (ASD) detection using machine learning, featuring a React frontend and FastAPI backend.

## 📋 Table of Contents
- [Features](#-features)
- [Quick Start](#-quick-start)
- [System Requirements](#-system-requirements)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Running the Application](#️-running-the-application)
- [Access the Application](#-access-the-application)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)
- [Development](#️-development)
- [Assessment Scoring](#-assessment-scoring)
- [Security Notes](#-security-notes)
- [Support](#-support)

## ✨ Features

- **Multi-step Assessment Form**: Comprehensive 4-step questionnaire for ASD screening
- **ML-Powered Predictions**: Uses trained Random Forest classifier for accurate ASD risk prediction
- **Assessment History**: View and track all past assessments
- **PDF Report Generation**: Auto-generated detailed reports with recommendations
- **Photo Integration**: Capture and include photos in assessment reports
- **Model Analysis Dashboard**: View model performance metrics, confusion matrices, and ROC curves
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Offline Support**: In-memory caching allows the app to work without MongoDB
- **Real-time Results**: Instant risk level assessment (Low, Moderate, High)

## ⚡ Quick Start

**For experienced developers - quick setup:**

```bash
# 1. Backend setup
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# OR source .venv/bin/activate  # macOS/Linux
pip install --upgrade pip
pip install -r requirements.txt

# 2. Frontend setup
cd ../frontend
npm install --legacy-peer-deps

# 3. Run (in two separate terminals)
# Terminal 1 - Backend:
cd backend
.venv\Scripts\activate  # Windows
python server.py

# Terminal 2 - Frontend:
cd frontend
npm start
```

**Then open**: http://localhost:3000

For detailed instructions, see [Installation](#-installation) section below.

## 💻 System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 2GB free space
- **Internet Connection**: Required for initial setup (downloading dependencies and dataset)

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

### Required Software

1. **Python 3.8 or higher**
   - Download from [python.org](https://www.python.org/downloads/)
   - **Windows**: Check "Add Python to PATH" during installation
   - **macOS**: May need to install Xcode Command Line Tools: `xcode-select --install`
   - **Linux**: Usually pre-installed, or use: `sudo apt-get install python3 python3-pip` (Ubuntu/Debian)

2. **Node.js 14 or higher and npm**
   - Download from [nodejs.org](https://nodejs.org/) (npm comes with Node.js)
   - **macOS/Linux**: Can also use Homebrew: `brew install node`
   - **Windows**: Use the official installer from nodejs.org

3. **Git** (Optional, for cloning repositories)
   - Download from [git-scm.com](https://git-scm.com/downloads)
   - **macOS/Linux**: Usually pre-installed
   - **Windows**: Use the official installer

### Optional Software

4. **MongoDB** (Optional - for persistent data storage)
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - The app works without MongoDB (uses in-memory cache)

### Verify Installations

Open a terminal/command prompt and verify:

**Windows (Command Prompt or PowerShell):**
```cmd
python --version
node --version
npm --version
```

**macOS/Linux:**
```bash
python3 --version
node --version
npm --version
```

**Expected output:**
- Python: `Python 3.8.x` or higher
- Node.js: `v14.x.x` or higher
- npm: `6.x.x` or higher

**Note**: If `python` doesn't work, try `python3` or `py` (Windows).

## 📁 Project Structure

```
ASD-Project-main/
├── backend/                    # FastAPI backend application
│   ├── server.py              # Main FastAPI application
│   ├── ml_model.py            # ML model training and prediction
│   ├── report_generator.py    # PDF report generation
│   ├── requirements.txt       # Python dependencies
│   ├── data/                  # Dataset directory
│   ├── models/                # Trained ML models
│   ├── uploads/               # User-uploaded images
│   └── reports/               # Generated PDF reports
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   └── App.js            # Main app component
│   ├── package.json          # Node dependencies
│   └── public/               # Static assets
└── README.md                 # This file
```

## 🚀 Installation

### Step 1: Clone or Download the Repository

**Option A: Using Git**
```bash
git clone <repository-url>
cd ASD-Project-main
```

**Option B: Download ZIP**
1. Download the project as a ZIP file
2. Extract it to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Setup Backend

#### 2.1 Navigate to Backend Directory
```bash
# Windows (Command Prompt or PowerShell)
cd backend

# macOS/Linux
cd backend
```

#### 2.2 Create Python Virtual Environment

**Windows (Command Prompt):**
```cmd
python -m venv .venv
.venv\Scripts\activate
```

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

> **Note**: If you see "python: command not found", try `python3` instead. On Windows, you may need to use `py` instead of `python`.

#### 2.3 Install Python Dependencies

**Important**: Upgrade pip first, then install dependencies:
```bash
# Upgrade pip
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt
```

**If you encounter FastAPI import errors**, upgrade FastAPI and related packages:
```bash
pip install --upgrade fastapi pydantic pydantic-core
```

**Expected installation time**: 2-5 minutes depending on your internet speed.

#### 2.4 Verify Backend Setup

The backend will automatically:
- Download the dataset on first run (if not present)
- Train the ML model on first run (if not present)
- Create necessary directories (data/, models/, uploads/, reports/)

#### 2.5 Configure Environment (Optional)

Create a `.env` file in the `backend` directory (optional - app works without it):
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=asd_db
CORS_ORIGINS=http://localhost:3000
```

**Note**: MongoDB is optional. The app works in demo mode (in-memory cache) without MongoDB.

### Step 3: Setup Frontend

#### 3.1 Navigate to Frontend Directory
```bash
# From project root
cd frontend
```

#### 3.2 Install Node Dependencies

**Important**: Use `--legacy-peer-deps` flag to avoid dependency conflicts:
```bash
npm install --legacy-peer-deps
```

**Expected installation time**: 3-5 minutes depending on your internet speed.

**Alternative**: If npm install fails, try:
```bash
# Clear npm cache
npm cache clean --force

# Remove existing node_modules
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules  # Windows

# Reinstall
npm install --legacy-peer-deps
```

#### 3.3 Configure API URL (Optional)

Create a `.env` file in the `frontend` directory (optional - defaults to localhost:8000):
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## ▶️ Running the Application

You need to run **two servers simultaneously** - one for the backend and one for the frontend.

### Method 1: Using Two Terminal Windows (Recommended)

#### Terminal/Window 1: Start Backend Server

**Windows (Command Prompt):**
```cmd
cd backend
.venv\Scripts\activate
python server.py
```

**Windows (PowerShell):**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python server.py
```

**macOS/Linux:**
```bash
cd backend
source .venv/bin/activate
python server.py
```

**Alternative (using uvicorn directly):**
```bash
# After activating virtual environment
python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

**Expected output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### Terminal/Window 2: Start Frontend Server

```bash
cd frontend
npm start
```

**Expected output:**
```
Compiling...
Compiled successfully!

You can now view frontend in the browser.
  Local:            http://localhost:3000
```

The browser should automatically open to `http://localhost:3000`. If not, manually navigate to that URL.

### Method 2: Using Start Scripts (Windows)

**Using PowerShell script:**
```powershell
# From project root
.\start.ps1
```

**Using Batch script:**
```cmd
# From project root
start.bat
```

### Method 3: Manual Start (All Platforms)

**Backend:**
```bash
# Navigate to backend
cd backend

# Activate virtual environment
# Windows: .venv\Scripts\activate (CMD) or .\.venv\Scripts\Activate.ps1 (PowerShell)
# macOS/Linux: source .venv/bin/activate

# Start server
python server.py
# OR
python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend (in a new terminal):**
```bash
# Navigate to frontend
cd frontend

# Start development server
npm start
```

## 🌐 Access the Application

Once both servers are running:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **API Documentation (Swagger)**: http://localhost:8000/docs
- **API Documentation (ReDoc)**: http://localhost:8000/redoc
- **Model Analysis Page**: http://localhost:3000/analysis

### Application Pages

- **Home/Landing**: http://localhost:3000/
- **Assessment Form**: http://localhost:3000/assessment
- **Results**: http://localhost:3000/results/{assessment_id}
- **History**: http://localhost:3000/history
- **Model Analysis**: http://localhost:3000/analysis

## 📡 API Endpoints

### Assessment Endpoints

**Create Assessment**
```
POST /api/assess
Content-Type: application/json

{
  "demographic": {
    "name": "John Doe",
    "age": 25,
    "gender": 0,
    "ethnicity": 0,
    "country": "USA",
    "jaundice": 0,
    "family_history": 0,
    "respondent": "Self"
  },
  "behavioral": {
    "a1_score": 1,
    "a2_score": 0,
    "a3_score": 1,
    "a4_score": 0,
    "a5_score": 1,
    "a6_score": 0,
    "a7_score": 1,
    "a8_score": 0,
    "a9_score": 1,
    "a10_score": 0
  },
  "image_filename": "optional_image.jpg"
}
```

**Get All Assessments**
```
GET /api/assessments
```

**Get Single Assessment**
```
GET /api/assessments/{assessment_id}
```

**Generate PDF Report**
```
GET /api/assessments/{assessment_id}/report
```

**Upload Image**
```
POST /api/upload-image
Content-Type: multipart/form-data
```

## 🔧 Troubleshooting

### Port Already in Use

**For Frontend (Port 3000):**

**Windows (Command Prompt/PowerShell):**
```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with the actual Process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process (replace <PID> with the actual Process ID)
kill -9 <PID>
```

**For Backend (Port 8000):**

**Windows:**
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :8000
kill -9 <PID>
```

**Alternative (Kill all Python/Node processes):**

**Windows (PowerShell):**
```powershell
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

**macOS/Linux:**
```bash
pkill -f python
pkill -f node
```

### Python Virtual Environment Issues

**Problem**: Virtual environment not activating or packages not installing

**Solution:**
```bash
# Deactivate current environment (if active)
deactivate

# Remove old environment
# Windows
rmdir /s backend\.venv

# macOS/Linux
rm -rf backend/.venv

# Create fresh environment
cd backend
python -m venv .venv  # or python3 -m venv .venv

# Activate
# Windows (CMD)
.venv\Scripts\activate
# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### FastAPI Import Errors

**Problem**: `ImportError: cannot import name 'CoreSchema' from 'fastapi._compat'`

**Solution:**
```bash
# Activate virtual environment first, then:
pip install --upgrade fastapi pydantic pydantic-core
```

### Node Modules Issues

**Problem**: npm install fails or dependencies conflict

**Solution:**
```bash
cd frontend

# Clear npm cache
npm cache clean --force

# Remove existing modules
# Windows
rmdir /s node_modules
del package-lock.json

# macOS/Linux
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

**If still failing, try:**
```bash
# Use yarn instead (if installed)
yarn install

# Or use npm with different flags
npm install --legacy-peer-deps --force
```

### Backend Server Not Starting

**Problem**: Server crashes on startup or returns 500 errors

**Check:**
1. Virtual environment is activated
2. All dependencies are installed: `pip list | grep fastapi`
3. Python version is 3.8+: `python --version`
4. Port 8000 is not in use (see Port Already in Use section)

**Solution:**
```bash
# Test if server module loads
cd backend
.venv\Scripts\activate  # Windows
# OR
source .venv/bin/activate  # macOS/Linux

python -c "import server; print('OK')"
```

### Frontend Not Compiling

**Problem**: Frontend shows compilation errors

**Check:**
1. Node.js version is 14+: `node --version`
2. All dependencies installed: Check if `node_modules` folder exists
3. No syntax errors in code

**Solution:**
```bash
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json  # macOS/Linux
# OR
rmdir /s node_modules  # Windows
npm install --legacy-peer-deps
```

### Model Analysis Page Shows Network Error

**Problem**: Model analysis page shows "Failed to load model metrics"

**Solution:**
1. Ensure backend server is running on port 8000
2. Test endpoint directly: Open http://localhost:8000/api/model-metrics in browser
3. Check backend console for errors
4. Verify `backend/models/questionnaire_metrics.json` and `backend/models/image_metrics.json` exist
5. Restart backend server if needed

### MongoDB Connection Issues

**Problem**: "MongoDB not available" warning

**Solution:**
- **Option 1 (Recommended for development)**: Ignore the warning. The app works in demo mode with in-memory caching.
- **Option 2**: Install and run MongoDB:
  ```bash
  # Install MongoDB from https://www.mongodb.com/try/download/community
  # Start MongoDB service
  # Windows: MongoDB should start as a service automatically
  # macOS: brew services start mongodb-community
  # Linux: sudo systemctl start mongod
  ```

### Assessment Data Not Persisting

**Problem**: Assessments disappear after server restart

**Solution:**
- Without MongoDB, assessments are only cached in memory during the session
- Install and run MongoDB for persistent storage
- Or use the assessment history feature which works with in-memory cache during active session

### JSON Serialization Errors

**Problem**: Backend returns 500 error with "Out of range float values are not JSON compliant"

**Solution:**
- This should be fixed in the current version
- If you see this error, ensure you have the latest code
- The backend automatically cleans `inf` and `nan` values from JSON responses

### CORS Errors in Browser

**Problem**: Browser console shows CORS errors

**Solution:**
- Backend CORS is configured to allow all origins by default
- If issues persist, check `backend/server.py` CORS configuration
- Ensure frontend is calling the correct backend URL

### Module Not Found Errors

**Problem**: `ModuleNotFoundError` when running server

**Solution:**
```bash
# Ensure virtual environment is activated
# Reinstall all dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

## 🛠️ Development

### Available Scripts

**Backend**
```bash
# Run server
python server.py

# Run with debug logging
python server.py --debug
```

**Frontend**
```bash
# Start development server with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📝 Assessment Scoring

Each question is scored 0-1:
- **0** = No indication of ASD characteristic
- **1** = Indication of ASD characteristic

Risk Levels:
- **Low Risk**: Probability < 30%
- **Moderate Risk**: Probability 30-60%
- **High Risk**: Probability > 60%

## 🔒 Security Notes

- Keep `.env` files with sensitive data out of version control
- Use HTTPS in production
- Implement proper authentication for production deployment
- Don't commit uploaded files to version control

## 📄 License

This project is provided as-is for educational and research purposes.

## 🤝 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review API documentation at http://localhost:8000/docs
3. Check backend logs in the terminal

## 🚀 Deployment

For production deployment, see deployment guides for:
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, AWS, Google Cloud, Azure

---

## 📝 Notes

- The backend automatically downloads the dataset and trains the model on first startup if they don't exist
- All assessments are cached in memory if MongoDB is not running
- The Model Analysis page requires the backend to be running and accessible
- For production deployment, ensure proper security measures are in place

---

**Last Updated**: January 2026  
**Version**: 1.0.0
