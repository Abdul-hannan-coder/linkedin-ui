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

echo "🔗 Step 2: Create LinkedIn OAuth token..."
CREATE_TOKEN=$(curl -s -X POST "https://backend.postsiva.com/linkedin/create-token" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$CREATE_TOKEN" | jq '.'
echo ""

echo "📊 Step 3: Get LinkedIn token status..."
GET_TOKEN=$(curl -s -X GET "https://backend.postsiva.com/linkedin/get-token" \
  -H "Authorization: Bearer $TOKEN")

echo "$GET_TOKEN" | jq '.'
echo ""

echo "🔄 Step 4: Test LinkedIn OAuth callback..."
CALLBACK_TEST=$(curl -s -X GET "https://backend.postsiva.com/linkedin/oauth/callback" \
  -H "Authorization: Bearer $TOKEN")

echo "$CALLBACK_TEST" | jq '.'
echo ""

echo "🔄 Step 5: Refresh LinkedIn token..."
REFRESH_TOKEN=$(curl -s -X POST "https://backend.postsiva.com/linkedin/refresh-token" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$REFRESH_TOKEN" | jq '.'

echo ""
echo "🏁 LinkedIn OAuth tests completed!"
