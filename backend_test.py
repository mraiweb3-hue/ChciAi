#!/usr/bin/env python3
"""
CHCIAI Backend API Testing Suite
Tests all backend endpoints for the AI transformation agency platform
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class CHCIAIAPITester:
    def __init__(self, base_url="https://chciai-upgrade.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.client_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "response_data": response_data
        })

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Dict = None, headers: Dict = None, auth_required: bool = False) -> tuple:
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        
        # Setup headers
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if auth_required and self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)
            else:
                self.log_test(name, False, f"Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            if success:
                self.log_test(name, True, f"Status: {response.status_code}", response_data)
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}. Response: {response.text[:200]}")

            return success, response_data

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_auth_register(self):
        """Test user registration"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": test_email,
                "password": "TestPass123!",
                "company_name": "Test Company"
            }
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.client_id = response.get('client', {}).get('id')
            return True
        return False

    def test_auth_login(self):
        """Test user login with existing credentials"""
        # Try to login with a test account
        success, response = self.run_test(
            "User Login",
            "POST", 
            "auth/login",
            200,
            data={
                "email": "admin@chciai.cz",
                "password": "admin123"
            }
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.client_id = response.get('client', {}).get('id')
            return True
        return False

    def test_leads_endpoint(self):
        """Test leads creation endpoint"""
        success, response = self.run_test(
            "Create Lead",
            "POST",
            "leads",
            200,
            data={
                "industry": "E-commerce",
                "company_size": "2-5 lidí",
                "problem": "Zákaznická podpora",
                "tech_level": "Pokročilý uživatel",
                "source": "chatbot",
                "status": "qualified"
            }
        )
        return success

    def test_onboarding_status(self):
        """Test onboarding status endpoint"""
        success, response = self.run_test(
            "Onboarding Status",
            "GET",
            "onboarding/status",
            200,
            auth_required=True
        )
        return success

    def test_academy_modules(self):
        """Test academy modules endpoint"""
        success, response = self.run_test(
            "Academy Modules",
            "GET",
            "academy/modules",
            200,
            auth_required=True
        )
        
        if success and isinstance(response, list):
            # Check if modules have required fields
            for module in response:
                if not all(key in module for key in ['id', 'title', 'description']):
                    self.log_test("Academy Modules Structure", False, "Missing required fields in modules")
                    return False
            self.log_test("Academy Modules Structure", True, f"Found {len(response)} modules")
        
        return success

    def test_clawix_callback(self):
        """Test Clawix callback endpoint"""
        success, response = self.run_test(
            "Clawix Callback",
            "POST",
            "clawix/callback",
            200,
            data={
                "name": "Test User",
                "phone": "+420123456789",
                "language": "cs",
                "call_time": "30s",
                "website": "test.com",
                "consent_sms": True,
                "consent_call": True
            }
        )
        
        if success and 'id' in response and 'confirmation_code' in response:
            self.log_test("Clawix Callback Response", True, "Callback created with ID and confirmation code")
            return True
        elif success:
            self.log_test("Clawix Callback Response", False, "Missing ID or confirmation code in response")
        
        return success

    def test_dashboard_stats(self):
        """Test dashboard stats endpoint"""
        success, response = self.run_test(
            "Dashboard Stats",
            "GET",
            "dashboard/stats",
            200,
            auth_required=True
        )
        return success

    def test_seo_structured_data(self):
        """Test SEO structured data endpoint"""
        success, response = self.run_test(
            "SEO Structured Data",
            "GET",
            "seo/structured-data",
            200
        )
        
        if success and isinstance(response, dict):
            # Check for required SEO fields
            required_sections = ['service', 'organization', 'faq']
            for section in required_sections:
                if section not in response:
                    self.log_test("SEO Data Structure", False, f"Missing {section} section")
                    return False
            self.log_test("SEO Data Structure", True, "All required sections present")
        
        return success

    def test_content_sections(self):
        """Test content sections endpoint"""
        success, response = self.run_test(
            "Content Sections",
            "GET",
            "content/sections",
            200
        )
        return success

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting CHCIAI Backend API Tests")
        print(f"📡 Testing API at: {self.api_url}")
        print("=" * 60)

        # Basic connectivity
        self.test_health_check()
        
        # Authentication tests
        auth_success = self.test_auth_register()
        if not auth_success:
            # Try login if register fails
            auth_success = self.test_auth_login()
        
        # Core API tests
        self.test_leads_endpoint()
        
        # Protected endpoints (require auth)
        if auth_success:
            self.test_onboarding_status()
            self.test_academy_modules()
            self.test_dashboard_stats()
        else:
            print("⚠️  Skipping protected endpoints - no authentication")
        
        # Public endpoints
        self.test_clawix_callback()
        self.test_seo_structured_data()
        self.test_content_sections()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed")
            print("\nFailed tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
            return 1

def main():
    tester = CHCIAIAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())