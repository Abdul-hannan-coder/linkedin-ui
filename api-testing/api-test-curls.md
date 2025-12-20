# API Test Curls for PostSiva LinkedIn Integration

## Base Configuration
- **Base URL**: `https://backend.postsiva.com`
- **Test Credentials**: `test@gmail.com` / `123123123`

## 1. Authentication

### Login (Get Access Token)
```bash
curl -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }'
```

### Get Current User Profile
```bash
curl -X GET "https://backend.postsiva.com/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### User Signup (Create New Account)
```bash
curl -X POST "https://backend.postsiva.com/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser123",
    "full_name": "New User",
    "password": "password123"
  }'
```

## 2. LinkedIn OAuth Management

### Create LinkedIn Token
```bash
curl -X POST "https://backend.postsiva.com/linkedin/create-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Get LinkedIn Token Status
```bash
curl -X GET "https://backend.postsiva.com/linkedin/get-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Refresh LinkedIn Token
```bash
curl -X POST "https://backend.postsiva.com/linkedin/refresh-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Delete LinkedIn Token
```bash
curl -X DELETE "https://backend.postsiva.com/linkedin/delete-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 3. LinkedIn Profile

### Get LinkedIn User Profile
```bash
curl -X GET "https://backend.postsiva.com/linkedin/user-profile/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 4. LinkedIn Text Posts

### Create Text Post
```bash
curl -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello LinkedIn! This is my first post from the API."
  }'
```

### Get My Text Posts
```bash
curl -X GET "https://backend.postsiva.com/linkedin/text-post/my-posts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 5. LinkedIn Image Posts

### Create Single Image Post
```bash
curl -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Check out this amazing image!",
    "image_url": "https://example.com/image.jpg"
  }'
```

### Create Multi-Image Post
```bash
curl -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Multiple images in one post!",
    "image_urls": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg"
    ]
  }'
```

### Get My Image Posts
```bash
curl -X GET "https://backend.postsiva.com/linkedin/image-post/my-posts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get My Multi-Image Posts
```bash
curl -X GET "https://backend.postsiva.com/linkedin/image-post/my-multi-posts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 6. LinkedIn Video Posts

### Create Video Post
```bash
curl -X POST "https://backend.postsiva.com/linkedin/video-post/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Sharing an awesome video!",
    "title": "My Video Title",
    "video_url": "https://example.com/video.mp4"
  }'
```

### Get My Video Posts
```bash
curl -X GET "https://backend.postsiva.com/linkedin/video-post/my-posts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 7. Media Upload

### Upload File
```bash
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -F "file=@/path/to/your/file.jpg"
```

### Get All Media Files
```bash
curl -X GET "https://backend.postsiva.com/media/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Get Specific Media File
```bash
curl -X GET "https://backend.postsiva.com/media/MEDIA_ID_HERE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Delete Media File
```bash
curl -X DELETE "https://backend.postsiva.com/media/MEDIA_ID_HERE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 8. Health Check

### API Health Status
```bash
curl -X GET "https://backend.postsiva.com/health"
```

## Quick Test Script

Save this as `test-api.sh` and run it:

```bash
#!/bin/bash

# Step 1: Login and get token
echo "🔐 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo "✅ Login successful! Token: ${TOKEN:0:20}..."

# Step 2: Get user profile
echo "👤 Getting user profile..."
curl -s -X GET "https://backend.postsiva.com/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 3: Create a text post
echo "📝 Creating text post..."
curl -s -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from API test! 🚀"
  }' | jq '.'

# Step 4: Get my posts
echo "📋 Getting my posts..."
curl -s -X GET "https://backend.postsiva.com/linkedin/text-post/my-posts" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo "🏁 Test completed!"
```

## Usage Instructions

1. **Get Access Token**: Run the login curl first to get your access token
2. **Replace Token**: Copy the `access_token` from the response and replace `YOUR_ACCESS_TOKEN_HERE` in other curls
3. **Test Endpoints**: Run the specific curls you need to test
4. **Upload Files**: For file uploads, replace `/path/to/your/file.jpg` with actual file path

## Expected Response Format

### Login Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsImV4cCI6MTc2NjgyNzU5M30.46Vp7tCa3u9X5VM0r4O9T91Mwg4tEC4OW8luxk2GATY",
  "token_type": "bearer",
  "user": {
    "email": "test@gmail.com",
    "username": "test@gmail.con",
    "full_name": "Uzair Yasin",
    "is_active": true,
    "created_at": "2025-09-05T19:02:14",
    "updated_at": "2025-09-05T19:02:14",
    "id": "656738e0-0fff-475b-8c0a-afe71a18df42"
  }
}
```

### Get User Profile Response:
```json
{
  "email": "test@gmail.com",
  "username": "test@gmail.con",
  "full_name": "Uzair Yasin",
  "is_active": true,
  "created_at": "2025-09-05T19:02:14",
  "updated_at": "2025-09-05T19:02:14",
  "id": "656738e0-0fff-475b-8c0a-afe71a18df42"
}
```

### Create Text Post Response:
```json
{
  "success": true,
  "message": "Post created successfully on LinkedIn",
  "post": {
    "post_id": "urn:li:share:7408075404558770176",
    "text": "Hello from API test! 🚀",
    "visibility": "PUBLIC",
    "post_url": "https://www.linkedin.com/feed/update/urn:li:share:7408075404558770176",
    "posted_at": "2025-12-20T09:26:52"
  },
  "error": null
}
```

### Get Text Posts Response:
```json
{
  "success": true,
  "message": "Retrieved 2 posts",
  "posts": [
    {
      "post_id": "urn:li:share:7408071841010839552",
      "text": "test post",
      "visibility": "PUBLIC",
      "post_url": "https://www.linkedin.com/feed/update/urn:li:share:7408071841010839552",
      "status": "published",
      "posted_at": "2025-12-20T09:12:42"
    }
  ],
  "total": 2,
  "error": null
}
```

### Get Image Posts Response:
```json
{
  "success": true,
  "message": "Retrieved 2 image posts",
  "posts": [
    {
      "post_id": "urn:li:share:7408072022599102464",
      "text": "test post 2",
      "visibility": "PUBLIC",
      "image_urn": "urn:li:digitalmediaAsset:D4E22AQG3Jbf_hnJ26Q",
      "image_filename": "694668aba6564_1766221995.jpg",
      "image_size": 53500,
      "post_url": "https://www.linkedin.com/feed/update/urn:li:share:7408072022599102464",
      "status": "published",
      "posted_at": "2025-12-20T09:13:26"
    }
  ],
  "total": 2,
  "error": null
}
```

### Get LinkedIn Token Response:
```json
{
  "success": true,
  "message": "LinkedIn token retrieved successfully",
  "data": {
    "user_id": "656738e0-0fff-475b-8c0a-afe71a18df42",
    "access_token": "AQWC94T7M9ag_OFtoiL...",
    "token_type": "Bearer",
    "scope": "email,openid,profile,w_member_social",
    "expires_at": "2025-12-22T14:58:18.075938",
    "linkedin_user_id": "1IvgXHcI3v",
    "expires_in": 5183999
  }
}
```

## ⚠️ Important Notes

1. **Field Names**: Use `text` instead of `content` for post creation
2. **Video Posts**: Require both `text` and `title` fields
3. **Token Expiry**: Access tokens expire, check `expires_at` field
4. **LinkedIn OAuth**: Separate LinkedIn access token is stored and managed by the API
