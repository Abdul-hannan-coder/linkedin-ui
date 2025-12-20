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

# Test 1: Schedule a text post for 1 hour from now
echo "📅 Step 2: Schedule LinkedIn text post for 1 hour from now..."
FUTURE_TIME=$(date -d "+1 hour" -Iseconds)
echo "Scheduling for: $FUTURE_TIME"

SCHEDULED_TEXT=$(curl -s -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"This is a scheduled LinkedIn text post! 📅 Scheduled at $(date)\",
    \"visibility\": \"PUBLIC\",
    \"scheduled_time\": \"$FUTURE_TIME\"
  }")

echo "Scheduled Text Post Response:"
echo "$SCHEDULED_TEXT" | jq '.'
echo ""

# Test 2: Upload image and schedule image post
echo "📷 Step 3: Upload image for scheduled post..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test_scheduled.png

IMAGE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@test_scheduled.png" \
  -F "media_type=image")

IMAGE_ID=$(echo $IMAGE_RESPONSE | jq -r '.media_id')
echo "Image uploaded: $IMAGE_ID"
echo ""

# Schedule image post for 2 hours from now
echo "📅 Step 4: Schedule LinkedIn image post for 2 hours from now..."
FUTURE_TIME_2=$(date -d "+2 hours" -Iseconds)
echo "Scheduling for: $FUTURE_TIME_2"

SCHEDULED_IMAGE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_id=$IMAGE_ID" \
  -F "text=This is a scheduled LinkedIn image post! 📸 Scheduled at $(date)" \
  -F "visibility=PUBLIC" \
  -F "scheduled_time=$FUTURE_TIME_2")

echo "Scheduled Image Post Response:"
echo "$SCHEDULED_IMAGE" | jq '.'
echo ""

# Test 3: Get all scheduled posts
echo "📋 Step 5: Get all scheduled posts..."
SCHEDULED_POSTS=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts" \
  -H "Authorization: Bearer $TOKEN")

echo "My Scheduled Posts:"
echo "$SCHEDULED_POSTS" | jq '.'
echo ""

# Test 4: Filter scheduled posts by platform
echo "📋 Step 6: Get LinkedIn scheduled posts only..."
LINKEDIN_SCHEDULED=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?platform=linkedin" \
  -H "Authorization: Bearer $TOKEN")

echo "LinkedIn Scheduled Posts:"
echo "$LINKEDIN_SCHEDULED" | jq '.'
echo ""

# Test 5: Get scheduled posts by status
echo "📋 Step 7: Get posts with 'scheduled' status..."
STATUS_SCHEDULED=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?status=scheduled" \
  -H "Authorization: Bearer $TOKEN")

echo "Posts with 'scheduled' status:"
echo "$STATUS_SCHEDULED" | jq '.'
echo ""

# Test 6: Try to get a specific scheduled post ID and modify it
FIRST_SCHEDULED_ID=$(echo $SCHEDULED_POSTS | jq -r '.scheduled_posts[0].scheduled_post_id // "null"')

if [ "$FIRST_SCHEDULED_ID" != "null" ]; then
  echo "🔧 Step 8: Test modifying scheduled post ($FIRST_SCHEDULED_ID)..."
  
  # Update scheduled post time
  NEW_TIME=$(date -d "+3 hours" -Iseconds)
  
  UPDATED_POST=$(curl -s -X PATCH "https://backend.postsiva.com/scheduled-posts/$FIRST_SCHEDULED_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"scheduled_time\": \"$NEW_TIME\",
      \"post_data\": {
        \"text\": \"Updated scheduled post! New time: $NEW_TIME\"
      }
    }")
  
  echo "Updated Scheduled Post Response:"
  echo "$UPDATED_POST" | jq '.'
  echo ""
  
  # Test deleting/canceling scheduled post
  echo "🗑️ Step 9: Test canceling scheduled post..."
  CANCELED_POST=$(curl -s -X DELETE "https://backend.postsiva.com/scheduled-posts/$FIRST_SCHEDULED_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Canceled Scheduled Post Response:"
  echo "$CANCELED_POST" | jq '.'
else
  echo "⚠️ No scheduled posts found to modify"
fi

echo ""
echo "🏁 LinkedIn scheduling test completed!"

# Cleanup
rm -f test_scheduled.png
