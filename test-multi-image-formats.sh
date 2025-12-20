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

# Create test images
echo "📷 Step 2: Creating test images..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > image1.png
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" | base64 -d > image2.png

# Upload images
IMAGE1_ID=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@image1.png" \
  -F "media_type=image" | jq -r '.media_id')

IMAGE2_ID=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@image2.png" \
  -F "media_type=image" | jq -r '.media_id')

echo "Images uploaded: $IMAGE1_ID, $IMAGE2_ID"
echo ""

# Test different formats for multiple image_ids

echo "🧪 Test 1: Multiple -F image_ids (current method)..."
TEST1=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_ids=$IMAGE1_ID" \
  -F "image_ids=$IMAGE2_ID" \
  -F "text=Test 1: Multiple -F flags" \
  -F "visibility=PUBLIC")

echo "Test 1 Response:"
echo "$TEST1" | jq '.'
echo ""

echo "🧪 Test 2: Comma-separated image_ids..."
TEST2=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_ids=$IMAGE1_ID,$IMAGE2_ID" \
  -F "text=Test 2: Comma-separated" \
  -F "visibility=PUBLIC")

echo "Test 2 Response:"
echo "$TEST2" | jq '.'
echo ""

echo "🧪 Test 3: Array format with brackets..."
TEST3=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_ids[]=$IMAGE1_ID" \
  -F "image_ids[]=$IMAGE2_ID" \
  -F "text=Test 3: Array brackets" \
  -F "visibility=PUBLIC")

echo "Test 3 Response:"
echo "$TEST3" | jq '.'
echo ""

echo "🧪 Test 4: JSON format in form data..."
TEST4=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_ids=[\"$IMAGE1_ID\",\"$IMAGE2_ID\"]" \
  -F "text=Test 4: JSON array" \
  -F "visibility=PUBLIC")

echo "Test 4 Response:"
echo "$TEST4" | jq '.'
echo ""

# Let's also check what the OpenAPI schema says about this endpoint
echo "📋 Let's check if there are any clues in the error messages..."

# Test with verbose curl to see what's being sent
echo "🔍 Test 5: Verbose curl to see request format..."
curl -v -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_ids=$IMAGE1_ID" \
  -F "image_ids=$IMAGE2_ID" \
  -F "text=Verbose test" \
  -F "visibility=PUBLIC" 2>&1 | grep -E "(> |< |image_ids)"

echo ""
echo "🏁 Multi-image format testing completed!"

# Cleanup
rm -f image1.png image2.png
