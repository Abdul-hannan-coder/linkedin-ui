# LinkedIn Media Upload & Posting - Complete Curl Commands

## 🎯 Discovered: LinkedIn Posts Require Form Data (Not JSON!)

**Important**: LinkedIn image/video posts use `multipart/form-data`, NOT JSON!

---

## 1️⃣ Media Upload

### Upload Image
```bash
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@image.jpg" \
  -F "media_type=image"
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "media_id": "f099a3af-f84a-4c28-baef-194b825dafe8",
  "public_url": "https://storage.postsiva.com/uploads/...",
  "filename": "...",
  "file_size": 70,
  "media_type": "image"
}
```

### Upload Video
```bash
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@video.mp4" \
  -F "media_type=video"
```

### Upload Multiple Images (Carousel)
```bash
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "images=@image3.jpg" \
  -F "media_type=images"
```

---

## 2️⃣ LinkedIn Text Post (JSON)

```bash
curl -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello LinkedIn! This is my post.",
    "visibility": "PUBLIC"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully on LinkedIn",
  "post": {
    "post_id": "urn:li:share:7408075404558770176",
    "text": "Hello LinkedIn!",
    "visibility": "PUBLIC",
    "post_url": "https://www.linkedin.com/feed/update/...",
    "posted_at": "2025-12-20T09:26:52"
  }
}
```

---

## 3️⃣ LinkedIn Image Post (Form Data + media_id)

```bash
# Step 1: Upload image
IMAGE_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@image.jpg" \
  -F "media_type=image")

IMAGE_ID=$(echo $IMAGE_RESPONSE | jq -r '.media_id')

# Step 2: Create LinkedIn image post
curl -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image_id=$IMAGE_ID" \
  -F "text=Check out this amazing photo!" \
  -F "visibility=PUBLIC"
```

**Response:**
```json
{
  "success": true,
  "message": "Image post created successfully on LinkedIn",
  "post": {
    "post_id": "urn:li:share:7408133096652382208",
    "text": "Check out this amazing photo!",
    "visibility": "PUBLIC",
    "image_urn": "urn:li:digitalmediaAsset:D4E22AQGCvC_08VR1Zg",
    "post_url": "https://www.linkedin.com/feed/update/...",
    "posted_at": "2025-12-20T13:16:07"
  }
}
```

---

## 4️⃣ LinkedIn Multi-Image Post (Form Data + media_ids)

```bash
# Step 1: Upload multiple images
IMAGE_ID_1=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@image1.jpg" \
  -F "media_type=image" | jq -r '.media_id')

IMAGE_ID_2=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@image2.jpg" \
  -F "media_type=image" | jq -r '.media_id')

IMAGE_ID_3=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@image3.jpg" \
  -F "media_type=image" | jq -r '.media_id')

# Step 2: Create multi-image post
curl -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image_ids=$IMAGE_ID_1" \
  -F "image_ids=$IMAGE_ID_2" \
  -F "image_ids=$IMAGE_ID_3" \
  -F "text=Multiple amazing photos!" \
  -F "visibility=PUBLIC"
```

---

## 5️⃣ LinkedIn Video Post (Form Data + video_id)

```bash
# Step 1: Upload video
VIDEO_RESPONSE=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@video.mp4" \
  -F "media_type=video")

VIDEO_ID=$(echo $VIDEO_RESPONSE | jq -r '.media_id')

# Step 2: Create LinkedIn video post
curl -X POST "https://backend.postsiva.com/linkedin/video-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video_id=$VIDEO_ID" \
  -F "text=Watch this amazing video!" \
  -F "title=My Awesome Video" \
  -F "visibility=PUBLIC"
```

---

## 🎯 Updated Implementation for Your UI

### TypeScript Service Layer

```typescript
// src/services/linkedin.ts

export const linkedinService = {
  // Text Post (JSON)
  createTextPost: (text: string, visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC') =>
    api.post('/linkedin/text-post/', { text, visibility }),
  
  // Image Post (Form Data with media_id)
  createImagePost: (imageId: string, text: string, visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC') => {
    const formData = new FormData();
    formData.append('image_id', imageId);
    formData.append('text', text);
    formData.append('visibility', visibility);
    return api.post('/linkedin/image-post/', formData);
  },
  
  // Multi-Image Post (Form Data with multiple media_ids)
  createMultiImagePost: (imageIds: string[], text: string, visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC') => {
    const formData = new FormData();
    imageIds.forEach(id => formData.append('image_ids', id));
    formData.append('text', text);
    formData.append('visibility', visibility);
    return api.post('/linkedin/image-post/multi/', formData);
  },
  
  // Video Post (Form Data with video_id)
  createVideoPost: (videoId: string, text: string, title: string, visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC') => {
    const formData = new FormData();
    formData.append('video_id', videoId);
    formData.append('text', text);
    formData.append('title', title);
    formData.append('visibility', visibility);
    return api.post('/linkedin/video-post/', formData);
  },
  
  // Media Upload
  uploadMedia: (file: File, mediaType: 'image' | 'video') => {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('media_type', mediaType);
    return api.post('/media/upload', formData);
  }
};
```

### Updated Custom Hook

```typescript
// src/hooks/useLinkedInPost.ts

export const useLinkedInPost = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const uploadFiles = async (files: File[], mediaType: 'image' | 'video') => {
    const uploads = await Promise.all(
      files.map(async (file, index) => {
        setUploadProgress(prev => ({ ...prev, [index]: 0 }));
        
        const response = await linkedinService.uploadMedia(file, mediaType);
        
        setUploadProgress(prev => ({ ...prev, [index]: 100 }));
        return response.data.media_id; // Return media_id, not URL!
      })
    );
    
    return uploads;
  };

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

  return {
    createPost,
    isPosting,
    uploadProgress
  };
};
```

---

## ⚠️ Key Differences from Previous Documentation

1. **Image/Video Posts**: Use `multipart/form-data` (NOT JSON)
2. **Field Names**: Use `image_id` and `video_id` (NOT `image_url` or `video_url`)
3. **Media IDs**: Upload returns `media_id` which you pass to post endpoints
4. **Text Posts**: Still use JSON format
5. **Visibility**: Use `PUBLIC` or `CONNECTIONS` (uppercase)

---

## 🚀 Complete Working Example

```bash
#!/bin/bash

# Login
TOKEN=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"123123123"}' \
  | jq -r '.access_token')

# Upload image
IMAGE_ID=$(curl -s -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "media=@photo.jpg" \
  -F "media_type=image" \
  | jq -r '.media_id')

# Create LinkedIn image post
curl -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_id=$IMAGE_ID" \
  -F "text=Check out my photo!" \
  -F "visibility=PUBLIC"
```

---

## 📊 Summary for Cursor Implementation

| Post Type | Upload Format | Post Format | ID Field |
|-----------|--------------|-------------|----------|
| Text | N/A | JSON | N/A |
| Image | Form Data | Form Data | `image_id` |
| Multiple Images | Form Data | Form Data | `image_ids` (multiple) |
| Video | Form Data | Form Data | `video_id` |

**All media posts require**:
1. Upload file(s) to `/media/upload` with `media_type`
2. Get `media_id` from response
3. Pass `media_id` to LinkedIn post endpoint as form data
