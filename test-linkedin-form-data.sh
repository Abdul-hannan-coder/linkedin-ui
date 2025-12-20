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

# Upload test image
echo "📷 Step 2: Upload test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test_image.png

IMAGE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test_image.png" \
  -F "media_type=image")

IMAGE_ID=$(echo $IMAGE_RESPONSE | jq -r '.media_id')

echo "Image uploaded - ID: $IMAGE_ID"
echo ""

# Test LinkedIn image post with form data
echo "📝 Step 3: Test LinkedIn image post with form data..."
POST_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_id=$IMAGE_ID" \
  -F "text=Test post with form data - $(date)" \
  -F "visibility=PUBLIC")

echo "LinkedIn Image Post Response:"
echo "$POST_RESPONSE" | jq '.'
echo ""

# Upload test video
echo "🎥 Step 4: Upload test video..."
echo "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=" | base64 -d > test_video.webp

VIDEO_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test_video.webp" \
  -F "media_type=video")

VIDEO_ID=$(echo $VIDEO_RESPONSE | jq -r '.media_id')

echo "Video uploaded - ID: $VIDEO_ID"
echo ""

# Test LinkedIn video post with form data
echo "📝 Step 5: Test LinkedIn video post with form data..."
VIDEO_POST_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/video-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "video_id=$VIDEO_ID" \
  -F "text=Test video post with form data - $(date)" \
  -F "title=Test Video" \
  -F "visibility=PUBLIC")

echo "LinkedIn Video Post Response:"
echo "$VIDEO_POST_RESPONSE" | jq '.'

echo ""
echo "🏁 LinkedIn form data posting test completed!"

# Cleanup
rm -f test_image.png test_video.webp
