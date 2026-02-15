#!/usr/bin/env python3
"""
OpenClaw Backend API Testing Suite
Tests all backend endpoints for functionality and integration
"""

import requests
import sys
import json
from datetime import datetime
import uuid

class OpenClawAPITester:
    def __init__(self, base_url="https://aplikacni-zmeny.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.session_id = f"test_session_{uuid.uuid4().hex[:8]}"

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

    def test_chat_endpoint(self):
        """Test /api/chat endpoint"""
        try:
            # Test Czech AI chat
            test_message = "Ahoj, co umíte?"
            payload = {
                "session_id": self.session_id,
                "message": test_message
            }
            
            response = requests.post(
                f"{self.api_url}/chat", 
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30  # AI responses can take time
            )
            
            if response.status_code == 200:
                data = response.json()
                if "response" in data and "session_id" in data:
                    # Check if response is in Czech (basic check)
                    ai_response = data["response"]
                    if len(ai_response) > 10:  # Reasonable response length
                        self.log_test("AI Chat", True, f"AI responded: {ai_response[:100]}...")
                        return True
                    else:
                        self.log_test("AI Chat", False, f"Response too short: {ai_response}")
                        return False
                else:
                    self.log_test("AI Chat", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("AI Chat", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("AI Chat", False, f"Error: {str(e)}")
            return False

    def test_contact_form_endpoint(self):
        """Test /api/contact endpoint"""
        try:
            # Test contact form submission
            test_data = {
                "name": "Test User",
                "email": "test@example.com",
                "phone": "+420123456789",
                "company": "Test Company",
                "message": "This is a test message from automated testing.",
                "form_type": "contact"
            }
            
            response = requests.post(
                f"{self.api_url}/contact",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "success" and "id" in data:
                    self.log_test("Contact Form", True, f"Form submitted with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Contact Form", False, f"Invalid response: {data}")
                    return False
            else:
                self.log_test("Contact Form", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Contact Form", False, f"Error: {str(e)}")
            return False

    def test_callback_endpoint(self):
        """Test /api/callback endpoint"""
        try:
            # Test callback request
            test_data = {
                "phone": "+420987654321",
                "name": "Test Callback User"
            }
            
            response = requests.post(
                f"{self.api_url}/callback",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "success" and "id" in data:
                    self.log_test("Callback Request", True, f"Callback saved with ID: {data['id']}")
                    return True
                else:
                    self.log_test("Callback Request", False, f"Invalid response: {data}")
                    return False
            else:
                self.log_test("Callback Request", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Callback Request", False, f"Error: {str(e)}")
            return False

    def test_chat_history_endpoint(self):
        """Test /api/chat/history endpoint"""
        try:
            # Test getting chat history for our session
            response = requests.get(
                f"{self.api_url}/chat/history/{self.session_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "session_id" in data and "messages" in data:
                    message_count = len(data["messages"])
                    self.log_test("Chat History", True, f"Retrieved {message_count} messages")
                    return True
                else:
                    self.log_test("Chat History", False, f"Invalid response format: {data}")
                    return False
            else:
                self.log_test("Chat History", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Chat History", False, f"Error: {str(e)}")
            return False

    def test_root_endpoint(self):
        """Test /api/ root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("API Root", True, f"Message: {data['message']}")
                    return True
                else:
                    self.log_test("API Root", False, f"Invalid response: {data}")
                    return False
            else:
                self.log_test("API Root", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("API Root", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting OpenClaw Backend API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity first
        self.test_root_endpoint()
        self.test_health_endpoint()
        
        # Test core functionality
        self.test_contact_form_endpoint()
        self.test_callback_endpoint()
        
        # Test AI chat (this might take longer)
        print("🤖 Testing AI Chat (this may take 10-30 seconds)...")
        self.test_chat_endpoint()
        self.test_chat_history_endpoint()
        
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
    tester = OpenClawAPITester()
    
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