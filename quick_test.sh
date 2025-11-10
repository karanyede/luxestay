#!/bin/bash

echo "=========================================="
echo "Quick Backend API Test"
echo "=========================================="
echo ""

# Test the corrected endpoints
echo "Testing: GET /api/rooms/test"
curl -s http://localhost:8081/api/rooms/test
echo -e "\n"

echo "Testing: GET /api/rooms"
response=$(curl -s -w "\n%{http_code}" http://localhost:8081/api/rooms 2>&1)
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status" = "200" ]; then
    echo "✅ SUCCESS! Backend is working correctly"
    echo "Response preview:"
    echo "$body" | head -c 200
    echo "..."
else
    echo "❌ FAILED with status: $status"
    echo "Response: $body"
fi
echo ""

echo "Testing: GET /api/hotels"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8081/api/hotels

echo ""
echo "=========================================="
echo "Backend Fix Applied!"
echo "=========================================="
echo ""
echo "NEXT STEPS:"
echo "1. Restart your Spring Boot backend in IntelliJ"
echo "2. Run: bash quick_test.sh"
echo "3. Then run full tests: bash test_backend_comprehensive.sh"
