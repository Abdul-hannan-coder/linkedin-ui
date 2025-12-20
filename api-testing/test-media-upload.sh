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
convert -size 100x100 xc:blue test_image.jpg 2>/dev/null || {
  # Fallback if ImageMagick not available
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test_image.png
}

echo "📤 Step 3: Upload test image..."
if [ -f "test_image.jpg" ]; then
  IMAGE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@test_image.jpg")
else
  IMAGE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@test_image.png")
fi

echo "Image Upload Response:"
echo "$IMAGE_RESPONSE" | jq '.'

# Extract image details
IMAGE_ID=$(echo $IMAGE_RESPONSE | jq -r '.id // .data.id // "null"')
IMAGE_URL=$(echo $IMAGE_RESPONSE | jq -r '.url // .data.url // "null"')

echo ""
echo "📊 Image Upload Summary:"
echo "Image ID: $IMAGE_ID"
echo "Image URL: $IMAGE_URL"
echo ""

echo "📋 Step 4: Get all media files..."
MEDIA_LIST=$(curl -s -X GET "https://backend.postsiva.com/media/" \
  -H "Authorization: Bearer $TOKEN")

echo "Media List Response:"
echo "$MEDIA_LIST" | jq '.'

echo ""
echo "🏁 Media upload test completed!"

# Cleanup
rm -f test_image.jpg test_image.png
