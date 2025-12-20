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

echo "🔗 Step 2: Get Google OAuth login URL..."
GOOGLE_LOGIN=$(curl -s -X GET "https://backend.postsiva.com/auth/google/login" \
  -H "Authorization: Bearer $TOKEN")

echo "$GOOGLE_LOGIN" | jq '.'
echo ""

echo "📊 Step 3: Check Google OAuth status..."
GOOGLE_STATUS=$(curl -s -X GET "https://backend.postsiva.com/auth/google/status" \
  -H "Authorization: Bearer $TOKEN")

echo "$GOOGLE_STATUS" | jq '.'
echo ""

echo "🐛 Step 4: Get Google OAuth debug info..."
GOOGLE_DEBUG=$(curl -s -X GET "https://backend.postsiva.com/auth/google/debug" \
  -H "Authorization: Bearer $TOKEN")

echo "$GOOGLE_DEBUG" | jq '.'

echo ""
echo "🏁 Google OAuth tests completed!"
