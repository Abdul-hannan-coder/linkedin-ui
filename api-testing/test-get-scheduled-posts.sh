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

echo "🎯 ENDPOINT BEING TESTED:"
echo "GET https://backend.postsiva.com/scheduled-posts/my-scheduled-posts"
echo ""

echo "📥 Test 1: Get ALL scheduled posts..."
echo "===================================="

ALL_POSTS=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts" \
  -H "Authorization: Bearer $TOKEN")

echo "📋 RESPONSE:"
echo "$ALL_POSTS" | jq '.'
echo ""

echo "📊 SUMMARY:"
TOTAL=$(echo $ALL_POSTS | jq -r '.data.total // 0')
echo "Total scheduled posts: $TOTAL"
echo ""

echo "📥 Test 2: Get LinkedIn scheduled posts only..."
echo "=============================================="

LINKEDIN_POSTS=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?platform=linkedin" \
  -H "Authorization: Bearer $TOKEN")

echo "📋 RESPONSE:"
echo "$LINKEDIN_POSTS" | jq '.'
echo ""

echo "📊 SUMMARY:"
LINKEDIN_TOTAL=$(echo $LINKEDIN_POSTS | jq -r '.data.total // 0')
echo "LinkedIn scheduled posts: $LINKEDIN_TOTAL"
echo ""

echo "📥 Test 3: Get only 'scheduled' status posts..."
echo "=============================================="

SCHEDULED_ONLY=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?status=scheduled" \
  -H "Authorization: Bearer $TOKEN")

echo "📋 RESPONSE:"
echo "$SCHEDULED_ONLY" | jq '.'
echo ""

echo "📊 SUMMARY:"
SCHEDULED_TOTAL=$(echo $SCHEDULED_ONLY | jq -r '.data.total // 0')
echo "Posts with 'scheduled' status: $SCHEDULED_TOTAL"
echo ""

echo "📥 Test 4: Get LinkedIn + scheduled status..."
echo "==========================================="

LINKEDIN_SCHEDULED=$(curl -s -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?platform=linkedin&status=scheduled" \
  -H "Authorization: Bearer $TOKEN")

echo "📋 RESPONSE:"
echo "$LINKEDIN_SCHEDULED" | jq '.'
echo ""

echo "📊 SUMMARY:"
LINKEDIN_SCHEDULED_TOTAL=$(echo $LINKEDIN_SCHEDULED | jq -r '.data.total // 0')
echo "LinkedIn scheduled posts: $LINKEDIN_SCHEDULED_TOTAL"
echo ""

if [ "$LINKEDIN_SCHEDULED_TOTAL" -gt 0 ]; then
  echo "📋 DETAILED VIEW OF FIRST SCHEDULED POST:"
  echo "$LINKEDIN_SCHEDULED" | jq '.data.scheduled_posts[0]'
  echo ""
  
  echo "📊 POST DETAILS:"
  POST_ID=$(echo $LINKEDIN_SCHEDULED | jq -r '.data.scheduled_posts[0].scheduled_post_id')
  POST_TYPE=$(echo $LINKEDIN_SCHEDULED | jq -r '.data.scheduled_posts[0].post_type')
  SCHEDULED_TIME=$(echo $LINKEDIN_SCHEDULED | jq -r '.data.scheduled_posts[0].scheduled_time_formatted')
  TIME_UNTIL=$(echo $LINKEDIN_SCHEDULED | jq -r '.data.scheduled_posts[0].time_until_scheduled')
  STATUS=$(echo $LINKEDIN_SCHEDULED | jq -r '.data.scheduled_posts[0].status')
  
  echo "  Post ID: $POST_ID"
  echo "  Type: $POST_TYPE"
  echo "  Scheduled for: $SCHEDULED_TIME"
  echo "  Time until: $TIME_UNTIL"
  echo "  Status: $STATUS"
fi

echo ""
echo "🏁 Get scheduled posts test completed!"
