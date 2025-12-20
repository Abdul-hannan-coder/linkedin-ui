#!/bin/bash

VIDEO_FILE="/home/abdulhannan/Downloads/Videos/Just a !Meme 🧑_💻#programing #coding #softwaredeveloper #100dayproject #goals #coder #goal #dev.mp4"

echo "🔍 EXACT ERROR REPRODUCTION"
echo "=========================="
echo ""

echo "📋 File Details:"
echo "File: $(basename "$VIDEO_FILE")"
echo "Size: $(stat -c%s "$VIDEO_FILE") bytes ($(ls -lh "$VIDEO_FILE" | awk '{print $5}'))"
echo ""

echo "🔐 Getting access token..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
echo "✅ Token obtained"
echo ""

echo "🎯 ENDPOINT THAT FAILED:"
echo "POST https://backend.postsiva.com/media/upload"
echo ""

echo "📤 REQUEST DETAILS:"
echo "Headers:"
echo "  Authorization: Bearer $TOKEN"
echo "  Content-Type: multipart/form-data"
echo ""
echo "Form Data:"
echo "  media: @$VIDEO_FILE"
echo "  media_type: video"
echo ""

echo "📥 MAKING REQUEST WITH VERBOSE OUTPUT..."
echo "========================================"

# Make the request with verbose output to see exactly what happens
curl -v -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@$VIDEO_FILE" \
  -F "media_type=video" \
  --max-time 60 2>&1 | head -50

echo ""
echo ""
echo "📋 RESPONSE BODY:"
echo "================"

UPLOAD_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@$VIDEO_FILE" \
  -F "media_type=video" \
  --max-time 60)

echo "$UPLOAD_RESPONSE" | jq '.' 2>/dev/null || echo "$UPLOAD_RESPONSE"

echo ""
echo "🔍 ERROR ANALYSIS:"
echo "=================="
echo ""
echo "❌ FAILED ENDPOINT: POST /media/upload"
echo "❌ HTTP STATUS: 413 Payload Too Large"
echo "❌ ERROR SOURCE: storage.postsiva.com (storage server)"
echo "❌ ERROR MESSAGE: $(echo "$UPLOAD_RESPONSE" | jq -r '.detail // "N/A"')"
echo ""
echo "🎯 ROOT CAUSE:"
echo "The PostSiva API (/media/upload) accepts the request but fails when"
echo "trying to upload the file to the storage server (storage.postsiva.com)"
echo "because the file exceeds the storage server's size limit."
echo ""
echo "📊 SIZE LIMIT ANALYSIS:"
echo "- Your file: $(stat -c%s "$VIDEO_FILE") bytes"
echo "- Storage limit: ~1-2MB (1,048,576 - 2,097,152 bytes)"
echo "- Exceeded by: $(($(stat -c%s "$VIDEO_FILE") - 1048576)) bytes"
