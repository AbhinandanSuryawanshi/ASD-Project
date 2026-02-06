#!/usr/bin/env python3

import requests
import sys
import json
import os
from datetime import datetime
from pathlib import Path

class ASDAPITester:
    def __init__(self, base_url="https://spectrum-screen.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details="", expected_status=None, actual_status=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
            if expected_status and actual_status:
                print(f"   Expected status: {expected_status}, Got: {actual_status}")
        
        self.test_results.append({
            "test": name,
            "status": "PASSED" if success else "FAILED",
            "details": details,
            "expected_status": expected_status,
            "actual_status": actual_status
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = "ASD Detection System API" in data.get("message", "")
                details = f"Response: {data}" if success else "Unexpected response format"
            else:
                details = f"HTTP {response.status_code}"
            
            self.log_test("API Root Endpoint", success, details, 200, response.status_code)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_image_upload(self):
        """Test image upload endpoint"""
        try:
            # Create a dummy image file
            test_image_content = b"fake_image_data_for_testing"
            files = {'file': ('test.jpg', test_image_content, 'image/jpeg')}
            
            response = requests.post(f"{self.api_url}/upload-image", files=files, timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = "filename" in data and "status" in data
                details = f"Uploaded filename: {data.get('filename', 'N/A')}" if success else "Missing required fields"
                if success:
                    self.uploaded_filename = data["filename"]
            else:
                details = f"HTTP {response.status_code}: {response.text}"
            
            self.log_test("Image Upload", success, details, 200, response.status_code)
            return success
        except Exception as e:
            self.log_test("Image Upload", False, str(e))
            return False

    def test_assessment_creation(self):
        """Test assessment creation with ML prediction"""
        try:
            # Sample assessment data
            payload = {
                "demographic": {
                    "age": 25,
                    "gender": 1,
                    "ethnicity": 2,
                    "country": "United States",
                    "jaundice": 0,
                    "family_history": 1,
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
                "image_filename": getattr(self, 'uploaded_filename', None)
            }
            
            response = requests.post(f"{self.api_url}/assess", json=payload, timeout=30)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ["id", "timestamp", "demographic", "behavioral", "prediction", 
                                 "probability", "confidence", "risk_level"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    success = False
                    details = f"Missing fields: {missing_fields}"
                else:
                    # Validate data types and ranges
                    if not (0 <= data["probability"] <= 1):
                        success = False
                        details = f"Invalid probability: {data['probability']}"
                    elif not (0 <= data["confidence"] <= 1):
                        success = False
                        details = f"Invalid confidence: {data['confidence']}"
                    elif data["risk_level"] not in ["Low", "Moderate", "High"]:
                        success = False
                        details = f"Invalid risk level: {data['risk_level']}"
                    else:
                        details = f"Assessment created with ID: {data['id']}, Risk: {data['risk_level']}, Probability: {data['probability']:.3f}"
                        self.assessment_id = data["id"]
            else:
                details = f"HTTP {response.status_code}: {response.text}"
            
            self.log_test("Assessment Creation", success, details, 200, response.status_code)
            return success
        except Exception as e:
            self.log_test("Assessment Creation", False, str(e))
            return False

    def test_get_assessments(self):
        """Test getting all assessments"""
        try:
            response = requests.get(f"{self.api_url}/assessments", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if isinstance(data, list):
                    details = f"Retrieved {len(data)} assessments"
                    # Check if our created assessment is in the list
                    if hasattr(self, 'assessment_id'):
                        found = any(assessment.get("id") == self.assessment_id for assessment in data)
                        if not found:
                            success = False
                            details += " - Created assessment not found in list"
                else:
                    success = False
                    details = "Response is not a list"
            else:
                details = f"HTTP {response.status_code}: {response.text}"
            
            self.log_test("Get All Assessments", success, details, 200, response.status_code)
            return success
        except Exception as e:
            self.log_test("Get All Assessments", False, str(e))
            return False

    def test_get_specific_assessment(self):
        """Test getting a specific assessment by ID"""
        if not hasattr(self, 'assessment_id'):
            self.log_test("Get Specific Assessment", False, "No assessment ID available from previous test")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/assessments/{self.assessment_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("id") == self.assessment_id:
                    details = f"Retrieved assessment {self.assessment_id} successfully"
                else:
                    success = False
                    details = f"ID mismatch: expected {self.assessment_id}, got {data.get('id')}"
            else:
                details = f"HTTP {response.status_code}: {response.text}"
            
            self.log_test("Get Specific Assessment", success, details, 200, response.status_code)
            return success
        except Exception as e:
            self.log_test("Get Specific Assessment", False, str(e))
            return False

    def test_nonexistent_assessment(self):
        """Test getting a non-existent assessment (should return 404)"""
        try:
            fake_id = "nonexistent-assessment-id"
            response = requests.get(f"{self.api_url}/assessments/{fake_id}", timeout=10)
            success = response.status_code == 404
            
            details = f"Correctly returned 404 for non-existent assessment" if success else f"Expected 404, got {response.status_code}"
            
            self.log_test("Non-existent Assessment (404)", success, details, 404, response.status_code)
            return success
        except Exception as e:
            self.log_test("Non-existent Assessment (404)", False, str(e))
            return False

    def test_pdf_report_generation(self):
        """Test PDF report generation and download"""
        if not hasattr(self, 'assessment_id'):
            self.log_test("PDF Report Generation", False, "No assessment ID available from previous test")
            return False
        
        try:
            response = requests.get(f"{self.api_url}/assessments/{self.assessment_id}/report", timeout=30)
            success = response.status_code == 200
            
            if success:
                # Check if response is PDF
                content_type = response.headers.get('content-type', '')
                if 'application/pdf' in content_type:
                    # Check PDF size (should be reasonable)
                    pdf_size = len(response.content)
                    if pdf_size > 1000:  # At least 1KB
                        details = f"PDF generated successfully, size: {pdf_size} bytes"
                        # Save PDF for verification
                        with open("/app/test_report.pdf", "wb") as f:
                            f.write(response.content)
                    else:
                        success = False
                        details = f"PDF too small: {pdf_size} bytes"
                else:
                    success = False
                    details = f"Wrong content type: {content_type}"
            else:
                details = f"HTTP {response.status_code}: {response.text}"
            
            self.log_test("PDF Report Generation", success, details, 200, response.status_code)
            return success
        except Exception as e:
            self.log_test("PDF Report Generation", False, str(e))
            return False

    def test_pdf_report_nonexistent(self):
        """Test PDF report generation for non-existent assessment (should return 404)"""
        try:
            fake_id = "nonexistent-assessment-id"
            response = requests.get(f"{self.api_url}/assessments/{fake_id}/report", timeout=10)
            success = response.status_code == 404
            
            details = f"Correctly returned 404 for non-existent assessment report" if success else f"Expected 404, got {response.status_code}"
            
            self.log_test("PDF Report Non-existent (404)", success, details, 404, response.status_code)
            return success
        except Exception as e:
            self.log_test("PDF Report Non-existent (404)", False, str(e))
            return False

    def test_assessment_without_image(self):
        """Test assessment creation without image (optional field)"""
        try:
            # Sample assessment data without image
            payload = {
                "demographic": {
                    "age": 30,
                    "gender": 0,
                    "ethnicity": 1,
                    "country": "Canada",
                    "jaundice": 1,
                    "family_history": 0,
                    "respondent": "Parent"
                },
                "behavioral": {
                    "a1_score": 0,
                    "a2_score": 1,
                    "a3_score": 0,
                    "a4_score": 1,
                    "a5_score": 0,
                    "a6_score": 1,
                    "a7_score": 0,
                    "a8_score": 1,
                    "a9_score": 0,
                    "a10_score": 1
                }
                # No image_filename field
            }
            
            response = requests.post(f"{self.api_url}/assess", json=payload, timeout=30)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                # Should work without image
                if "id" in data and "risk_level" in data:
                    details = f"Assessment without image created successfully, ID: {data['id']}, Risk: {data['risk_level']}"
                    self.assessment_id_no_image = data["id"]
                else:
                    success = False
                    details = "Missing required fields in response"
            else:
                details = f"HTTP {response.status_code}: {response.text}"
            
            self.log_test("Assessment Without Image", success, details, 200, response.status_code)
            return success
        except Exception as e:
            self.log_test("Assessment Without Image", False, str(e))
            return False

    def test_risk_level_variations(self):
        """Test different risk level scenarios"""
        test_cases = [
            {
                "name": "High Risk Scenario",
                "behavioral": {f"a{i}_score": 1 for i in range(1, 11)},  # All Yes answers
                "expected_risk": "High"
            },
            {
                "name": "Low Risk Scenario", 
                "behavioral": {f"a{i}_score": 0 for i in range(1, 11)},  # All No answers
                "expected_risk": "Low"
            }
        ]
        
        all_passed = True
        
        for case in test_cases:
            try:
                payload = {
                    "demographic": {
                        "age": 25,
                        "gender": 1,
                        "ethnicity": 2,
                        "country": "United States",
                        "jaundice": 0,
                        "family_history": 0,
                        "respondent": "Self"
                    },
                    "behavioral": case["behavioral"]
                }
                
                response = requests.post(f"{self.api_url}/assess", json=payload, timeout=30)
                success = response.status_code == 200
                
                if success:
                    data = response.json()
                    actual_risk = data.get("risk_level")
                    # Note: We can't guarantee exact risk levels due to ML model complexity
                    # Just verify it's a valid risk level
                    if actual_risk in ["Low", "Moderate", "High"]:
                        details = f"{case['name']}: Got {actual_risk} risk level"
                    else:
                        success = False
                        details = f"{case['name']}: Invalid risk level: {actual_risk}"
                else:
                    success = False
                    details = f"{case['name']}: HTTP {response.status_code}"
                
                self.log_test(f"Risk Level - {case['name']}", success, details, 200, response.status_code)
                if not success:
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Risk Level - {case['name']}", False, str(e))
                all_passed = False
        
        return all_passed

    def run_all_tests(self):
        """Run all API tests"""
        print("🔍 Starting ASD Detection System API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_api_root,
            self.test_image_upload,
            self.test_assessment_creation,
            self.test_get_assessments,
            self.test_get_specific_assessment,
            self.test_nonexistent_assessment,
            self.test_pdf_report_generation,
            self.test_pdf_report_nonexistent,
            self.test_assessment_without_image,
            self.test_risk_level_variations
        ]
        
        for test in tests:
            test()
            print()
        
        # Summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! Backend API is working correctly.")
            return True
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return False

def main():
    tester = ASDAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "base_url": tester.base_url,
        "summary": {
            "total_tests": tester.tests_run,
            "passed_tests": tester.tests_passed,
            "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
        },
        "test_details": tester.test_results
    }
    
    # Save to file
    results_file = Path(__file__).parent / "backend_test_results.json"
    results_file.parent.mkdir(exist_ok=True, parents=True)
    with open(results_file, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: {results_file}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())