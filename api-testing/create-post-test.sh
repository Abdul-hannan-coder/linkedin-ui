#!/bin/bash

echo "🔐 Getting access token..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

echo "📝 Creating a new text post..."
CREATE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello from API test! 🚀 This post was created via curl command."
  }')

echo "$CREATE_RESPONSE" | jq '.'
