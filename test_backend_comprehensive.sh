#!/bin/bash

echo "=========================================="
echo "Hotel Reservation System - Backend Tests"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8081/api"
FAILED=0
PASSED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local test_name=$5
    
    echo -n "Testing: $test_name... "
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" 2>/dev/null)
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        ((PASSED++))
        if [ -n "$body" ] && [ "$body" != "0" ]; then
            echo "   Response: $(echo $body | head -c 100)..."
        fi
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        ((FAILED++))
        if [ -n "$body" ]; then
            echo "   Error: $body"
        fi
    fi
    echo ""
}

echo "=== 1. SERVER CONNECTIVITY ==="
# Check if server is listening on port 8081
if netstat -an | grep -q "8081.*LISTENING"; then
    echo -e "${GREEN}✓ Backend server is running on port 8081${NC}"
    echo ""
else
    echo -e "${RED}✗ Backend server is NOT running on port 8081${NC}"
    echo "Please start the backend in IntelliJ or with: mvn spring-boot:run"
    exit 1
fi

echo "=== 2. AUTHENTICATION ENDPOINTS ==="
# Registration returns 201 Created, not 200
# Use timestamp to create unique email each test run
TIMESTAMP=$(date +%s)
echo -n "Testing: User Registration... "
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test${TIMESTAMP}@example.com\",\"password\":\"Test@123\",\"fullName\":\"Test User\"}")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$status_code" = "200" ] || [ "$status_code" = "201" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
    ((PASSED++))
    if [ -n "$body" ]; then
        echo "   Response: $(echo $body | head -c 100)..."
    fi
else
    echo -e "${RED}✗ FAILED${NC} (Expected: 200/201, Got: $status_code)"
    ((FAILED++))
    if [ -n "$body" ]; then
        echo "   Error: $body"
    fi
fi
echo ""

test_endpoint "POST" "/auth/login" '{"email":"test@example.com","password":"Test@123"}' "200" "User Login"
test_endpoint "POST" "/auth/check-email" '{"email":"test@example.com"}' "200" "Email Availability Check"

echo "=== 3. HOTELS ENDPOINTS ==="
test_endpoint "GET" "/hotels" "" "200" "Get All Hotels"
test_endpoint "GET" "/hotels/1" "" "200" "Get Hotel by ID"

echo "=== 4. ROOMS ENDPOINTS ==="
test_endpoint "GET" "/rooms" "" "200" "Get All Rooms"
test_endpoint "GET" "/rooms/1" "" "200" "Get Room by ID"
# Search endpoint uses GET with query params: checkIn, checkOut, capacity
test_endpoint "GET" "/rooms/search?checkIn=2025-11-01&checkOut=2025-11-05&capacity=2" "" "200" "Search Available Rooms"

echo "=== 5. RESERVATIONS ENDPOINTS ==="
# Note: Endpoint requires userId parameter - /reservations/user/{userId}
# Since security is permitAll(), this should return 200 with empty array or user's reservations
test_endpoint "GET" "/reservations/user/1" "" "200" "Get User Reservations"

echo "=== 6. CORS CONFIGURATION ==="
echo -n "Testing CORS preflight... "
cors_response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$BASE_URL/rooms" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type")

if [ "$cors_response" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (CORS enabled)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (CORS not configured)"
    ((FAILED++))
fi
echo ""

echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✨${NC}"
    exit 0
else
    echo -e "${YELLOW}Some tests failed. Please check the backend logs.${NC}"
    exit 1
fi
