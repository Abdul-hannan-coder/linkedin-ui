#!/bin/bash

echo "🔐 Getting access token..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

echo "🔗 Testing Google login endpoint..."
echo ""

# Test with curl following redirects
curl -v -L -X GET "https://backend.postsiva.com/auth/google/login" \
  -H "Authorization: Bearer $TOKEN" 2>&1 | grep -E "(Location:|HTTP/)"

echo ""
echo "🔗 Getting redirect URL..."
REDIRECT=$(curl -s -I -X GET "https://backend.postsiva.com/auth/google/login" \
  -H "Authorization: Bearer $TOKEN" | grep -i "location:" | cut -d' ' -f2 | tr -d '\r')

if [ ! -z "$REDIRECT" ]; then
  echo "✅ Google OAuth URL:"
  echo "$REDIRECT"
else
  echo "ℹ️  No redirect found, checking response body..."
  curl -s -X GET "https://backend.postsiva.com/auth/google/login" \
    -H "Authorization: Bearer $TOKEN"
fi
