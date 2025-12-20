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

echo "🎯 TESTING GOOGLE OAUTH ENDPOINTS:"
echo "=================================="
echo ""

echo "📋 Test 1: GET /auth/google/status"
echo "--------------------------------"
STATUS_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/auth/google/status" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$STATUS_RESPONSE" | jq '.'
echo ""

echo "📋 Test 2: GET /auth/google/debug"
echo "-------------------------------"
DEBUG_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/auth/google/debug" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$DEBUG_RESPONSE" | jq '.'
echo ""

# Extract the OAuth URL
OAUTH_URL=$(echo $DEBUG_RESPONSE | jq -r '.generated_auth_url // "null"')
echo "Generated OAuth URL: $OAUTH_URL"
echo ""

echo "📋 Test 3: GET /auth/google/login (redirect test)"
echo "----------------------------------------------"
echo "Testing redirect behavior..."

# Test the login endpoint with verbose output to see redirect
curl -v -X GET "https://backend.postsiva.com/auth/google/login" \
  -H "Authorization: Bearer $TOKEN" \
  --max-time 10 2>&1 | grep -E "(Location:|HTTP/|< )" | head -10

echo ""
echo ""

echo "📋 Test 4: Check callback endpoint structure"
echo "------------------------------------------"
echo "Callback URL from status: $(echo $STATUS_RESPONSE | jq -r '.callback_url // "N/A"')"
echo "Redirect URI from status: $(echo $STATUS_RESPONSE | jq -r '.redirect_uri // "N/A"')"
echo ""

echo "🔍 ANALYSIS:"
echo "==========="
echo ""

# Check if OAuth is configured
OAUTH_CONFIGURED=$(echo $STATUS_RESPONSE | jq -r '.google_oauth_configured // false')
CLIENT_ID=$(echo $STATUS_RESPONSE | jq -r '.client_id // "N/A"')
REDIRECT_URI=$(echo $STATUS_RESPONSE | jq -r '.redirect_uri // "N/A"')

echo "Google OAuth Configured: $OAUTH_CONFIGURED"
echo "Client ID: $CLIENT_ID"
echo "Redirect URI: $REDIRECT_URI"
echo ""

if [ "$OAUTH_URL" != "null" ]; then
  echo "✅ OAuth URL Generation: WORKING"
  echo "Generated URL: ${OAUTH_URL:0:100}..."
  
  # Parse the OAuth URL to understand the flow
  echo ""
  echo "🔍 OAuth URL Analysis:"
  echo "Client ID: $(echo "$OAUTH_URL" | grep -o 'client_id=[^&]*' | cut -d= -f2)"
  echo "Redirect URI: $(echo "$OAUTH_URL" | grep -o 'redirect_uri=[^&]*' | cut -d= -f2 | python3 -c "import urllib.parse; import sys; print(urllib.parse.unquote(sys.stdin.read().strip()))" 2>/dev/null || echo "Could not decode")"
  echo "Scope: $(echo "$OAUTH_URL" | grep -o 'scope=[^&]*' | cut -d= -f2 | python3 -c "import urllib.parse; import sys; print(urllib.parse.unquote(sys.stdin.read().strip()))" 2>/dev/null || echo "Could not decode")"
  echo "Response Type: $(echo "$OAUTH_URL" | grep -o 'response_type=[^&]*' | cut -d= -f2)"
  
else
  echo "❌ OAuth URL Generation: FAILED"
fi

echo ""
echo "💡 RECOMMENDATIONS FOR YOUR HOOK:"
echo "================================"
echo ""

if [ "$OAUTH_CONFIGURED" = "true" ]; then
  echo "✅ Backend OAuth is properly configured"
  echo ""
  echo "🔧 Your hook should:"
  echo "1. Use GET /auth/google/debug to get the OAuth URL"
  echo "2. Open popup with the generated_auth_url"
  echo "3. The callback goes to: $REDIRECT_URI"
  echo "4. After callback, check if user is authenticated"
  echo ""
  echo "🎯 Recommended Flow:"
  echo "1. Call /auth/google/debug → get generated_auth_url"
  echo "2. Open popup with that URL"
  echo "3. User completes OAuth on Google"
  echo "4. Google redirects to /auth/google/callback"
  echo "5. Backend handles callback and sets session"
  echo "6. Check authentication status or token"
else
  echo "❌ Backend OAuth is not configured properly"
fi

echo ""
echo "🏁 Google OAuth flow analysis completed!"
