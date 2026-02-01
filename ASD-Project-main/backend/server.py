from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, AsyncGenerator, Dict, Any
import uuid
import json
import traceback
from datetime import datetime, timezone
import requests
import shutil
import sys
from contextlib import asynccontextmanager

# Handle imports for both module and direct script execution
try:
    from .ml_model import train_model, predict_asd, MODEL_PATH, SCALER_PATH
    from .report_generator import generate_pdf_report
except ImportError:
    from ml_model import train_model, predict_asd, MODEL_PATH, SCALER_PATH
    from report_generator import generate_pdf_report

# In-memory cache for assessments (for when MongoDB is unavailable)
assessment_cache: Dict[str, dict] = {}

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection - setup with lazy connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = None
db = None

def get_db():
    """Get database connection"""
    global client, db
    if client is None:
        try:
            client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
            db = client[os.environ.get('DB_NAME', 'asd_db')]
            logger.info("MongoDB connected successfully")
        except Exception as e:
            logger.warning(f"MongoDB not available: {e}")
            logger.info("Running in demo mode - data will not be persisted")
            db = None
    return db

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    # Startup event
    logger.info("Starting up ASD Detection System...")
    
    try:
        # Initialize MongoDB connection
        get_db()
    except Exception as e:
        logger.warning(f"Continuing without MongoDB: {e}")
    
    # Download dataset if not exists
    dataset_path = Path(__file__).parent / 'data' / 'Autism_Data_processed.csv'
    dataset_path.parent.mkdir(exist_ok=True)
    if not dataset_path.exists():
        logger.info("Downloading dataset...")
        try:
            url = "https://customer-assets.emergentagent.com/job_3ba65edc-b298-4b96-8b8f-adf22eb53170/artifacts/jl0d9gw3_Autism_Data_processed.csv"
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            with open(dataset_path, 'wb') as f:
                f.write(response.content)
            logger.info("✅ Dataset downloaded successfully")
        except Exception as e:
            logger.warning(f"Could not download dataset: {e}")
    
    # Train model if not exists
    if not MODEL_PATH.exists() or not SCALER_PATH.exists():
        logger.info("Training ML model...")
        try:
            if dataset_path.exists():
                train_model(str(dataset_path))
                logger.info("✅ Model trained successfully")
            else:
                logger.warning("Dataset not available, skipping model training")
        except Exception as e:
            logger.warning(f"Error training model: {e}")
    else:
        logger.info("✅ ML model loaded successfully")
    
    logger.info("=" * 60)
    logger.info("✅ Application startup complete!")
    logger.info("=" * 60)
    logger.info(f"🚀 API available at: http://localhost:8000")
    logger.info(f"📚 API Docs at: http://localhost:8000/docs")
    logger.info("=" * 60)
    
    yield
    
    # Shutdown event
    try:
        if client is not None:
            client.close()
        logger.info("✅ Shutdown complete")
    except Exception as e:
        logger.warning(f"Error during shutdown: {e}")

app = FastAPI(lifespan=lifespan)

# Allow CORS for frontend (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# Directories
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)
DATA_DIR = ROOT_DIR / 'data'
DATA_DIR.mkdir(exist_ok=True)

# Models
class DemographicData(BaseModel):
    name: str
    age: int
    gender: int
    ethnicity: int
    country: str
    jaundice: int
    family_history: int
    respondent: str

class BehavioralData(BaseModel):
    a1_score: int
    a2_score: int
    a3_score: int
    a4_score: int
    a5_score: int
    a6_score: int
    a7_score: int
    a8_score: int
    a9_score: int
    a10_score: int

class AssessmentRequest(BaseModel):
    demographic: DemographicData
    behavioral: BehavioralData
    image_filename: Optional[str] = None

class AssessmentResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    demographic: dict
    behavioral: dict
    image_filename: Optional[str] = None
    prediction: int
    probability: float
    confidence: float
    risk_level: str
# API endpoints
@api_router.get("/")
async def root():
    return {"message": "ASD Detection System API"}

@api_router.get("/model-metrics-test")
async def get_model_metrics_test():
    """Test endpoint to verify route works"""
    return {"test": "success", "questionnaire": None, "image": None}

@api_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image for the assessment"""
    try:
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOADS_DIR / unique_filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {"filename": unique_filename, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/assess", response_model=AssessmentResult)
async def create_assessment(request: AssessmentRequest):
    """Create a new assessment and predict ASD risk"""
    try:
        # Prepare features for prediction
        features = {
            'a1_score': request.behavioral.a1_score,
            'a2_score': request.behavioral.a2_score,
            'a3_score': request.behavioral.a3_score,
            'a4_score': request.behavioral.a4_score,
            'a5_score': request.behavioral.a5_score,
            'a6_score': request.behavioral.a6_score,
            'a7_score': request.behavioral.a7_score,
            'a8_score': request.behavioral.a8_score,
            'a9_score': request.behavioral.a9_score,
            'a10_score': request.behavioral.a10_score,
            'age': request.demographic.age,
            'gender': request.demographic.gender,
            'ethnicity': request.demographic.ethnicity,
            'jaundice': request.demographic.jaundice,
            'austim': request.demographic.family_history
        }
        
        # Get prediction
        prediction_result = predict_asd(features)
        
        # Determine risk level
        probability = prediction_result['probability']
        if probability < 0.3:
            risk_level = "Low"
        elif probability < 0.6:
            risk_level = "Moderate"
        else:
            risk_level = "High"
        
        # Create result object
        result = AssessmentResult(
            demographic=request.demographic.model_dump(),
            behavioral=request.behavioral.model_dump(),
            image_filename=request.image_filename,
            prediction=prediction_result['prediction'],
            probability=prediction_result['probability'],
            confidence=prediction_result['confidence'],
            risk_level=risk_level
        )
        
        # Cache the assessment in memory
        assessment_cache[result.id] = result.model_dump()
        
        # Save to database (if available)
        try:
            database = get_db()
            if database is not None:
                doc = result.model_dump()
                doc['timestamp'] = doc['timestamp'].isoformat()
                await database.assessments.insert_one(doc)
                logger.info(f"✅ Assessment saved to MongoDB: {result.id}")
            else:
                logger.info(f"⚠️  Assessment created (MongoDB unavailable): {result.id}")
        except Exception as db_error:
            logger.warning(f"Could not save to database: {db_error}")
        
        # Always cache in memory for quick retrieval
        assessment_cache[result.id] = result.model_dump()
        logger.info(f"✅ Assessment cached in memory: {result.id}")
        
        return result
    except Exception as e:
        logger.error(f"Error in assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

MODELS_DIR = ROOT_DIR / 'models'
QUESTIONNAIRE_METRICS_PATH = MODELS_DIR / 'questionnaire_metrics.json'
IMAGE_METRICS_PATH = MODELS_DIR / 'image_metrics.json'

def _load_metrics_json(path: Path) -> Optional[Dict[str, Any]]:
    """Load metrics from JSON file if it exists."""
    if not path.exists():
        return None
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        logger.warning(f"Could not load metrics from {path}: {e}")
        return None

def _clean_json_data(obj):
    """Recursively clean data to replace inf/nan values with None for JSON serialization"""
    import math
    
    if obj is None:
        return None
    elif isinstance(obj, dict):
        return {k: _clean_json_data(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_clean_json_data(item) for item in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, (int, str, bool)):
        return obj
    else:
        # Convert any other type to string
        return str(obj)

@api_router.get("/model-metrics")
async def get_model_metrics():
    """Get model performance metrics for questionnaire and image modules (F1, confusion matrix, etc.) for graphical representation."""
    try:
        # Load metrics files
        questionnaire = _load_metrics_json(QUESTIONNAIRE_METRICS_PATH)
        image = _load_metrics_json(IMAGE_METRICS_PATH)
        
        # Clean data to remove inf/nan values that aren't JSON compliant
        questionnaire_clean = _clean_json_data(questionnaire) if questionnaire else None
        image_clean = _clean_json_data(image) if image else None
        
        # Return response
        result = {
            "questionnaire": questionnaire_clean,
            "image": image_clean,
        }
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_model_metrics: {type(e).__name__}: {e}", exc_info=True)
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error loading model metrics: {str(e)}")

@api_router.get("/assessments", response_model=List[AssessmentResult])
async def get_assessments():
    """Get all assessments"""
    # Start with cached assessments
    assessments = list(assessment_cache.values())
    
    # Try to fetch from database if available
    database = get_db()
    if database is not None:
        try:
            db_assessments = await database.assessments.find({}, {"_id": 0}).to_list(1000)
            # Convert timestamp strings to datetime objects
            for assessment in db_assessments:
                if isinstance(assessment['timestamp'], str):
                    assessment['timestamp'] = datetime.fromisoformat(assessment['timestamp'])
            
            # Merge with cache, preferring database entries (more complete)
            assessment_ids_in_cache = {a['id'] for a in assessments}
            for db_assessment in db_assessments:
                if db_assessment['id'] not in assessment_ids_in_cache:
                    assessments.append(db_assessment)
        except Exception as e:
            logger.warning(f"Error retrieving assessments from database: {e}")
    
    # Sort by timestamp (newest first)
    assessments.sort(key=lambda x: x['timestamp'] if isinstance(x['timestamp'], datetime) else datetime.fromisoformat(x['timestamp']), reverse=True)
    
    return assessments

@api_router.get("/assessments/{assessment_id}", response_model=AssessmentResult)
async def get_assessment(assessment_id: str):
    """Get a specific assessment by ID"""
    # Check cache first (fast retrieval)
    if assessment_id in assessment_cache:
        logger.info(f"✅ Retrieved assessment from cache: {assessment_id}")
        return assessment_cache[assessment_id]
    
    # Try database if available
    database = get_db()
    if database is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    try:
        assessment = await database.assessments.find_one({"id": assessment_id}, {"_id": 0})
        
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        if isinstance(assessment['timestamp'], str):
            assessment['timestamp'] = datetime.fromisoformat(assessment['timestamp'])
        
        # Cache it for future requests
        assessment_cache[assessment_id] = assessment
        return assessment
    except Exception as e:
        logger.error(f"Error retrieving assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return assessment

@api_router.get("/assessments/{assessment_id}/report")
async def download_report(assessment_id: str):
    """Generate and download PDF report for an assessment"""
    try:
        assessment = None
        
        # Check cache first (fast retrieval)
        if assessment_id in assessment_cache:
            assessment = assessment_cache[assessment_id]
            logger.info(f"✅ Retrieved assessment from cache for report: {assessment_id}")
        else:
            # Try database if available
            database = get_db()
            if database is not None:
                try:
                    assessment = await database.assessments.find_one({"id": assessment_id}, {"_id": 0})
                    if assessment:
                        logger.info(f"✅ Retrieved assessment from database for report: {assessment_id}")
                except Exception as db_error:
                    logger.warning(f"Could not retrieve from database: {db_error}")
        
        # If not found in cache or database, return error
        if assessment is None:
            logger.warning(f"Assessment not found: {assessment_id}")
            raise HTTPException(status_code=404, detail=f"Assessment {assessment_id} not found")
        
        # Ensure assessment has all required fields for PDF generation
        assessment_for_pdf = {
            "id": assessment.get("id", assessment_id),
            "demographic": assessment.get("demographic", {}),
            "behavioral": assessment.get("behavioral", {}),
            "risk_level": assessment.get("risk_level", "Unknown"),
            "probability": assessment.get("probability", 0.0),
            "confidence": assessment.get("confidence", 0.0),
            "timestamp": assessment.get("timestamp", datetime.now(timezone.utc).isoformat())
        }
        
        # Validate demographic data
        if not assessment_for_pdf["demographic"]:
            assessment_for_pdf["demographic"] = {
                "age": 0, 
                "gender": 0, 
                "ethnicity": 0, 
                "country": "Unknown", 
                "jaundice": 0, 
                "family_history": 0, 
                "respondent": "Unknown"
            }
        
        # Validate behavioral data
        if not assessment_for_pdf["behavioral"]:
            assessment_for_pdf["behavioral"] = {
                f"a{i}_score": 0 for i in range(1, 11)
            }
        
        logger.info(f"Generating PDF report for assessment: {assessment_id}")
        
        # Generate PDF report
        report_path = generate_pdf_report(assessment_id, assessment_for_pdf)
        
        if not Path(report_path).exists():
            logger.error(f"PDF file was not created: {report_path}")
            raise HTTPException(status_code=500, detail="Failed to generate PDF report")
        
        logger.info(f"✅ PDF report generated successfully: {report_path}")
        
        # Return file
        return FileResponse(
            report_path,
            media_type="application/pdf",
            filename=f"ASD_Assessment_Report_{assessment_id}.pdf"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error generating report: {type(e).__name__}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)