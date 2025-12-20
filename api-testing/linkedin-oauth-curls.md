# LinkedIn OAuth Integration - Curl Commands

## 🔗 LinkedIn OAuth Endpoints

Based on the PostSiva API, here are the LinkedIn OAuth endpoints:

### LinkedIn OAuth Management
- `POST /linkedin/create-token` - Create LinkedIn OAuth token (opens browser)
- `GET /linkedin/oauth/callback` - OAuth callback handler  
- `GET /linkedin/get-token` - Get current LinkedIn token status
- `POST /linkedin/refresh-token` - Refresh LinkedIn access token
- `DELETE /linkedin/delete-token` - Delete LinkedIn token

## 🚀 LinkedIn OAuth Flow

### Step 1: Get PostSiva Access Token (Required)
```bash
curl -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }'
```

### Step 2: Initiate LinkedIn OAuth (Get Authorization URL)
```bash
curl -X POST "https://backend.postsiva.com/linkedin/create-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Step 3: Check LinkedIn Token Status
```bash
curl -X GET "https://backend.postsiva.com/linkedin/get-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Step 4: Refresh LinkedIn Token
```bash
curl -X POST "https://backend.postsiva.com/linkedin/refresh-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Step 5: Delete LinkedIn Token
```bash
curl -X DELETE "https://backend.postsiva.com/linkedin/delete-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Step 6: Handle OAuth Callback (After user authorization)
```bash
curl -X GET "https://backend.postsiva.com/linkedin/oauth/callback?code=AUTHORIZATION_CODE&state=STATE_PARAMETER" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 📋 Complete LinkedIn OAuth Test Script

Save as `linkedin-oauth-flow.sh`:

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
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.user.id')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ PostSiva login successful!"
echo "👤 User: $(echo $LOGIN_RESPONSE | jq -r '.user.full_name')"
echo "🆔 User ID: $USER_ID"
echo ""

echo "🔗 Step 2: Initiate LinkedIn OAuth..."
CREATE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/create-token" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$CREATE_RESPONSE" | jq '.'

# Extract LinkedIn OAuth URL
LINKEDIN_AUTH_URL=$(echo $CREATE_RESPONSE | jq -r '.data.auth_url')
echo ""
echo "🔗 LinkedIn OAuth URL:"
echo "$LINKEDIN_AUTH_URL"
echo ""

echo "📊 Step 3: Check LinkedIn token status..."
TOKEN_STATUS=$(curl -s -X GET "https://backend.postsiva.com/linkedin/get-token" \
  -H "Authorization: Bearer $TOKEN")

echo "$TOKEN_STATUS" | jq '.'

# Check if LinkedIn is already connected
LINKEDIN_CONNECTED=$(echo $TOKEN_STATUS | jq -r '.success')
LINKEDIN_USER_ID=$(echo $TOKEN_STATUS | jq -r '.data.linkedin_user_id // "null"')

echo ""
if [ "$LINKEDIN_CONNECTED" = "true" ] && [ "$LINKEDIN_USER_ID" != "null" ]; then
  echo "✅ LinkedIn OAuth Status: CONNECTED"
  echo "👤 LinkedIn User ID: $LINKEDIN_USER_ID"
  echo "🔑 Access Token: $(echo $TOKEN_STATUS | jq -r '.data.access_token' | cut -c1-30)..."
  echo "⏰ Expires: $(echo $TOKEN_STATUS | jq -r '.data.expires_at')"
  
  echo ""
  echo "🔄 Step 4: Test token refresh..."
  REFRESH_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/refresh-token" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
  
  echo "$REFRESH_RESPONSE" | jq '.'
else
  echo "⚠️  LinkedIn OAuth Status: NOT CONNECTED"
  echo "📝 Next Steps:"
  echo "1. Open the LinkedIn OAuth URL in your browser"
  echo "2. Complete LinkedIn authorization"
  echo "3. The callback will be handled automatically"
fi

echo ""
echo "🏁 LinkedIn OAuth flow completed!"
```

## 🎯 Expected Responses

### Create LinkedIn Token Response:
```json
{
  "success": true,
  "message": "Browser opened for LinkedIn OAuth authentication",
  "data": {
    "success": true,
    "message": "Browser opened for LinkedIn OAuth authentication",
    "user_id": "656738e0-0fff-475b-8c0a-afe71a18df42",
    "auth_url": "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=771blxuw1mw5ls&redirect_uri=https%3A%2F%2Fbackend.postsiva.com%2Flinkedin%2Foauth%2Fcallback&scope=openid+profile+email+w_member_social&state=user_656738e0-0fff-475b-8c0a-afe71a18df42",
    "instructions": "Complete authentication in browser, then check /oauth/callback for the authorization code"
  }
}
```

### Get LinkedIn Token Response (Connected):
```json
{
  "success": true,
  "message": "LinkedIn token retrieved successfully",
  "data": {
    "user_id": "656738e0-0fff-475b-8c0a-afe71a18df42",
    "access_token": "AQWC94T7M9ag_OFtoiL_uo51RIXRriaADIBOTohNauDEnmqaMN6JxpNTv22dQk3lTE0J64RYGdh33ltHgu-AyTM4jgJu9u2oGHqJKykhQqRWBsiPffk6RKNG6rPEff4MpEXOsGQ6a5ARb3Tpun2y-XgXbG4hxajxjoF84ham8Zq0ifSifJBKSTfaQdl8ocFk2fmzchVNNciOfchQWRRufpx5FKG40ooAVdmLUpUkWNdZiM8bWZOu5agwKDrREtiDIXrYLrzx28oyIgs7c29vwZgnrdXDqw0NL_dJH3wB9Gu9oF97-JNnY8ahMYT_YyZXPrMqqVEzkb9wqHJB0flplyfM1-ZQ9g",
    "token_type": "Bearer",
    "scope": "email,openid,profile,w_member_social",
    "expires_at": "2025-12-22T14:58:18.075938",
    "created_at": "2025-10-23T14:58:19",
    "id": 13,
    "refresh_token": "AQUFIMUX54LZliBsow382Y5DSUtujo5gK0ttWRWrfEX7koILmToTPFucpDMj4jRrYGmZmY_p-Ph9cAC3BbZb5BieSTzfgEfaTqCQMccLzRFpdQhBo91eUBzmcv_ARmC11jIn6DujVsZpxWG8u0xE3-_tarrS_igauFc_MdlQwRKnd7XzGO4nVwCfZ8qX5W0nYfXfJeDoLUV3Tr9rxHXIcsYDfMp_St3JDdex25XgtfBpjDrJwCL-fYRLEQMJpF-d39aWBE4enT6iqbpDdxkmSbGSUy3tqZ1Dzx9hsiC0sBYSdGUAStqfoHlUXzBZyvpK0LkA3iieTxDABAtO2kk0m3bMQaynOw",
    "expires_in": 5183999,
    "linkedin_user_id": "1IvgXHcI3v",
    "updated_at": null
  }
}
```

### Refresh Token Response:
```json
{
  "success": true,
  "message": "LinkedIn token refreshed successfully",
  "data": {
    "access_token": "AQWC94T7M9ag_OFtoiL_uo51RIXRriaADIBOTohNauDEnmqaMN6JxpNTv22dQk3lTE0J64RYGdh33ltHgu-AyTM4jgJu9u2oGHqJKykhQqRWBsiPffk6RKNG6rPEff4MpEXOsGQ6a5ARb3Tpun2y-XgXbG4hxajxjoF84ham8Zq0ifSifJBKSTfaQdl8ocFk2fmzchVNNciOfchQWRRufpx5FKG40ooAVdmLUpUkWNdZiM8bWZOu5agwKDrREtiDIXrYLrzx28oyIgs7c29vwZgnrdXDqw0NL_dJH3wB9Gu9oF97-JNnY8ahMYT_YyZXPrMqqVEzkb9wqHJB0flplyfM1-ZQ9g",
    "refresh_token": "AQUFIMUX54LZliBsow382Y5DSUtujo5gK0ttWRWrfEX7koILmToTPFucpDMj4jRrYGmZmY_p-Ph9cAC3BbZb5BieSTzfgEfaTqCQMccLzRFpdQhBo91eUBzmcv_ARmC11jIn6DujVsZpxWG8u0xE3-_tarrS_igauFc_MdlQwRKnd7XzGO4nVwCfZ8qX5W0nYfXfJeDoLUV3Tr9rxHXIcsYDfMp_St3JDdex25XgtfBpjDrJwCL-fYRLEQMJpF-d39aWBE4enT6iqbpDdxkmSbGSUy3tqZ1Dzx9hsiC0sBYSdGUAStqfoHlUXzBZyvpK0LkA3iieTxDABAtO2kk0m3bMQaynOw",
    "token_type": "Bearer",
    "expires_in": 5183999,
    "scope": "email,openid,profile,w_member_social",
    "expires_at": "2025-12-22T14:58:18.075938",
    "linkedin_user_id": "1IvgXHcI3v",
    "user_id": "656738e0-0fff-475b-8c0a-afe71a18df42"
  }
}
```

## 🔄 OAuth Flow Implementation

### Complete LinkedIn OAuth Flow:

**1. User clicks "Connect LinkedIn"**
```javascript
// Frontend calls create-token endpoint
const response = await fetch('https://backend.postsiva.com/linkedin/create-token', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await response.json();
// Redirect to data.auth_url
window.location.href = data.auth_url;
```

**2. Backend returns LinkedIn OAuth URL**
```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=771blxuw1mw5ls&redirect_uri=https%3A%2F%2Fbackend.postsiva.com%2Flinkedin%2Foauth%2Fcallback&scope=openid+profile+email+w_member_social&state=user_656738e0-0fff-475b-8c0a-afe71a18df42
```

**3. User authorizes on LinkedIn**
- User logs in to LinkedIn
- Grants permissions (profile, email, posting)
- LinkedIn redirects back to callback

**4. LinkedIn redirects to callback with code**
```
https://backend.postsiva.com/linkedin/oauth/callback?code=AUTHORIZATION_CODE&state=user_656738e0-0fff-475b-8c0a-afe71a18df42
```

**5. Backend exchanges code for tokens**
- API automatically handles token exchange
- Stores LinkedIn OAuth tokens
- Returns success status

### Frontend Integration:

```javascript
// Check LinkedIn connection status
async function checkLinkedInStatus() {
  const response = await fetch('https://backend.postsiva.com/linkedin/get-token', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();
  return result.success && result.data.linkedin_user_id;
}

// Connect to LinkedIn
async function connectLinkedIn() {
  const response = await fetch('https://backend.postsiva.com/linkedin/create-token', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { data } = await response.json();
  
  // Open LinkedIn OAuth in popup or redirect
  window.open(data.auth_url, 'linkedin-oauth', 'width=500,height=600');
  // OR full page redirect
  // window.location.href = data.auth_url;
}

// Refresh LinkedIn token
async function refreshLinkedInToken() {
  const response = await fetch('https://backend.postsiva.com/linkedin/refresh-token', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// Disconnect LinkedIn
async function disconnectLinkedIn() {
  const response = await fetch('https://backend.postsiva.com/linkedin/delete-token', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

## 🛠️ Integration Notes

1. **LinkedIn OAuth is Pre-configured**: Client ID `771blxuw1mw5ls`
2. **Scopes Available**: `openid profile email w_member_social` - allows posting
3. **Token Management**: API handles refresh tokens automatically
4. **Callback Handled**: API processes OAuth callback server-side
5. **State Parameter**: Includes user ID for security

## 🔐 Security Considerations

- OAuth flow requires valid PostSiva API token
- LinkedIn OAuth is configured server-side
- State parameter prevents CSRF attacks
- Tokens are stored securely on backend
- Refresh tokens allow long-term access

## 🎯 For Cursor Implementation

Use these endpoints to:
1. **Check Connection Status** before showing connect button
2. **Initiate OAuth Flow** with create-token endpoint
3. **Handle Token Refresh** automatically
4. **Manage Disconnection** when user wants to unlink
5. **Post to LinkedIn** using the stored tokens
