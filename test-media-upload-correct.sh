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

# Create a test image file
echo "📷 Step 2: Creating test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test_image.png

echo "📤 Step 3: Upload test image with correct format..."
IMAGE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test_image.png" \
  -F "media_type=image")

echo "Image Upload Response:"
echo "$IMAGE_RESPONSE" | jq '.'

# Extract image details
IMAGE_ID=$(echo $IMAGE_RESPONSE | jq -r '.media_id // .id // "null"')
IMAGE_URL=$(echo $IMAGE_RESPONSE | jq -r '.public_url // .url // "null"')

echo ""
echo "📊 Image Upload Summary:"
echo "Image ID: $IMAGE_ID"
echo "Image URL: $IMAGE_URL"
echo ""

# Test creating a post with the uploaded image
if [ "$IMAGE_ID" != "null" ]; then
  echo "📝 Step 4: Test creating LinkedIn image post with media ID..."
  POST_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"text\": \"Test post with uploaded image - $(date)\",
      \"image_url\": \"$IMAGE_URL\"
    }")
  
  echo "LinkedIn Image Post Response:"
  echo "$POST_RESPONSE" | jq '.'
fi

echo ""
echo "🎥 Step 5: Test video upload format..."
# Create a minimal test video file (just for testing the API format)
echo "Creating minimal test video..."
echo "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=" | base64 -d > test_video.webp

VIDEO_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test_video.webp" \
  -F "media_type=video")

echo "Video Upload Response:"
echo "$VIDEO_RESPONSE" | jq '.'

VIDEO_ID=$(echo $VIDEO_RESPONSE | jq -r '.media_id // .id // "null"')
VIDEO_URL=$(echo $VIDEO_RESPONSE | jq -r '.public_url // .url // "null"')

echo ""
echo "📊 Video Upload Summary:"
echo "Video ID: $VIDEO_ID"
echo "Video URL: $VIDEO_URL"

echo ""
echo "🏁 Media upload test completed!"

# Cleanup
rm -f test_image.png test_video.webp
