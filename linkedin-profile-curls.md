# LinkedIn Profile - Curl Commands

## 👤 LinkedIn Profile Endpoint

### Get LinkedIn User Profile
```bash
curl -X GET "https://backend.postsiva.com/linkedin/user-profile/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 📋 Complete Profile Test Script

Save as `linkedin-profile-test.sh`:

```bash
#!/bin/bash

echo "🔐 Step 1: Login to PostSiva API..."
LOGIN_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "123123123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ PostSiva login successful!"
echo ""

echo "👤 Step 2: Get LinkedIn user profile..."
PROFILE_RESPONSE=$(curl -s -X GET "https://backend.postsiva.com/linkedin/user-profile/" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE_RESPONSE" | jq '.'

# Extract profile details
LINKEDIN_ID=$(echo $PROFILE_RESPONSE | jq -r '.profile.linkedin_user_id')
NAME=$(echo $PROFILE_RESPONSE | jq -r '.profile.name')
EMAIL=$(echo $PROFILE_RESPONSE | jq -r '.profile.email')
PICTURE=$(echo $PROFILE_RESPONSE | jq -r '.profile.picture')

echo ""
echo "📊 Profile Summary:"
echo "=================="
echo "LinkedIn ID: $LINKEDIN_ID"
echo "Name: $NAME"
echo "Email: $EMAIL"
echo "Profile Picture: ${PICTURE:0:60}..."
echo ""

echo "🏁 LinkedIn profile test completed!"
```

## 🎯 Expected Response

### LinkedIn Profile Response:
```json
{
  "success": true,
  "message": "User profile retrieved from database",
  "profile": {
    "linkedin_user_id": "1IvgXHcI3v",
    "name": "For Python",
    "given_name": "For",
    "family_name": "Python",
    "email": "pythonfor18@gmail.com",
    "email_verified": true,
    "picture": "https://media.licdn.com/dms/image/v2/D4E03AQEFRV3u1II15Q/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1711307837883?e=1762992000&v=beta&t=q033ERvQ03ndjoCXilwG4MBwfDAzfGiSWTIPVvdw5DA",
    "locale": {
      "language": "en",
      "country": "US"
    }
  },
  "source": "database",
  "last_updated": "2025-10-23T14:22:29",
  "error": null
}
```

## 📊 Profile Data Structure

### Profile Fields:
- **linkedin_user_id**: Unique LinkedIn identifier
- **name**: Full name
- **given_name**: First name
- **family_name**: Last name
- **email**: LinkedIn email address
- **email_verified**: Email verification status
- **picture**: Profile picture URL
- **locale**: Language and country preferences
  - **language**: User's language (e.g., "en")
  - **country**: User's country (e.g., "US")

### Metadata:
- **source**: Where profile data was retrieved from ("database" or "linkedin")
- **last_updated**: Last time profile was synced
- **error**: Any error messages (null if successful)

## 🔄 Frontend Integration

### Get LinkedIn Profile:
```javascript
async function getLinkedInProfile() {
  const response = await fetch('https://backend.postsiva.com/linkedin/user-profile/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();
  
  if (result.success) {
    return result.profile;
  }
  throw new Error(result.error || 'Failed to fetch profile');
}

// Usage
const profile = await getLinkedInProfile();
console.log('LinkedIn User:', profile.name);
console.log('Email:', profile.email);
console.log('Profile Picture:', profile.picture);
```

### Display Profile Component:
```javascript
function LinkedInProfileCard({ profile }) {
  return (
    <div className="profile-card">
      <img src={profile.picture} alt={profile.name} />
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
      <span>LinkedIn ID: {profile.linkedin_user_id}</span>
    </div>
  );
}
```

## 🛠️ Integration Notes

1. **Requires LinkedIn OAuth**: Must have connected LinkedIn account
2. **Cached Data**: Profile is stored in database and synced periodically
3. **Profile Picture**: Direct URL to LinkedIn CDN image
4. **Email Access**: Requires `email` scope in OAuth
5. **Locale Info**: Useful for internationalization

## 🎯 For Cursor Implementation

Use this endpoint to:
1. **Display User Profile** - Show LinkedIn name and picture
2. **Verify Connection** - Check if LinkedIn is connected
3. **Profile Header** - Use in app navigation/header
4. **User Settings** - Display connected account info
5. **Post Attribution** - Show who is posting to LinkedIn

## 🔐 Error Handling

### Not Connected:
```json
{
  "success": false,
  "error": "LinkedIn token not found. Please connect your LinkedIn account first."
}
```

### Token Expired:
```json
{
  "success": false,
  "error": "LinkedIn token expired. Please refresh or reconnect."
}
```

### Handle Errors:
```javascript
async function getLinkedInProfile() {
  try {
    const response = await fetch('https://backend.postsiva.com/linkedin/user-profile/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    
    if (!result.success) {
      if (result.error?.includes('not found')) {
        // Redirect to LinkedIn connection
        return null;
      }
      if (result.error?.includes('expired')) {
        // Refresh token
        await refreshLinkedInToken();
        return getLinkedInProfile(); // Retry
      }
      throw new Error(result.error);
    }
    
    return result.profile;
  } catch (error) {
    console.error('Failed to fetch LinkedIn profile:', error);
    return null;
  }
}
```
