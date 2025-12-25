# Google OAuth Authentication Flow Diagram

## Complete Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GOOGLE OAUTH FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   FRONTEND   │
│   (User)     │
└──────┬───────┘
       │
       │ 1. User clicks "Continue with Google"
       │    Frontend calls:
       │    GET /auth/google/login?redirect_uri=/dashboard&origin=https://myapp.com
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND: /auth/google/login                         │
│                                                                              │
│  Input from Frontend:                                                       │
│  • redirect_uri: "/dashboard" (path where user should land after login)    │
│  • origin: "https://myapp.com" (frontend domain)                            │
│                                                                              │
│  Backend Processing:                                                        │
│  1. Sanitize redirect_uri (extract path if full URL provided)              │
│  2. Normalize origin (add https:// if missing)                               │
│  3. Create state object:                                                    │
│     {                                                                        │
│       "redirect_uri": "/dashboard",                                          │
│       "origin": "https://myapp.com"                                         │
│     }                                                                        │
│  4. Encode state as base64 JSON                                             │
│  5. Generate Google OAuth URL with state                                    │
│                                                                              │
└──────┬──────────────────────────────────────────────────────────────────────┘
       │
       │ 2. Redirect Response (307)
       │    Location: https://accounts.google.com/o/oauth2/auth?...
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE OAUTH CONSENT SCREEN                         │
│                                                                              │
│  User sees Google login page                                                │
│  User grants permission                                                     │
│                                                                              │
└──────┬──────────────────────────────────────────────────────────────────────┘
       │
       │ 3. Google redirects back
       │    GET /auth/google/callback?code=AUTH_CODE&state=ENCODED_STATE
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND: /auth/google/callback                         │
│                                                                              │
│  Step 1: Validate Input                                                     │
│  • Check for error parameter (if present, show error page)                  │
│  • Verify authorization code exists                                          │
│                                                                              │
│  Step 2: Decode State                                                       │
│  • Decode base64 state parameter                                            │
│  • Extract redirect_uri and origin from state                               │
│  • Fallback to FRONTEND_URL from settings if state missing                 │
│                                                                              │
│  Step 3: Exchange Code for Token                                            │
│  • Call: exchange_code_for_token(code)                                      │
│  • POST to: https://oauth2.googleapis.com/token                             │
│  • Returns: { access_token, refresh_token, expires_in }                     │
│                                                                              │
│  Step 4: Get User Info from Google                                         │
│  • Call: get_google_user_info(access_token)                                 │
│  • GET: https://www.googleapis.com/oauth2/v2/userinfo                       │
│  • Returns: { email, name, picture, id }                                    │
│                                                                              │
│  Step 5: Find or Create User                                                │
│  • Check database for user with email = google_user.email                  │
│  • If user exists:                                                          │
│    - Update email if different                                              │
│    - Update profile picture if available                                    │
│    - Return existing user                                                   │
│  • If user doesn't exist:                                                   │
│    - Generate username from email (e.g., "john.doe" from "john.doe@gmail") │
│    - Create new UserSignUp:                                                 │
│      {                                                                       │
│        id: UUID,                                                            │
│        email: google_user.email.lower(),                                    │
│        username: generated_username,                                        │
│        full_name: google_user.name,                                         │
│        password: "" (empty for Google users),                               │
│        is_active: true                                                       │
│      }                                                                       │
│    - Save to database                                                       │
│                                                                              │
│  Step 6: Create JWT Token                                                   │
│  • Call: create_access_token(data={"sub": user.email})                      │
│  • Generate JWT with:                                                       │
│    - Subject (sub): user email                                              │
│    - Expiration: 7 days from now                                            │
│    - Signed with SECRET_KEY                                                 │
│  • Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."                       │
│                                                                              │
│  Step 7: Build Redirect URL                                                 │
│  • Normalize origin (ensure https:// protocol)                              │
│  • Ensure redirect_path starts with "/"                                     │
│  • Build final URL:                                                          │
│    {origin}{redirect_path}?token={JWT}&user={username}&email={email}&success=true
│                                                                              │
│  Example:                                                                   │
│  https://myapp.com/dashboard?token=eyJ...&user=john.doe&email=john@gmail.com&success=true
│                                                                              │
└──────┬──────────────────────────────────────────────────────────────────────┘
       │
       │ 4. Redirect Response (307)
       │    Location: https://myapp.com/dashboard?token=...&user=...&email=...&success=true
       │
       ▼
┌──────────────┐
│   FRONTEND   │
│   (User)     │
└──────────────┘
       │
       │ 5. Frontend receives:
       │    - JWT token in URL query parameter
       │    - User info (username, email)
       │    - success=true flag
       │
       │    Frontend should:
       │    - Extract token from URL
       │    - Store token in localStorage/sessionStorage
       │    - Use token for authenticated API requests
       │    - Redirect user to dashboard (or specified page)
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER IS NOW AUTHENTICATED                           │
│                                                                              │
│  • User account created/updated in database                                 │
│  • JWT token generated and sent to frontend                                 │
│  • Frontend can use token for API requests                                  │
│  • Token valid for 7 days                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Step-by-Step Breakdown

### **Step 1: Frontend Initiates Login**

**Frontend Code Example:**
```javascript
// User clicks "Continue with Google" button
const redirectToGoogleLogin = () => {
  const redirectUri = '/dashboard';  // Where to redirect after login
  const origin = 'https://myapp.com';  // Frontend domain
  
  window.location.href = 
    `/auth/google/login?redirect_uri=${redirectUri}&origin=${origin}`;
};
```

**What Frontend Provides:**
- `redirect_uri`: Path on frontend where user should land (e.g., `/dashboard`, `/profile`)
- `origin`: Frontend domain (e.g., `https://myapp.com`)

---

### **Step 2: Backend Processes Login Request**

**Backend Endpoint:** `GET /auth/google/login`

**Backend Actions:**
1. **Sanitize `redirect_uri`**: If full URL provided, extract only the path
2. **Normalize `origin`**: Add `https://` if protocol missing
3. **Create state object**:
   ```json
   {
     "redirect_uri": "/dashboard",
     "origin": "https://myapp.com"
   }
   ```
4. **Encode state**: Base64 encode the JSON
5. **Generate Google OAuth URL**: Include state in OAuth request

**Response:** HTTP 307 Redirect to Google OAuth consent screen

---

### **Step 3: Google OAuth Consent**

**User Actions:**
- User sees Google login page
- User enters credentials
- User grants permission to your app

**Google Response:** Redirects back to your callback URL with:
- `code`: Authorization code (temporary, one-time use)
- `state`: The encoded state you sent (for security/validation)

---

### **Step 4: Backend Handles Callback**

**Backend Endpoint:** `GET /auth/google/callback?code=...&state=...`

**Backend Processing Flow:**

#### **4.1 Validate Input**
- Check for `error` parameter → Show error page if present
- Verify `code` exists → Return 400 if missing

#### **4.2 Decode State**
- Decode base64 `state` parameter
- Extract `redirect_uri` and `origin`
- Fallback to `FRONTEND_URL` from settings if state missing

#### **4.3 Exchange Code for Access Token**
```python
# POST to Google Token Endpoint
POST https://oauth2.googleapis.com/token
{
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://backend.postsiva.com/auth/google/callback",
  "grant_type": "authorization_code"
}

# Response:
{
  "access_token": "ya29.a0AfH6...",
  "refresh_token": "1//0g...",
  "expires_in": 3599,
  "token_type": "Bearer"
}
```

#### **4.4 Get User Info from Google**
```python
# GET from Google UserInfo Endpoint
GET https://www.googleapis.com/oauth2/v2/userinfo
Headers: Authorization: Bearer {access_token}

# Response:
{
  "email": "john.doe@gmail.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "id": "123456789"
}
```

#### **4.5 Find or Create User in Database**

**If User Exists:**
- Find user by email: `SELECT * FROM users WHERE email = 'john.doe@gmail.com'`
- Update email if different
- Update profile picture if available
- Return existing user

**If User Doesn't Exist:**
- Generate username from email (e.g., `john.doe` from `john.doe@gmail.com`)
- Create new user:
  ```python
  UserSignUp(
    id=UUID(),
    email="john.doe@gmail.com",
    username="john.doe",
    full_name="John Doe",
    password="",  # Empty for Google users
    is_active=True
  )
  ```
- Save to database

#### **4.6 Create JWT Token**
```python
# Generate JWT
token_payload = {
  "sub": "john.doe@gmail.com",  # Subject (user email)
  "exp": datetime.now() + timedelta(days=7)  # Expires in 7 days
}

jwt_token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
# Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### **4.7 Build Final Redirect URL**
```python
# Normalize origin
frontend_origin = "https://myapp.com"  # Ensure has protocol
redirect_path = "/dashboard"  # Ensure starts with /

# Build final URL
redirect_url = f"{frontend_origin}{redirect_path}?token={jwt_token}&user={username}&email={email}&success=true"

# Example result:
# https://myapp.com/dashboard?token=eyJ...&user=john.doe&email=john.doe@gmail.com&success=true
```

**Response:** HTTP 307 Redirect to frontend URL with token

---

### **Step 5: Frontend Receives Token**

**Frontend Receives:**
```
https://myapp.com/dashboard?token=eyJ...&user=john.doe&email=john.doe@gmail.com&success=true
```

**Frontend Should:**
1. Extract token from URL query parameter
2. Store token securely (localStorage/sessionStorage)
3. Remove token from URL (for security)
4. Use token in Authorization header for API requests:
   ```
   Authorization: Bearer eyJ...
   ```
5. Redirect user to dashboard

**Frontend Code Example:**
```javascript
// On callback page
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const user = urlParams.get('user');
const email = urlParams.get('email');

if (token && urlParams.get('success') === 'true') {
  // Store token
  localStorage.setItem('auth_token', token);
  
  // Remove token from URL
  window.history.replaceState({}, document.title, '/dashboard');
  
  // Redirect to dashboard
  window.location.href = '/dashboard';
}
```

---

## Data Flow Summary

```
Frontend Input:
├── redirect_uri: "/dashboard" (path)
└── origin: "https://myapp.com" (domain)

Backend Processing:
├── State Creation: { redirect_uri, origin }
├── Google OAuth: Exchange code for token
├── User Info: Get email, name, picture from Google
├── Database: Find or create user
├── JWT Token: Generate token with user email
└── Redirect URL: {origin}{redirect_uri}?token={jwt}&user={username}&email={email}&success=true

Frontend Output:
├── JWT Token (for API authentication)
├── User Info (username, email)
└── Success flag
```

## Key Points

1. **`redirect_uri`** = Path on frontend (e.g., `/dashboard`) - NOT a full URL
2. **`origin`** = Frontend domain (e.g., `https://myapp.com`) - Should include protocol
3. **State Parameter** = Securely stores redirect info during OAuth flow
4. **JWT Token** = Valid for 7 days, contains user email as subject
5. **User Creation** = Automatic if user doesn't exist, updates if exists
6. **Final Redirect** = Frontend receives token in URL query parameter

## Security Considerations

- State parameter prevents CSRF attacks
- JWT tokens are signed with secret key
- Tokens expire after 7 days
- User emails are normalized to lowercase
- Origin validation ensures redirects go to correct domain

