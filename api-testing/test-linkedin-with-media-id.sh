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
echo "📷 Step 2: Upload test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test_image.png

IMAGE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test_image.png" \
  -F "media_type=image")

IMAGE_ID=$(echo $IMAGE_RESPONSE | jq -r '.media_id')
IMAGE_URL=$(echo $IMAGE_RESPONSE | jq -r '.public_url')

echo "Image uploaded - ID: $IMAGE_ID"
echo ""

# Test 1: LinkedIn image post with image_id
echo "📝 Step 3: Test LinkedIn image post with image_id..."
POST_RESPONSE1=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"Test post with image_id - $(date)\",
    \"image_id\": \"$IMAGE_ID\"
  }")

echo "LinkedIn Image Post (image_id) Response:"
echo "$POST_RESPONSE1" | jq '.'
echo ""

# Test 2: LinkedIn image post with image_url (original method)
echo "📝 Step 4: Test LinkedIn image post with image_url..."
POST_RESPONSE2=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"Test post with image_url - $(date)\",
    \"image_url\": \"$IMAGE_URL\"
  }")

echo "LinkedIn Image Post (image_url) Response:"
echo "$POST_RESPONSE2" | jq '.'
echo ""

# Test 3: Upload video and test video post
echo "🎥 Step 5: Upload test video..."
echo "UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=" | base64 -d > test_video.webp

VIDEO_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test_video.webp" \
  -F "media_type=video")

VIDEO_ID=$(echo $VIDEO_RESPONSE | jq -r '.media_id')
VIDEO_URL=$(echo $VIDEO_RESPONSE | jq -r '.public_url')

echo "Video uploaded - ID: $VIDEO_ID"
echo ""

# Test 4: LinkedIn video post with video_id
echo "📝 Step 6: Test LinkedIn video post with video_id..."
VIDEO_POST_RESPONSE1=$(curl -s -X POST "https://backend.postsiva.com/linkedin/video-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"Test video post with video_id - $(date)\",
    \"title\": \"Test Video\",
    \"video_id\": \"$VIDEO_ID\"
  }")

echo "LinkedIn Video Post (video_id) Response:"
echo "$VIDEO_POST_RESPONSE1" | jq '.'
echo ""

# Test 5: LinkedIn video post with video_url (original method)
echo "📝 Step 7: Test LinkedIn video post with video_url..."
VIDEO_POST_RESPONSE2=$(curl -s -X POST "https://backend.postsiva.com/linkedin/video-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"Test video post with video_url - $(date)\",
    \"title\": \"Test Video URL\",
    \"video_url\": \"$VIDEO_URL\"
  }")

echo "LinkedIn Video Post (video_url) Response:"
echo "$VIDEO_POST_RESPONSE2" | jq '.'

echo ""
echo "🏁 LinkedIn media posting test completed!"

# Cleanup
rm -f test_image.png test_video.webp
