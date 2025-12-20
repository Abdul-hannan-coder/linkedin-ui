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

# Create two different test images
echo "📷 Step 2: Creating two test images..."
# Image 1 - Blue square
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > image1.png

# Image 2 - Different content (red square)
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" | base64 -d > image2.png

echo "📤 Step 3: Upload first image..."
IMAGE1_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@image1.png" \
  -F "media_type=image")

IMAGE1_ID=$(echo $IMAGE1_RESPONSE | jq -r '.media_id')
IMAGE1_URL=$(echo $IMAGE1_RESPONSE | jq -r '.public_url')

echo "Image 1 uploaded:"
echo "  ID: $IMAGE1_ID"
echo "  URL: $IMAGE1_URL"
echo ""

echo "📤 Step 4: Upload second image..."
IMAGE2_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@image2.png" \
  -F "media_type=image")

IMAGE2_ID=$(echo $IMAGE2_RESPONSE | jq -r '.media_id')
IMAGE2_URL=$(echo $IMAGE2_RESPONSE | jq -r '.public_url')

echo "Image 2 uploaded:"
echo "  ID: $IMAGE2_ID"
echo "  URL: $IMAGE2_URL"
echo ""

echo "📝 Step 5: Create LinkedIn multi-image post..."
MULTI_POST_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_ids=$IMAGE1_ID" \
  -F "image_ids=$IMAGE2_ID" \
  -F "text=Testing multi-image post with two uploaded images! 📸📸 Posted at $(date)" \
  -F "visibility=PUBLIC")

echo "Multi-Image Post Response:"
echo "$MULTI_POST_RESPONSE" | jq '.'
echo ""

# Check if post was successful and get details
SUCCESS=$(echo $MULTI_POST_RESPONSE | jq -r '.success // false')

if [ "$SUCCESS" = "true" ]; then
  POST_ID=$(echo $MULTI_POST_RESPONSE | jq -r '.post.post_id // "null"')
  POST_URL=$(echo $MULTI_POST_RESPONSE | jq -r '.post.post_url // "null"')
  
  echo "✅ Multi-image post created successfully!"
  echo "📋 Post Details:"
  echo "  Post ID: $POST_ID"
  echo "  Post URL: $POST_URL"
  echo "  Images Used: $IMAGE1_ID, $IMAGE2_ID"
else
  echo "❌ Multi-image post failed!"
  ERROR=$(echo $MULTI_POST_RESPONSE | jq -r '.error // .message // "Unknown error"')
  echo "Error: $ERROR"
fi

echo ""
echo "📋 Step 6: Verify by getting recent posts..."
RECENT_POSTS=$(curl -s -X GET "https://backend.postsiva.com/linkedin/image-post/my-multi-posts" \
  -H "Authorization: Bearer $TOKEN")

echo "Recent Multi-Image Posts:"
echo "$RECENT_POSTS" | jq '.'

echo ""
echo "🏁 LinkedIn multi-image test completed!"

# Cleanup
rm -f image1.png image2.png
