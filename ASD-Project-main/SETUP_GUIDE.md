# ASD Detection System - Setup & Running Guide

## Project Overview
This is a full-stack application for Autism Spectrum Disorder (ASD) detection using machine learning and behavioral assessments.

### Tech Stack
- **Frontend**: React with TypeScript, Radix UI components, TailwindCSS
- **Backend**: FastAPI (Python), SQLAlchemy, MongoDB
- **ML Model**: Random Forest Classifier with scikit-learn
- **Report Generation**: ReportLab (PDF reports)

---

## Prerequisites

### Windows System Requirements
- Windows 10 or later
- Python 3.11+ installed and in PATH
- Node.js 16+ and npm installed
- MongoDB running locally or accessible via MONGO_URL

### Verify Installations
```powershell
python --version
node --version
npm --version
```

---

## Installation & Setup

### 1. Clone/Setup Project
```powershell
cd f:\ASD-Project-main\ASD-Project-main
```

### 2. Setup Backend
```powershell
cd backend

# Create and activate virtual environment (if not already done)
python -m venv ..\.venv
..\.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p uploads data models reports
```

### 3. Setup Frontend
```powershell
cd ..\frontend

# Install dependencies
npm install --legacy-peer-deps
```

### 4. Configure Environment Variables
Create/verify the `.env` file in the `backend` directory:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=asd_db
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
```

---

## Running the Project

### Quick Start (Single Command)
From the project root:
```powershell
.\start.ps1
```

### Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd f:\ASD-Project-main\ASD-Project-main\backend
F:/ASD-Project-main/ASD-Project-main/.venv/Scripts/python.exe server.py
```

**Terminal 2 - Frontend:**
```powershell
cd f:\ASD-Project-main\ASD-Project-main\frontend
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **API Alternative Docs**: http://localhost:8000/redoc (ReDoc)

---

## Project Structure

```
ASD-Project-main/
├── backend/
│   ├── server.py              # FastAPI main application
│   ├── ml_model.py            # ML model training & prediction
│   ├── report_generator.py    # PDF report generation
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   ├── data/                  # Dataset directory
│   ├── models/                # Trained ML models
│   ├── uploads/               # User-uploaded files
│   └── reports/               # Generated reports
│
├── frontend/
│   ├── package.json           # Node dependencies
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   └── lib/               # Utility functions
│   └── public/                # Static files
│
└── start.ps1                  # Quick start script
```

---

## API Endpoints

### Assessment Endpoints
- `POST /api/assessment` - Create new assessment
- `GET /api/assessment/{id}` - Get assessment by ID
- `GET /api/assessments` - Get all assessments
- `GET /api/assessment/{id}/report` - Download PDF report

### File Management
- `POST /api/upload-image` - Upload assessment image
- `GET /api/file/{filename}` - Download file

### Health Check
- `GET /api/` - API status check
- `GET /health` - System health status

---

## Troubleshooting

### Backend Won't Start
1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod`
   - Or update MONGO_URL in `.env` to your MongoDB instance

2. **Port 8000 Already in Use**
   ```powershell
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```

3. **Module Not Found Errors**
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

### Frontend Won't Start
1. **Port 3000 Already in Use**
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Dependency Issues**
   ```powershell
   cd frontend
   rm -r node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **Clear npm Cache**
   ```powershell
   npm cache clean --force
   ```

### Python Virtual Environment Issues
```powershell
# Recreate venv
cd f:\ASD-Project-main\ASD-Project-main
Remove-Item .venv -Recurse -Force
python -m venv .venv
.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
```

---

## Development Notes

### Backend Features
- Async request handling with FastAPI
- MongoDB integration for data persistence
- ML model auto-training on startup
- PDF report generation
- CORS enabled for frontend communication

### Frontend Features
- Interactive assessment form
- Real-time risk assessment
- PDF report download
- Assessment history tracking
- Responsive design with TailwindCSS

### ML Model
- **Algorithm**: Random Forest Classifier
- **Features**: 15 features (A1-A10 behavioral scores + demographics)
- **Dataset**: Autism research dataset (processed)
- **Auto-training**: Model trains on server startup if not found

---

## Common Tasks

### Clear All Data
```powershell
# Delete generated files
cd f:\ASD-Project-main\ASD-Project-main\backend
Remove-Item models/* -Force
Remove-Item reports/* -Force
Remove-Item uploads/* -Force
Remove-Item data/* -Force
```

### Update Dependencies
```powershell
# Backend
cd backend
pip install -r requirements.txt --upgrade

# Frontend
cd ..\frontend
npm update
```

### View Logs
Backend logs are printed to console. To save to file:
```powershell
F:/ASD-Project-main/ASD-Project-main/.venv/Scripts/python.exe server.py > backend.log 2>&1
```

---

## Performance Tips

1. **Keep Python virtual environment activated** for faster runs
2. **Use `--legacy-peer-deps`** for npm install to avoid long dependency resolution
3. **Enable MongoDB indexing** for faster queries
4. **Use nginx reverse proxy** in production for better performance

---

## Support & Documentation

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **MongoDB Docs**: https://docs.mongodb.com
- **scikit-learn Docs**: https://scikit-learn.org

---

**Last Updated**: January 24, 2026
**Status**: ✅ Production Ready
