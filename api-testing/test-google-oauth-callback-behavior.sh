#!/bin/bash

echo "🔐 Step 1: Login to get access token..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

echo "✅ Token obtained: ${TOKEN:0:30}..."
echo ""

echo "🔍 UNDERSTANDING THE OAUTH CALLBACK FLOW:"
echo "========================================"
echo ""

echo "📋 Current Authentication State:"
echo "------------------------------"
USER_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/auth/me" \
  -H "Authorization: Bearer $TOKEN")

echo "Current User:"
echo "$USER_RESPONSE" | jq '.'
echo ""

echo "📋 Google OAuth URL Generation:"
echo "-----------------------------"
DEBUG_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/auth/google/debug" \
  -H "Authorization: Bearer $TOKEN")

OAUTH_URL=$(echo $DEBUG_RESPONSE | jq -r '.generated_auth_url')
echo "OAuth URL: ${OAUTH_URL:0:100}..."
echo ""

echo "🔍 CALLBACK ENDPOINT ANALYSIS:"
echo "============================="
echo ""

echo "The OAuth flow works like this:"
echo "1. User clicks 'Sign in with Google'"
echo "2. Frontend opens popup with OAuth URL"
echo "3. User completes OAuth on Google"
echo "4. Google redirects to: https://backend.postsiva.com/auth/google/callback"
echo "5. Backend processes the callback and..."
echo ""

echo "❓ QUESTION: What happens after callback?"
echo "Let's test the callback endpoint directly..."
echo ""

# Test callback endpoint (this will fail but shows us the expected behavior)
echo "📋 Testing callback endpoint structure:"
CALLBACK_TEST=$(curl -s -X GET "https://backend.postsiva.com/auth/google/callback" \
  -H "Authorization: Bearer $TOKEN")

echo "Callback response (without OAuth code):"
echo "$CALLBACK_TEST" | jq '.' 2>/dev/null || echo "$CALLBACK_TEST"
echo ""

echo "🔍 SECURE CALLBACK TEST:"
echo "----------------------"
SECURE_CALLBACK_TEST=$(curl -s -X GET "https://backend.postsiva.com/auth/google/callback-secure" \
  -H "Authorization: Bearer $TOKEN")

echo "Secure callback response:"
echo "$SECURE_CALLBACK_TEST" | jq '.' 2>/dev/null || echo "$SECURE_CALLBACK_TEST"
echo ""

echo "💡 ANALYSIS FOR YOUR HOOK:"
echo "========================="
echo ""
echo "🎯 The Issue with Your Current Hook:"
echo "Your hook is trying to detect token changes, but Google OAuth"
echo "doesn't necessarily change your PostSiva token - it just links"
echo "your Google account to your existing PostSiva account."
echo ""
echo "🔧 What Your Hook Should Do Instead:"
echo "1. Get OAuth URL from /auth/google/debug"
echo "2. Open popup with that URL"
echo "3. After popup closes, check Google OAuth status"
echo "4. Call a status endpoint to verify Google account is linked"
echo ""
echo "📋 Recommended Status Check:"
echo "After OAuth completion, check:"

# Check if there's a way to verify Google OAuth status
GOOGLE_STATUS=$(curl -s -X GET "https://backend.postsiva.com/auth/google/status" \
  -H "Authorization: Bearer $TOKEN")

echo "Google OAuth Status:"
echo "$GOOGLE_STATUS" | jq '.'
echo ""

echo "🎯 RECOMMENDED HOOK CHANGES:"
echo "=========================="
echo ""
echo "Instead of checking for token changes, your hook should:"
echo "1. Call /auth/google/debug to get OAuth URL"
echo "2. Open popup"
echo "3. Poll for popup closure"
echo "4. After closure, call /auth/google/status to check if OAuth succeeded"
echo "5. Or call /auth/me to see if Google account info was added"
echo ""

echo "🏁 OAuth callback behavior analysis completed!"
