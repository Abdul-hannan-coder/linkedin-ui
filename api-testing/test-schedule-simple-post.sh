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

# Schedule a simple text post for 30 minutes from now
FUTURE_TIME=$(date -d "+30 minutes" -Iseconds)
echo "📅 Scheduling simple test post for: $FUTURE_TIME"
echo ""

echo "🎯 ENDPOINT BEING TESTED:"
echo "POST https://backend.postsiva.com/linkedin/text-post/"
echo ""

echo "📤 REQUEST PAYLOAD:"
echo "{"
echo "  \"text\": \"This is a simple scheduled test post! 📅 Created at $(date)\","
echo "  \"visibility\": \"PUBLIC\","
echo "  \"scheduled_time\": \"$FUTURE_TIME\""
echo "}"
echo ""

echo "📥 MAKING SCHEDULED POST REQUEST..."
echo "=================================="

SCHEDULED_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"This is a simple scheduled test post! 📅 Created at $(date)\",
    \"visibility\": \"PUBLIC\",
    \"scheduled_time\": \"$FUTURE_TIME\"
  }")

echo "📋 RESPONSE:"
echo "$SCHEDULED_RESPONSE" | jq '.'
echo ""

# Check if scheduling was successful
SUCCESS=$(echo $SCHEDULED_RESPONSE | jq -r '.success // false')

if [ "$SUCCESS" = "true" ]; then
  echo "✅ SCHEDULING SUCCESSFUL!"
  
  SCHEDULED_ID=$(echo $SCHEDULED_RESPONSE | jq -r '.post.scheduled_post_id // "null"')
  SCHEDULED_TIME_RESPONSE=$(echo $SCHEDULED_RESPONSE | jq -r '.post.scheduled_time // "null"')
  STATUS=$(echo $SCHEDULED_RESPONSE | jq -r '.post.status // "null"')
  
  echo "📊 SCHEDULED POST DETAILS:"
  echo "  Scheduled Post ID: $SCHEDULED_ID"
  echo "  Scheduled Time: $SCHEDULED_TIME_RESPONSE"
  echo "  Status: $STATUS"
  echo ""
  
  # Verify by getting scheduled posts list
  echo "📋 Step 2: Verify by getting scheduled posts list..."
  SCHEDULED_POSTS=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?platform=linkedin&status=scheduled" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Scheduled Posts List:"
  echo "$SCHEDULED_POSTS" | jq '.'
  
  TOTAL_SCHEDULED=$(echo $SCHEDULED_POSTS | jq -r '.data.total // 0')
  echo ""
  echo "📊 VERIFICATION RESULT:"
  echo "  Total scheduled posts: $TOTAL_SCHEDULED"
  
  if [ "$TOTAL_SCHEDULED" -gt 0 ]; then
    echo "  ✅ Post appears in scheduled posts list"
    
    # Show the most recent scheduled post
    echo ""
    echo "📋 MOST RECENT SCHEDULED POST:"
    echo "$SCHEDULED_POSTS" | jq '.data.scheduled_posts[0]'
  else
    echo "  ⚠️ Post not found in scheduled posts list"
  fi
  
else
  echo "❌ SCHEDULING FAILED!"
  ERROR=$(echo $SCHEDULED_RESPONSE | jq -r '.error // .message // .detail // "Unknown error"')
  echo "Error: $ERROR"
fi

echo ""
echo "🏁 Schedule test completed!"
