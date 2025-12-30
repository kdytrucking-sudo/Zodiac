#!/bin/bash

# Webhook API Test Script
# Usage: ./test-webhook.sh

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:8080/api/webhook/articles/create"
TOKEN="your_secret_token_here"  # Change this to your actual token

echo -e "${YELLOW}🧪 Testing Webhook API${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
curl -s http://localhost:8080/api/webhook/health | jq '.'
echo -e "\n"

# Test 2: Create Article with Valid Data
echo -e "${YELLOW}Test 2: Create Article (Valid Data)${NC}"
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "2025年龙年运势详解",
    "content": "龙年是一个充满机遇的年份。在这一年里，属龙的人将会遇到许多新的机会和挑战。事业方面，龙年将带来显著的进步和成功。财运方面也会有不错的表现，但需要注意理财规划。感情方面，单身的朋友可能会遇到心仪的对象，已婚的朋友则需要多花时间陪伴家人。",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test Script",
    "keywords": ["龙年", "运势", "2025", "生肖"],
    "metadata": {
      "author": "Test Script",
      "testRun": true
    }
  }' | jq '.'
echo -e "\n"

# Test 3: Missing Token
echo -e "${YELLOW}Test 3: Missing Token (Should Fail)${NC}"
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "content": "This should fail due to missing token. This should fail due to missing token. This should fail due to missing token.",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test"
  }' | jq '.'
echo -e "\n"

# Test 4: Invalid Data
echo -e "${YELLOW}Test 4: Invalid Data (Should Fail)${NC}"
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "",
    "content": "Too short",
    "category": "invalid_category",
    "zodiacSign": "invalid_sign",
    "source": "Test"
  }' | jq '.'
echo -e "\n"

# Test 5: Missing Required Fields
echo -e "${YELLOW}Test 5: Missing Required Fields (Should Fail)${NC}"
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Article"
  }' | jq '.'
echo -e "\n"

echo -e "${GREEN}✅ Tests completed!${NC}"
echo -e "${YELLOW}Note: Remember to update the TOKEN variable in this script${NC}"
