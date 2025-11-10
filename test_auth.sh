#!/bin/bash

echo "Testing Hotel Reservation System Authentication API on port 8081..."
echo "============================================================"

# Test if backend is running
echo "1. Testing server connectivity..."
curl -f http://localhost:8081/api/auth/check-email -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com"}' 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running and accessible!"
else
    echo "❌ Backend is not running or not accessible"
    echo "Please start the backend with: mvn spring-boot:run"
    exit 1
fi

echo ""
echo "2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s http://localhost:8081/api/auth/register -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}')
echo "Registration Response: $REGISTER_RESPONSE"

echo ""
echo "3. Testing user login..."
LOGIN_RESPONSE=$(curl -s http://localhost:8081/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}')
echo "Login Response: $LOGIN_RESPONSE"

echo ""
echo "4. Testing email availability check..."
CHECK_RESPONSE=$(curl -s http://localhost:8081/api/auth/check-email -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com"}')
echo "Email Check Response: $CHECK_RESPONSE"

echo ""
echo "Testing completed! 🎉"
echo "If you see JSON responses above, the authentication system is working correctly."