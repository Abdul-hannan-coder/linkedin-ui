#!/bin/bash

VIDEO_FILE="/home/abdulhannan/Downloads/Videos/Just a !Meme 🧑_💻#programing #coding #softwaredeveloper #100dayproject #goals #coder #goal #dev.mp4"

echo "🎥 Video File Analysis:"
echo "File: $VIDEO_FILE"
echo "Size: $(ls -lh "$VIDEO_FILE" | awk '{print $5}')"
echo "Size in bytes: $(stat -c%s "$VIDEO_FILE")"
echo ""

# Check file type
echo "📋 File Details:"
file "$VIDEO_FILE"
echo ""

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

echo "📤 Step 2: Attempt to upload video..."
UPLOAD_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@$VIDEO_FILE" \
  -F "media_type=video" \
  --max-time 300)

echo "Upload Response:"
echo "$UPLOAD_RESPONSE" | jq '.'
echo ""

# Check if upload was successful
SUCCESS=$(echo $UPLOAD_RESPONSE | jq -r '.success // false')

if [ "$SUCCESS" = "true" ]; then
  echo "✅ Video uploaded successfully!"
  VIDEO_ID=$(echo $UPLOAD_RESPONSE | jq -r '.media_id')
  VIDEO_URL=$(echo $UPLOAD_RESPONSE | jq -r '.public_url')
  
  echo "Video ID: $VIDEO_ID"
  echo "Video URL: $VIDEO_URL"
  
  # Test creating a LinkedIn video post
  echo ""
  echo "📝 Step 3: Test creating LinkedIn video post..."
  POST_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/video-post/" \
    -H "Authorization: Bearer $TOKEN" \
    -F "video_id=$VIDEO_ID" \
    -F "text=Testing video upload with the meme video! 🎥 #programming #coding" \
    -F "title=Just a Programming Meme" \
    -F "visibility=PUBLIC")
  
  echo "LinkedIn Video Post Response:"
  echo "$POST_RESPONSE" | jq '.'
  
else
  echo "❌ Video upload failed!"
  ERROR=$(echo $UPLOAD_RESPONSE | jq -r '.error // .message // .detail // "Unknown error"')
  echo "Error: $ERROR"
  
  # Check if it's a size limit issue
  if echo "$ERROR" | grep -i "size\|large\|limit"; then
    echo ""
    echo "📊 Size Analysis:"
    echo "File size: $(stat -c%s "$VIDEO_FILE") bytes ($(ls -lh "$VIDEO_FILE" | awk '{print $5}'))"
    echo "This appears to be a file size limit issue."
    echo ""
    echo "💡 Possible solutions:"
    echo "1. Check API documentation for max file size limits"
    echo "2. Compress the video to reduce file size"
    echo "3. Use a different video format"
    echo "4. Split large videos into smaller chunks"
  fi
fi

echo ""
echo "🏁 Video upload test completed!"
