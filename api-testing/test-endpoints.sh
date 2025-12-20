#!/bin/bash

echo "🔐 Step 1: Login and get token..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo ""
echo "✅ Token obtained: ${TOKEN:0:30}..."
echo ""

echo "👤 Step 2: Get current user profile..."
curl -s -X GET "https://backend.postsiva.com/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "📝 Step 3: Get my text posts..."
curl -s -X GET "https://backend.postsiva.com/linkedin/text-post/my-posts" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "🖼️ Step 4: Get my image posts..."
curl -s -X GET "https://backend.postsiva.com/linkedin/image-post/my-posts" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "🎥 Step 5: Get my video posts..."
curl -s -X GET "https://backend.postsiva.com/linkedin/video-post/my-posts" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "🔗 Step 6: Get LinkedIn token status..."
curl -s -X GET "https://backend.postsiva.com/linkedin/get-token" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "🏁 All tests completed!"
