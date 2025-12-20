#!/bin/bash

echo "🔐 Step 1: Login to get access token..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

echo "✅ Token obtained"
echo ""

echo "👤 Step 2: Get LinkedIn user profile..."
PROFILE_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/linkedin/user-profile/" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE_RESPONSE" | jq '.'

echo ""
echo "🏁 LinkedIn profile test completed!"
