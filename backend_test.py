#!/usr/bin/env python3
"""
ChciAI Backend API Testing Suite
Tests all backend endpoints for functionality and integration
"""

import requests
import sys
import json
from datetime import datetime
import uuid

class ChciAIAPITester:
    def __init__(self, base_url="https://chciai-upgrade.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.auth_token = None
        self.test_user_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        self.test_user_password = "TestPass123!"

    def log_test(self, name, success, details="", response_data=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")
        if not success and response_data:
            print(f"    Response: {response_data}")
        print()

    def test_health_endpoint(self):
        """Test /api/health endpoint"""
        try:
            response = requests.get(f"{self.api_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_test("Health Check", True, f"Status: {data['status']}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_auth_register(self):
        """Test /api/auth/register endpoint"""
        try:
            test_data = {
                "email": self.test_user_email,
                "password": self.test_user_password,
                "company_name": "Test Company Ltd"
            }
            
            response = requests.post(
                f"{self.api_url}/auth/register",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "client" in data:
                    self.auth_token = data["token"]
                    self.log_test("Auth Register", True, f"User registered with ID: {data['client']['id']}")
                    return True
                else:
                    self.log_test("Auth Register", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("Auth Register", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Auth Register", False, f"Error: {str(e)}")
            return False

    def test_auth_login(self):
        """Test /api/auth/login endpoint"""
        try:
            test_data = {
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = requests.post(
                f"{self.api_url}/auth/login",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "client" in data:
                    self.auth_token = data["token"]
                    self.log_test("Auth Login", True, f"Login successful for: {data['client']['email']}")
                    return True
                else:
                    self.log_test("Auth Login", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("Auth Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Auth Login", False, f"Error: {str(e)}")
            return False

    def test_auth_me(self):
        """Test /api/auth/me endpoint"""
        if not self.auth_token:
            self.log_test("Auth Me", False, "No auth token available")
            return False
            
        try:
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.api_url}/auth/me",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data:
                    self.log_test("Auth Me", True, f"User data retrieved for: {data['email']}")
                    return True
                else:
                    self.log_test("Auth Me", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("Auth Me", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Auth Me", False, f"Error: {str(e)}")
            return False

    def test_contact_callback(self):
        """Test /api/contact/callback endpoint"""
        try:
            test_data = {
                "phone": "+420123456789",
                "name": "Test User",
                "email": "test@example.com",
                "type": "callback"
            }
            
            response = requests.post(
                f"{self.api_url}/contact/callback",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "phone" in data:
                    self.log_test("Contact Callback", True, f"Callback saved with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Contact Callback", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("Contact Callback", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Callback", False, f"Error: {str(e)}")
            return False

    def test_clawix_callback(self):
        """Test /api/clawix/callback endpoint"""
        try:
            test_data = {
                "name": "Test User",
                "phone": "+420123456789",
                "language": "cs",
                "call_time": "30s",
                "website": "https://test.com",
                "consent_sms": True,
                "consent_call": True
            }
            
            response = requests.post(
                f"{self.api_url}/clawix/callback",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "confirmation_code" in data and "status" in data:
                    self.log_test("Clawix Callback", True, f"Callback created with ID: {data['id']}, Code: {data['confirmation_code']}")
                    return True
                else:
                    self.log_test("Clawix Callback", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("Clawix Callback", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Clawix Callback", False, f"Error: {str(e)}")
            return False

    def test_seo_structured_data(self):
        """Test /api/seo/structured-data endpoint"""
        try:
            response = requests.get(f"{self.api_url}/seo/structured-data", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "service" in data and "organization" in data and "faq" in data:
                    self.log_test("SEO Structured Data", True, "SEO data retrieved successfully")
                    return True
                else:
                    self.log_test("SEO Structured Data", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("SEO Structured Data", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("SEO Structured Data", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting ChciAI Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity first
        self.test_health_endpoint()
        
        # Test authentication flow
        print("🔐 Testing Authentication...")
        self.test_auth_register()
        self.test_auth_login()
        self.test_auth_me()
        
        # Test contact forms
        print("📞 Testing Contact Forms...")
        self.test_contact_callback()
        self.test_clawix_callback()
        
        # Test SEO endpoints
        print("🔍 Testing SEO Endpoints...")
        self.test_seo_structured_data()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check details above.")
            return False

    def get_test_summary(self):
        """Get detailed test summary"""
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": self.tests_run - self.tests_passed,
            "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0,
            "test_results": self.test_results,
            "timestamp": datetime.now().isoformat()
        }

def main():
    """Main test execution"""
    tester = ChciAIAPITester()
    
    try:
        success = tester.run_all_tests()
        
        # Save detailed results
        summary = tester.get_test_summary()
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())