# Google OAuth Integration - Curl Commands

## 🔗 Google OAuth Endpoints

Based on the PostSiva API, here are the Google OAuth endpoints:

### Google OAuth Configuration
- `GET /auth/google/login` - Get Google OAuth login URL
- `GET /auth/google/callback` - OAuth callback handler  
- `GET /auth/google/status` - Check OAuth configuration status
- `GET /auth/google/debug` - Get OAuth debug information
- `GET /auth/google/callback-secure` - Secure callback handler

## 🚀 Google OAuth Flow

### Step 1: Get Access Token (Required for OAuth endpoints)
```bash
curl -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }'
```

### Step 2: Get Google OAuth Login URL (Redirects to Google)
```bash
# This will redirect (307) to Google OAuth page
curl -X GET "https://backend.postsiva.com/auth/google/login" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# To get the redirect URL without following it:
curl -I -X GET "https://backend.postsiva.com/auth/google/login" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" | grep -i "location:"
```

**Expected Redirect URL:**
```
https://accounts.google.com/o/oauth2/auth?client_id=132195997917-ehh86lrhph7ps16enls8096abjr4kr55.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fbackend.postsiva.com%2Fauth%2Fgoogle%2Fcallback&scope=openid+email+profile&response_type=code&access_type=offline&prompt=consent&state=...
```

### Step 3: Check Google OAuth Status
```bash
curl -X GET "https://backend.postsiva.com/auth/google/status" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Step 4: Get Google OAuth Debug Info
```bash
curl -X GET "https://backend.postsiva.com/auth/google/debug" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Step 5: Handle OAuth Callback (After user authorization)
```bash
curl -X GET "https://backend.postsiva.com/auth/google/callback?code=AUTHORIZATION_CODE&state=STATE_PARAMETER" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Step 6: Secure Callback Handler
```bash
curl -X GET "https://backend.postsiva.com/auth/google/callback-secure?code=AUTHORIZATION_CODE&state=STATE_PARAMETER" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 📋 Complete Google OAuth Test Script

Save as `google-oauth-flow.sh`:

```bash
#!/bin/bash

echo "🔐 Step 1: Login to PostSiva API..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ PostSiva login successful!"
echo ""

echo "📊 Step 2: Check Google OAuth configuration..."
STATUS_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/auth/google/status" \
  -H "Authorization: Bearer $TOKEN")

echo "$STATUS_RESPONSE" | jq '.'
echo ""

echo "🐛 Step 3: Get Google OAuth debug info..."
DEBUG_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/auth/google/debug" \
  -H "Authorization: Bearer $TOKEN")

echo "$DEBUG_RESPONSE" | jq '.'

# Extract the Google OAuth URL
GOOGLE_AUTH_URL=$(echo $DEBUG_RESPONSE | jq -r '.generated_auth_url')

echo ""
echo "🔗 Step 4: Google OAuth URL generated:"
echo "$GOOGLE_AUTH_URL"
echo ""

echo "📝 Next Steps:"
echo "1. Open the Google OAuth URL in your browser"
echo "2. Complete Google authorization"
echo "3. The callback will be handled automatically"
echo ""

echo "🔗 Google OAuth Login URL:"
LOGIN_URL_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/auth/google/login" \
  -H "Authorization: Bearer $TOKEN")

echo "$LOGIN_URL_RESPONSE"

echo ""
echo "🏁 Google OAuth flow setup completed!"
```

## 🎯 Expected Responses

### Google OAuth Status Response:
```json
{
  "google_oauth_configured": true,
  "redirect_uri": "https://backend.postsiva.com/auth/google/callback",
  "client_id": "1321959979...",
  "client_secret_configured": true,
  "login_url": "/auth/google/login",
  "callback_url": "/auth/google/callback"
}
```

### Google OAuth Debug Response:
```json
{
  "status": "success",
  "configuration": {
    "client_id": "132195997917-ehh86lrhph7ps16enls8096abjr4kr55.apps.googleusercontent.com",
    "client_secret_configured": true,
    "redirect_uri": "https://backend.postsiva.com/auth/google/callback"
  },
  "generated_auth_url": "https://accounts.google.com/o/oauth2/auth?client_id=132195997917-ehh86lrhph7ps16enls8096abjr4kr55.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fbackend.postsiva.com%2Fauth%2Fgoogle%2Fcallback&scope=openid+email+profile&response_type=code&access_type=offline&prompt=consent",
  "message": "Google OAuth configuration appears to be working"
}
```

## 🔄 OAuth Flow Implementation

### Complete OAuth Flow:

**1. User clicks "Sign in with Google"**
```javascript
// Frontend redirects to backend OAuth endpoint
window.location.href = 'https://backend.postsiva.com/auth/google/login';
// OR open in popup
window.open('https://backend.postsiva.com/auth/google/login', 'google-oauth', 'width=500,height=600');
```

**2. Backend redirects to Google (HTTP 307)**
```
Location: https://accounts.google.com/o/oauth2/auth?client_id=...&redirect_uri=...&scope=openid+email+profile
```

**3. User authorizes on Google**
- User logs in to Google
- Grants permissions (email, profile)
- Google redirects back to callback

**4. Google redirects to callback with code**
```
https://backend.postsiva.com/auth/google/callback?code=AUTHORIZATION_CODE&state=STATE_TOKEN
```

**5. Backend exchanges code for tokens**
- API automatically handles token exchange
- Stores Google OAuth tokens
- Returns user session

### Frontend Integration Steps:

1. **Get OAuth URL**: Call `/auth/google/debug` to get the authorization URL
2. **Redirect User**: Open the `generated_auth_url` in browser or popup
3. **Handle Callback**: The API handles the callback automatically
4. **Check Status**: Verify OAuth connection status

### Browser-Based OAuth Flow:
```javascript
// Method 1: Full page redirect (recommended)
async function loginWithGoogle() {
  const response = await fetch('https://backend.postsiva.com/auth/google/login', {
    headers: { 'Authorization': `Bearer ${token}` },
    redirect: 'manual'
  });
  
  // Get redirect URL from Location header
  const redirectUrl = response.headers.get('Location');
  window.location.href = redirectUrl;
}

// Method 2: Popup window
async function loginWithGooglePopup() {
  const response = await fetch('https://backend.postsiva.com/auth/google/debug', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { generated_auth_url } = await response.json();
  
  const popup = window.open(generated_auth_url, 'google-oauth', 'width=500,height=600');
  
  // Listen for callback completion
  const checkClosed = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkClosed);
      checkGoogleOAuthStatus();
    }
  }, 1000);
}

// Check if Google OAuth is connected
async function checkGoogleOAuthStatus() {
  const response = await fetch('https://backend.postsiva.com/auth/google/status', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const status = await response.json();
  console.log('Google OAuth configured:', status.google_oauth_configured);
}
```

## 🛠️ Integration Notes

1. **OAuth is Pre-configured**: Google OAuth is already set up on the API
2. **Client ID Available**: `132195997917-ehh86lrhph7ps16enls8096abjr4kr55.apps.googleusercontent.com`
3. **Callback Handled**: API handles the OAuth callback automatically
4. **Scopes**: `openid email profile` - basic user information
5. **Access Type**: `offline` - allows refresh tokens

## 🔐 Security Considerations

- OAuth flow requires valid PostSiva API token
- Google OAuth is configured server-side
- Callback URLs are whitelisted
- Secure callback endpoint available for sensitive operations

## 🎯 For Cursor Implementation

Use these endpoints to:
1. **Check OAuth Status** before initiating flow
2. **Get Authorization URL** dynamically
3. **Handle OAuth Callbacks** through API
4. **Integrate with existing authentication** system
