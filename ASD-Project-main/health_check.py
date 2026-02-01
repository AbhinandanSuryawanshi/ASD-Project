#!/usr/bin/env python
"""
Quick health check script for ASD Detection System
Verifies both backend and frontend are running and accessible
"""

import requests
import time
import sys

def check_backend():
    """Check if backend server is running"""
    try:
        response = requests.get("http://localhost:8000/docs", timeout=3)
        if response.status_code == 200:
            print("✅ Backend Server: RUNNING (http://localhost:8000)")
            print("   API Documentation: http://localhost:8000/docs")
            return True
    except requests.exceptions.RequestException as e:
        print("❌ Backend Server: NOT RUNNING")
        print(f"   Error: {str(e)}")
        return False

def check_frontend():
    """Check if frontend server is running"""
    try:
        response = requests.get("http://localhost:3000", timeout=3)
        if response.status_code == 200:
            print("✅ Frontend Server: RUNNING (http://localhost:3000)")
            return True
    except requests.exceptions.RequestException as e:
        print("❌ Frontend Server: NOT RUNNING")
        print(f"   Error: {str(e)}")
        return False

def main():
    print("\n" + "="*50)
    print("ASD Detection System - Health Check")
    print("="*50 + "\n")
    
    backend_ok = check_backend()
    time.sleep(1)
    frontend_ok = check_frontend()
    
    print("\n" + "="*50)
    if backend_ok and frontend_ok:
        print("✅ All services running successfully!")
        print("="*50 + "\n")
        return 0
    else:
        print("❌ Some services are not running")
        print("="*50 + "\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
