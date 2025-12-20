# LinkedIn Multi-Image Posting - CORRECTED Format

## 🎯 **CRITICAL DISCOVERY: Multi-Image Format**

**✅ WORKING FORMAT**: Comma-separated image IDs in a single field  
**❌ WRONG FORMAT**: Multiple `-F image_ids=` fields

---

## 📋 **Corrected Multi-Image Post Curl**

### Upload Multiple Images & Create Multi-Image Post

```bash
# Step 1: Upload first image
IMAGE1_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@image1.jpg" \
  -F "media_type=image")

IMAGE1_ID=$(echo $IMAGE1_RESPONSE | jq -r '.media_id')

# Step 2: Upload second image
IMAGE2_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@image2.jpg" \
  -F "media_type=image")

IMAGE2_ID=$(echo $IMAGE2_RESPONSE | jq -r '.media_id')

# Step 3: Create multi-image post (COMMA-SEPARATED!)
curl -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image_ids=$IMAGE1_ID,$IMAGE2_ID" \
  -F "text=Check out these amazing photos!" \
  -F "visibility=PUBLIC"
```

---

## ✅ **Successful Test Result**

```json
{
  "success": true,
  "message": "Multi-image post created successfully with 2 images",
  "post": {
    "post_id": "urn:li:share:7408139033773772800",
    "text": "Test 2: Comma-separated",
    "visibility": "PUBLIC",
    "image_count": 2,
    "images": [
      {
        "asset_urn": "urn:li:digitalmediaAsset:D4E22AQFPlAA5RMVXLg",
        "filename": "6946a718d3695_1766237976.png",
        "size": 70
      },
      {
        "asset_urn": "urn:li:digitalmediaAsset:D4E22AQG2XfhHmLaoOg",
        "filename": "6946a71960997_1766237977.png", 
        "size": 70
      }
    ],
    "total_size": 140,
    "post_url": "https://www.linkedin.com/feed/update/urn:li:share:7408139033773772800",
    "posted_at": "2025-12-20T13:39:43"
  }
}
```

---

## 🔧 **Updated Implementation**

### Corrected TypeScript Service

```typescript
// src/services/linkedin.ts

export const linkedinService = {
  // Multi-Image Post (CORRECTED FORMAT)
  createMultiImagePost: (imageIds: string[], text: string, visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC') => {
    const formData = new FormData();
    formData.append('image_ids', imageIds.join(',')); // ✅ COMMA-SEPARATED!
    formData.append('text', text);
    formData.append('visibility', visibility);
    return api.post('/linkedin/image-post/multi/', formData);
  },
  
  // Other methods remain the same...
};
```

### Updated Custom Hook

```typescript
// src/hooks/useLinkedInPost.ts

const createPost = async (
  postType: PostType,
  content: string,
  files: File[] = [],
  visibility: 'public' | 'connections' = 'public'
) => {
  setIsPosting(true);
  
  try {
    const linkedinVisibility = visibility.toUpperCase() as 'PUBLIC' | 'CONNECTIONS';
    let result;
    
    switch (postType) {
      case 'text':
        result = await linkedinService.createTextPost(content, linkedinVisibility);
        break;
        
      case 'image':
        const imageIds = await uploadFiles([files[0]], 'image');
        result = await linkedinService.createImagePost(imageIds[0], content, linkedinVisibility);
        break;
        
      case 'multiple':
        const multiImageIds = await uploadFiles(files, 'image');
        // ✅ CORRECTED: Pass array directly, service will join with commas
        result = await linkedinService.createMultiImagePost(multiImageIds, content, linkedinVisibility);
        break;
        
      case 'video':
        const videoIds = await uploadFiles([files[0]], 'video');
        const title = content.split('\n')[0] || 'Video Post';
        result = await linkedinService.createVideoPost(videoIds[0], content, title, linkedinVisibility);
        break;
    }
    
    return result;
  } finally {
    setIsPosting(false);
    setUploadProgress({});
  }
};
```

---

## 📊 **What We Missed Before**

| Issue | Wrong Format | Correct Format |
|-------|-------------|----------------|
| **Multiple IDs** | `-F "image_ids=ID1" -F "image_ids=ID2"` | `-F "image_ids=ID1,ID2"` |
| **Array Brackets** | `-F "image_ids[]=ID1" -F "image_ids[]=ID2"` | `-F "image_ids=ID1,ID2"` |
| **JSON Format** | `-F "image_ids=[\"ID1\",\"ID2\"]"` | `-F "image_ids=ID1,ID2"` |

---

## 🎯 **Complete Working Example**

```bash
#!/bin/bash

# Login
TOKEN=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"123123123"}' \
  | jq -r '.access_token')

# Upload 3 images
ID1=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@photo1.jpg" \
  -F "media_type=image" | jq -r '.media_id')

ID2=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@photo2.jpg" \
  -F "media_type=image" | jq -r '.media_id')

ID3=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@photo3.jpg" \
  -F "media_type=image" | jq -r '.media_id')

# Create multi-image post with all 3 images
curl -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_ids=$ID1,$ID2,$ID3" \
  -F "text=Three amazing photos in one post! 📸📸📸" \
  -F "visibility=PUBLIC"
```

---

## 🚀 **Updated Documentation Summary**

### For Your UI Implementation:

1. **Upload multiple files** → Get array of `media_id`s
2. **Join IDs with commas** → `imageIds.join(',')`  
3. **Send as single form field** → `image_ids=ID1,ID2,ID3`
4. **Minimum 2 images required** for multi-image posts
5. **Maximum limit**: Need to test (LinkedIn typically allows up to 20)

### Response includes:
- ✅ **image_count**: Number of images in the post
- ✅ **images array**: Details for each uploaded image  
- ✅ **total_size**: Combined size of all images
- ✅ **asset_urn**: LinkedIn's internal image references

**The multi-image posting now works perfectly!** 🎯
