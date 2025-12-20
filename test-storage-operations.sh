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

# Upload test files for operations
echo "📤 Step 2: Upload test files..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test1.png
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test2.png

UPLOAD1=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test1.png" \
  -F "media_type=image")

UPLOAD2=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test2.png" \
  -F "media_type=image")

ID1=$(echo $UPLOAD1 | jq -r '.media_id')
ID2=$(echo $UPLOAD2 | jq -r '.media_id')

echo "Uploaded test files: $ID1, $ID2"
echo ""

# Test single delete
echo "🗑️ Step 3: Test single delete..."
SINGLE_DELETE=$(curl -s -X DELETE "https://backend.postsiva.com/media/$ID1" \
  -H "Authorization: Bearer $TOKEN")

echo "Single Delete Response:"
echo "$SINGLE_DELETE" | jq '.'
echo ""

# Test bulk delete with correct format
echo "🗑️ Step 4: Test bulk delete with correct format..."
BULK_DELETE=$(curl -s -X DELETE "https://backend.postsiva.com/media/bulk" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"media_ids\": [\"$ID2\"]}")

echo "Bulk Delete Response:"
echo "$BULK_DELETE" | jq '.'
echo ""

# Test filter operations
echo "🔍 Step 5: Test filter by media type..."
FILTER_IMAGES=$(curl -s -X GET "https://backend.postsiva.com/media/?media_type=image" \
  -H "Authorization: Bearer $TOKEN")

echo "Filter Images Response (count only):"
echo "$FILTER_IMAGES" | jq '{success, total, count, limit, offset}'
echo ""

FILTER_VIDEOS=$(curl -s -X GET "https://backend.postsiva.com/media/?media_type=video" \
  -H "Authorization: Bearer $TOKEN")

echo "Filter Videos Response (count only):"
echo "$FILTER_VIDEOS" | jq '{success, total, count, limit, offset}'
echo ""

# Test pagination
echo "📄 Step 6: Test pagination..."
PAGE1=$(curl -s -X GET "https://backend.postsiva.com/media/?limit=3&offset=0" \
  -H "Authorization: Bearer $TOKEN")

echo "Page 1 (limit=3, offset=0):"
echo "$PAGE1" | jq '{success, total, count, limit, offset, media: [.media[].filename]}'
echo ""

PAGE2=$(curl -s -X GET "https://backend.postsiva.com/media/?limit=3&offset=3" \
  -H "Authorization: Bearer $TOKEN")

echo "Page 2 (limit=3, offset=3):"
echo "$PAGE2" | jq '{success, total, count, limit, offset, media: [.media[].filename]}'

echo ""
echo "🏁 Storage operations test completed!"

# Cleanup
rm -f test1.png test2.png
