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

# Get existing scheduled posts
echo "📋 Step 2: Get current scheduled posts..."
SCHEDULED_POSTS=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts" \
  -H "Authorization: Bearer $TOKEN")

echo "Current Scheduled Posts Count: $(echo $SCHEDULED_POSTS | jq '.data.total')"

# Get the first scheduled post ID
FIRST_SCHEDULED_ID=$(echo $SCHEDULED_POSTS | jq -r '.data.scheduled_posts[0].scheduled_post_id // "null"')

if [ "$FIRST_SCHEDULED_ID" != "null" ]; then
  echo "Found scheduled post: $FIRST_SCHEDULED_ID"
  echo ""
  
  # Test updating scheduled post
  echo "🔧 Step 3: Test updating scheduled post..."
  NEW_TIME=$(date -d "+4 hours" -Iseconds)
  echo "Updating scheduled time to: $NEW_TIME"
  
  UPDATED_POST=$(curl -s -X PATCH "https://backend.postsiva.com/scheduled-posts/$FIRST_SCHEDULED_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"scheduled_time\": \"$NEW_TIME\",
      \"post_data\": {
        \"text\": \"UPDATED: This scheduled post was modified! 🔄 New time: $NEW_TIME\",
        \"visibility\": \"PUBLIC\"
      }
    }")
  
  echo "Update Response:"
  echo "$UPDATED_POST" | jq '.'
  echo ""
  
  # Verify the update
  echo "📋 Step 4: Verify the update..."
  UPDATED_POSTS=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Updated Post Details:"
  echo "$UPDATED_POSTS" | jq ".data.scheduled_posts[] | select(.scheduled_post_id == \"$FIRST_SCHEDULED_ID\")"
  echo ""
  
  # Test canceling scheduled post
  echo "🗑️ Step 5: Test canceling scheduled post..."
  CANCELED_POST=$(curl -s -X DELETE "https://backend.postsiva.com/scheduled-posts/$FIRST_SCHEDULED_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Cancel Response:"
  echo "$CANCELED_POST" | jq '.'
  echo ""
  
  # Verify cancellation
  echo "📋 Step 6: Verify cancellation..."
  FINAL_POSTS=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Remaining Scheduled Posts Count: $(echo $FINAL_POSTS | jq '.data.total')"
  
else
  echo "⚠️ No scheduled posts found. Creating a new one for testing..."
  
  # Create a new scheduled post for testing
  FUTURE_TIME=$(date -d "+30 minutes" -Iseconds)
  
  NEW_SCHEDULED=$(curl -s -X POST "https://backend.postsiva.com/linkedin/text-post/" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"text\": \"Test scheduled post for management testing 🧪\",
      \"visibility\": \"PUBLIC\",
      \"scheduled_time\": \"$FUTURE_TIME\"
    }")
  
  echo "New Scheduled Post:"
  echo "$NEW_SCHEDULED" | jq '.'
  
  NEW_ID=$(echo $NEW_SCHEDULED | jq -r '.post.scheduled_post_id // "null"')
  
  if [ "$NEW_ID" != "null" ]; then
    echo ""
    echo "🗑️ Testing cancellation of new post ($NEW_ID)..."
    
    CANCEL_NEW=$(curl -s -X DELETE "https://backend.postsiva.com/scheduled-posts/$NEW_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Cancel New Post Response:"
    echo "$CANCEL_NEW" | jq '.'
  fi
fi

echo ""
echo "🏁 Scheduled post management test completed!"
