import requests
import sys
import json
from datetime import datetime
import uuid

class ChciAIAPITester:
    def __init__(self, base_url="https://web-visibility-fix.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{str(uuid.uuid4())[:8]}"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:500]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout (30s)")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "",
            200
        )

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Company",
            "message": "This is a test message for the contact form."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=test_data
        )
        
        if success and isinstance(response, dict):
            required_fields = ['id', 'name', 'email', 'message', 'timestamp']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"⚠️  Warning: Missing fields in response: {missing_fields}")
            else:
                print(f"✅ Contact response contains all required fields")
        
        return success

    def test_get_contacts(self):
        """Test getting contacts list"""
        return self.run_test(
            "Get Contacts List",
            "GET",
            "contacts",
            200
        )

    def test_chat_functionality(self):
        """Test AI chat functionality"""
        test_message = {
            "session_id": self.session_id,
            "message": "Ahoj, můžete mi říct něco o vašich službách?"
        }
        
        success, response = self.run_test(
            "AI Chat Message",
            "POST",
            "chat",
            200,
            data=test_message
        )
        
        if success and isinstance(response, dict):
            if 'response' in response and 'session_id' in response:
                print(f"✅ Chat response received: {response['response'][:100]}...")
                return True
            else:
                print(f"⚠️  Warning: Chat response missing required fields")
        
        return success

    def test_chat_history(self):
        """Test chat history retrieval"""
        return self.run_test(
            "Chat History",
            "GET",
            f"chat/history/{self.session_id}",
            200
        )

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test creating status check
        test_status = {
            "client_name": "Test Client"
        }
        
        success1, response1 = self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            data=test_status
        )
        
        # Test getting status checks
        success2, response2 = self.run_test(
            "Get Status Checks",
            "GET",
            "status",
            200
        )
        
        return success1 and success2

def main():
    print("🚀 Starting ChciAI API Tests")
    print("=" * 50)
    
    # Setup
    tester = ChciAIAPITester()
    
    # Run all tests
    print("\n📡 Testing API Connectivity...")
    tester.test_root_endpoint()
    
    print("\n📝 Testing Contact Form...")
    tester.test_contact_form_submission()
    tester.test_get_contacts()
    
    print("\n🤖 Testing AI Chat...")
    tester.test_chat_functionality()
    # Wait a moment for chat to be processed
    import time
    time.sleep(2)
    tester.test_chat_history()
    
    print("\n📊 Testing Status Endpoints...")
    tester.test_status_endpoints()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())