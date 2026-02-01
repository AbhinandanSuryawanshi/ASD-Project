import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os
from pathlib import Path

MODELS_DIR = Path(__file__).parent / 'models'
MODELS_DIR.mkdir(exist_ok=True)

MODEL_PATH = MODELS_DIR / 'asd_classifier.pkl'
SCALER_PATH = MODELS_DIR / 'scaler.pkl'

def train_model(csv_path: str):
    """Train the ASD classification model"""
    df = pd.read_csv(csv_path)
    
    # Features: A1-A10 scores and demographic data
    feature_columns = [
        'A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score',
        'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score',
        'age', 'gender', 'ethnicity', 'jundice', 'austim'
    ]
    
    X = df[feature_columns]
    y = df['Class/ASD']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest Classifier
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Training Accuracy: {train_score:.4f}")
    print(f"Testing Accuracy: {test_score:.4f}")
    
    # Save model and scaler
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    return model, scaler

def load_model():
    """Load the trained model and scaler"""
    if not MODEL_PATH.exists() or not SCALER_PATH.exists():
        raise FileNotFoundError("Model not trained yet. Please train the model first.")
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler

def predict_asd(features: dict):
    """Make a prediction for ASD"""
    model, scaler = load_model()
    
    # Create feature array in the correct order
    feature_array = np.array([[
        features['a1_score'], features['a2_score'], features['a3_score'],
        features['a4_score'], features['a5_score'], features['a6_score'],
        features['a7_score'], features['a8_score'], features['a9_score'],
        features['a10_score'], features['age'], features['gender'],
        features['ethnicity'], features['jaundice'], features['austim']
    ]])
    
    # Scale and predict
    feature_scaled = scaler.transform(feature_array)
    prediction = model.predict(feature_scaled)[0]
    probability = model.predict_proba(feature_scaled)[0]
    
    return {
        'prediction': int(prediction),
        'probability': float(probability[1]),
        'confidence': float(max(probability))
    }
