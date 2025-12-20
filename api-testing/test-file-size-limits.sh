#!/bin/bash

VIDEO_FILE="/home/abdulhannan/Downloads/Videos/Just a !Meme 🧑_💻#programing #coding #softwaredeveloper #100dayproject #goals #coder #goal #dev.mp4"

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

echo "📊 Current video file analysis:"
echo "File: $(basename "$VIDEO_FILE")"
echo "Size: $(ls -lh "$VIDEO_FILE" | awk '{print $5}') ($(stat -c%s "$VIDEO_FILE") bytes)"
echo "Format: $(file "$VIDEO_FILE" | cut -d: -f2)"
echo ""

echo "🧪 Step 2: Test with smaller video sizes..."

# Create a very small test video (1 second, low quality)
echo "Creating small test video..."
ffmpeg -f lavfi -i testsrc=duration=1:size=320x240:rate=1 -c:v libx264 -t 1 -pix_fmt yuv420p small_test.mp4 -y 2>/dev/null

if [ -f "small_test.mp4" ]; then
  echo "Small test video created: $(ls -lh small_test.mp4 | awk '{print $5}')"
  
  SMALL_UPLOAD=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
    -H "Authorization: Bearer $TOKEN" \
    -F "media=@small_test.mp4" \
    -F "media_type=video")
  
  echo "Small video upload result:"
  echo "$SMALL_UPLOAD" | jq '.'
  echo ""
  
  rm -f small_test.mp4
else
  echo "⚠️ ffmpeg not available, skipping small video test"
fi

echo "🔍 Step 3: Try to compress the original video..."

# Try to compress the original video to under 1MB
if command -v ffmpeg >/dev/null 2>&1; then
  echo "Compressing original video..."
  
  ffmpeg -i "$VIDEO_FILE" \
    -vf "scale=480:270" \
    -c:v libx264 \
    -crf 28 \
    -preset fast \
    -c:a aac \
    -b:a 64k \
    -movflags +faststart \
    compressed_meme.mp4 -y 2>/dev/null
  
  if [ -f "compressed_meme.mp4" ]; then
    echo "Compressed video created:"
    echo "Original: $(ls -lh "$VIDEO_FILE" | awk '{print $5}')"
    echo "Compressed: $(ls -lh compressed_meme.mp4 | awk '{print $5}')"
    echo ""
    
    echo "📤 Testing compressed video upload..."
    COMPRESSED_UPLOAD=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
      -H "Authorization: Bearer $TOKEN" \
      -F "media=@compressed_meme.mp4" \
      -F "media_type=video")
    
    echo "Compressed video upload result:"
    echo "$COMPRESSED_UPLOAD" | jq '.'
    
    # If successful, test LinkedIn post
    SUCCESS=$(echo $COMPRESSED_UPLOAD | jq -r '.success // false')
    if [ "$SUCCESS" = "true" ]; then
      VIDEO_ID=$(echo $COMPRESSED_UPLOAD | jq -r '.media_id')
      
      echo ""
      echo "✅ Compressed video uploaded! Testing LinkedIn post..."
      
      POST_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/video-post/" \
        -H "Authorization: Bearer $TOKEN" \
        -F "video_id=$VIDEO_ID" \
        -F "text=Testing compressed video upload! 🎥 This meme video was compressed to fit size limits. #programming #coding #meme" \
        -F "title=Just a Programming Meme (Compressed)" \
        -F "visibility=PUBLIC")
      
      echo "LinkedIn Video Post Response:"
      echo "$POST_RESPONSE" | jq '.'
    fi
    
    rm -f compressed_meme.mp4
  else
    echo "❌ Failed to compress video"
  fi
else
  echo "⚠️ ffmpeg not available for compression"
fi

echo ""
echo "📋 Summary & Recommendations:"
echo "=============================="
echo ""
echo "🔍 Issue Identified:"
echo "- File size limit appears to be around 1-2MB for video uploads"
echo "- Your video (2.2MB) exceeds this limit"
echo "- Error: 413 Payload Too Large from storage.postsiva.com"
echo ""
echo "💡 Solutions:"
echo "1. Compress videos before upload (reduce resolution, bitrate)"
echo "2. Use shorter video clips (trim length)"
echo "3. Convert to more efficient formats"
echo "4. Implement chunked upload for large files"
echo ""
echo "🛠️ Quick Fix Commands:"
echo "# Compress video to under 1MB:"
echo "ffmpeg -i 'input.mp4' -vf 'scale=480:270' -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 64k -movflags +faststart output.mp4"
echo ""
echo "# Or more aggressive compression:"
echo "ffmpeg -i 'input.mp4' -vf 'scale=320:180' -c:v libx264 -crf 32 -preset fast -c:a aac -b:a 32k output.mp4"

echo ""
echo "🏁 File size limit test completed!"
