# Complete API Curl Commands Summary

## 🎯 Quick Reference

All curl commands for PostSiva LinkedIn Integration API.

**Base URL**: `https://backend.postsiva.com`  
**Test Credentials**: `test@gmail.com` / `123123123`

---

## 1️⃣ Authentication

### Login
```bash
curl -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com", "password": "123123123"}'
```

### Signup
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

### Get Current User
```bash
curl -X GET "https://backend.postsiva.com/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 2️⃣ Google OAuth

### Get OAuth URL
```bash
curl -X GET "https://backend.postsiva.com/auth/google/debug" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Status
```bash
curl -X GET "https://backend.postsiva.com/auth/google/status" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Login (Redirects to Google)
```bash
curl -I -X GET "https://backend.postsiva.com/auth/google/login" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3️⃣ LinkedIn OAuth

### Create Token (Get OAuth URL)
```bash
curl -X POST "https://backend.postsiva.com/linkedin/create-token" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Token Status
```bash
curl -X GET "https://backend.postsiva.com/linkedin/get-token" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Refresh Token
```bash
curl -X POST "https://backend.postsiva.com/linkedin/refresh-token" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Token
```bash
curl -X DELETE "https://backend.postsiva.com/linkedin/delete-token" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4️⃣ LinkedIn Profile

### Get Profile
```bash
curl -X GET "https://backend.postsiva.com/linkedin/user-profile/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 5️⃣ LinkedIn Posts

### Create Text Post
```bash
curl -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello LinkedIn!"}'
```

### Get Text Posts
```bash
curl -X GET "https://backend.postsiva.com/linkedin/text-post/my-posts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Image Post
```bash
curl -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Check this out!",
    "image_url": "https://example.com/image.jpg"
  }'
```

### Create Multi-Image Post
```bash
curl -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Multiple images!",
    "image_urls": ["url1.jpg", "url2.jpg"]
  }'
```

### Get Image Posts
```bash
curl -X GET "https://backend.postsiva.com/linkedin/image-post/my-posts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Multi-Image Posts
```bash
curl -X GET "https://backend.postsiva.com/linkedin/image-post/my-multi-posts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Video Post
```bash
curl -X POST "https://backend.postsiva.com/linkedin/video-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Watch this!",
    "title": "My Video",
    "video_url": "https://example.com/video.mp4"
  }'
```

### Get Video Posts
```bash
curl -X GET "https://backend.postsiva.com/linkedin/video-post/my-posts" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6️⃣ Media Upload

### Upload File
```bash
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.jpg"
```

### Get All Media
```bash
curl -X GET "https://backend.postsiva.com/media/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Media by ID
```bash
curl -X GET "https://backend.postsiva.com/media/MEDIA_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Media
```bash
curl -X DELETE "https://backend.postsiva.com/media/MEDIA_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Quick Test Script

```bash
#!/bin/bash

# Login
TOKEN=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"123123123"}' \
  | jq -r '.access_token')

echo "Token: $TOKEN"

# Get Profile
curl -s -X GET "https://backend.postsiva.com/linkedin/user-profile/" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Create Post
curl -s -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from API!"}' | jq '.'

# Get Posts
curl -s -X GET "https://backend.postsiva.com/linkedin/text-post/my-posts" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 📊 Response Examples

### Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "656738e0-0fff-475b-8c0a-afe71a18df42",
    "email": "test@gmail.com",
    "full_name": "Uzair Yasin"
  }
}
```

### Profile Response
```json
{
  "success": true,
  "profile": {
    "linkedin_user_id": "1IvgXHcI3v",
    "name": "For Python",
    "email": "pythonfor18@gmail.com",
    "picture": "https://media.licdn.com/..."
  }
}
```

### Post Creation Response
```json
{
  "success": true,
  "message": "Post created successfully on LinkedIn",
  "post": {
    "post_id": "urn:li:share:7408075404558770176",
    "text": "Hello from API!",
    "visibility": "PUBLIC",
    "post_url": "https://www.linkedin.com/feed/update/...",
    "posted_at": "2025-12-20T09:26:52"
  }
}
```

---

## ⚠️ Important Notes

1. **Field Names**: Use `text` (not `content`) for posts
2. **Video Posts**: Require both `text` and `title`
3. **Token Expiry**: Check `expires_at` field
4. **LinkedIn OAuth**: Separate from PostSiva auth
5. **Media Upload**: Use `multipart/form-data`

---

## 🎯 For Cursor Implementation

All endpoints tested and working. Use these exact field names and structures in your implementation.
