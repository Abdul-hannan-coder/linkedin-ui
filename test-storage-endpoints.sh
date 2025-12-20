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

echo "📋 Step 2: Get all media files..."
MEDIA_LIST=$(curl -s -X GET "https://backend.postsiva.com/media/" \
  -H "Authorization: Bearer $TOKEN")

echo "Media List Response:"
echo "$MEDIA_LIST" | jq '.'
echo ""

# Test pagination and filtering
echo "📋 Step 3: Test pagination (limit=2)..."
MEDIA_PAGINATED=$(curl -s -X GET "https://backend.postsiva.com/media/?limit=2" \
  -H "Authorization: Bearer $TOKEN")

echo "Paginated Media Response:"
echo "$MEDIA_PAGINATED" | jq '.'
echo ""

# Test getting specific media by ID
FIRST_MEDIA_ID=$(echo $MEDIA_LIST | jq -r '.media[0].media_id // "null"')

if [ "$FIRST_MEDIA_ID" != "null" ]; then
  echo "📄 Step 4: Get specific media by ID ($FIRST_MEDIA_ID)..."
  SPECIFIC_MEDIA=$(curl -s -X GET "https://backend.postsiva.com/media/$FIRST_MEDIA_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Specific Media Response:"
  echo "$SPECIFIC_MEDIA" | jq '.'
  echo ""
fi

# Test bulk delete (we'll create test files first)
echo "📤 Step 5: Upload test files for bulk operations..."
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

# Test bulk delete
echo "🗑️ Step 6: Test bulk delete..."
BULK_DELETE=$(curl -s -X DELETE "https://backend.postsiva.com/media/bulk" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"ids\": [\"$ID1\", \"$ID2\"]}")

echo "Bulk Delete Response:"
echo "$BULK_DELETE" | jq '.'
echo ""

# Test filter delete
echo "🗑️ Step 7: Test filter delete..."
FILTER_DELETE=$(curl -s -X DELETE "https://backend.postsiva.com/media/filter" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"media_type": "image", "status": "uploaded"}')

echo "Filter Delete Response:"
echo "$FILTER_DELETE" | jq '.'
echo ""

# Test cleanup
echo "🧹 Step 8: Test cleanup expired media..."
CLEANUP=$(curl -s -X POST "https://backend.postsiva.com/media/cleanup" \
  -H "Authorization: Bearer $TOKEN")

echo "Cleanup Response:"
echo "$CLEANUP" | jq '.'

echo ""
echo "🏁 Storage endpoints test completed!"

# Cleanup
rm -f test1.png test2.png
