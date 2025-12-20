# LinkedIn Posting UI - API Integration Plan

## 🎯 UI Analysis

Based on your posting interface at `/dashboard/post`, here's how to integrate the LinkedIn API:

### UI Components Identified:
1. **Post Type Selection**: Text, Image, Multiple Images, Video
2. **Content Editor**: Textarea with character count (3000 max)
3. **Media Upload**: File upload with preview
4. **Visibility Settings**: Public vs Connections
5. **Live Preview**: Real-time post preview
6. **Post Button**: Submit to LinkedIn

---

## 🔗 API Endpoints Mapping

### 1. Text Post
**UI**: When `postType === "text"`
```bash
curl -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your post content here"
  }'
```

### 2. Single Image Post  
**UI**: When `postType === "image"`
```bash
# Step 1: Upload image
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg"

# Step 2: Create image post
curl -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your caption here",
    "image_url": "UPLOADED_IMAGE_URL"
  }'
```

### 3. Multiple Images Post
**UI**: When `postType === "multiple"`
```bash
# Step 1: Upload multiple images
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image1.jpg"

curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image2.jpg"

# Step 2: Create multi-image post
curl -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your caption here",
    "image_urls": ["URL1", "URL2", "URL3"]
  }'
```

### 4. Video Post
**UI**: When `postType === "video"`
```bash
# Step 1: Upload video
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@video.mp4"

# Step 2: Create video post
curl -X POST "https://backend.postsiva.com/linkedin/video-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your caption here",
    "title": "Video title",
    "video_url": "UPLOADED_VIDEO_URL"
  }'
```

---

## 🎯 Implementation Plan

### 1. API Service Layer (`src/services/linkedin.ts`)

```typescript
interface PostData {
  text: string;
  visibility?: 'public' | 'connections';
}

interface ImagePostData extends PostData {
  image_url: string;
}

interface MultiImagePostData extends PostData {
  image_urls: string[];
}

interface VideoPostData extends PostData {
  title: string;
  video_url: string;
}

export const linkedinService = {
  // Text Post
  createTextPost: (data: PostData) =>
    api.post('/linkedin/text-post/', { text: data.text }),
  
  // Single Image Post
  createImagePost: (data: ImagePostData) =>
    api.post('/linkedin/image-post/', {
      text: data.text,
      image_url: data.image_url
    }),
  
  // Multiple Images Post
  createMultiImagePost: (data: MultiImagePostData) =>
    api.post('/linkedin/image-post/multi/', {
      text: data.text,
      image_urls: data.image_urls
    }),
  
  // Video Post
  createVideoPost: (data: VideoPostData) =>
    api.post('/linkedin/video-post/', {
      text: data.text,
      title: data.title,
      video_url: data.video_url
    }),
  
  // Media Upload
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
```

### 2. Custom Hook (`src/hooks/useLinkedInPost.ts`)

```typescript
export const useLinkedInPost = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const uploadFiles = async (files: File[]) => {
    const uploads = await Promise.all(
      files.map(async (file, index) => {
        setUploadProgress(prev => ({ ...prev, [index]: 0 }));
        
        const response = await linkedinService.uploadMedia(file);
        
        setUploadProgress(prev => ({ ...prev, [index]: 100 }));
        return response.data.url;
      })
    );
    
    return uploads;
  };

  const createPost = async (
    postType: PostType,
    content: string,
    files: File[] = [],
    visibility: Visibility = 'public'
  ) => {
    setIsPosting(true);
    
    try {
      let result;
      
      switch (postType) {
        case 'text':
          result = await linkedinService.createTextPost({ text: content, visibility });
          break;
          
        case 'image':
          const imageUrl = await uploadFiles([files[0]]);
          result = await linkedinService.createImagePost({
            text: content,
            image_url: imageUrl[0],
            visibility
          });
          break;
          
        case 'multiple':
          const imageUrls = await uploadFiles(files);
          result = await linkedinService.createMultiImagePost({
            text: content,
            image_urls: imageUrls,
            visibility
          });
          break;
          
        case 'video':
          const videoUrl = await uploadFiles([files[0]]);
          result = await linkedinService.createVideoPost({
            text: content,
            title: content.split('\n')[0] || 'Video Post',
            video_url: videoUrl[0],
            visibility
          });
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

### 3. Updated Post Page Component

```typescript
// In your PostPage component, replace the submit button handler:

const { createPost, isPosting } = useLinkedInPost();

const handleSubmit = async () => {
  if (!content.trim()) return;
  
  try {
    const files = previewUrls.map((url, index) => {
      // Convert blob URLs back to files or use stored file references
      return storedFiles[index]; // You'll need to store actual File objects
    });
    
    const result = await createPost(postType, content, files, visibility);
    
    if (result.success) {
      toast.success('Post created successfully!');
      // Reset form
      setContent('');
      setPreviewUrls([]);
      setStoredFiles([]);
    }
  } catch (error) {
    toast.error('Failed to create post');
  }
};

// Update your submit button:
<Button 
  onClick={handleSubmit}
  disabled={isPosting || !content.trim()}
  className="w-full h-14 rounded-2xl text-base font-black gap-3 shadow-xl shadow-primary/20 px-10"
>
  {isPosting ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      Posting...
    </>
  ) : (
    <>
      <Check className="w-5 h-5" />
      Post to LinkedIn
    </>
  )}
</Button>
```

### 4. File Handling Enhancement

```typescript
// Add to your PostPage component state:
const [storedFiles, setStoredFiles] = useState<File[]>([]);

// Update handleFileChange:
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file));
    
    if (postType === "multiple") {
      setPreviewUrls(prev => [...prev, ...newUrls].slice(0, 20));
      setStoredFiles(prev => [...prev, ...files].slice(0, 20));
    } else {
      setPreviewUrls(newUrls.slice(0, 1));
      setStoredFiles(files.slice(0, 1));
    }
  }
};

// Update removeFile:
const removeFile = (index: number) => {
  setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  setStoredFiles(prev => prev.filter((_, i) => i !== index));
};
```

---

## 🔄 API Response Handling

### Success Response:
```json
{
  "success": true,
  "message": "Post created successfully on LinkedIn",
  "post": {
    "post_id": "urn:li:share:7408075404558770176",
    "text": "Your post content",
    "visibility": "PUBLIC",
    "post_url": "https://www.linkedin.com/feed/update/...",
    "posted_at": "2025-12-20T09:26:52"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": "LinkedIn token expired. Please reconnect your account."
}
```

---

## 🎯 UI Integration Points

### 1. Character Count
- **Current**: Shows `{content.length}/3000 characters`
- **API**: No character limit mentioned, but LinkedIn has ~3000 char limit

### 2. Visibility Setting
- **Current**: `public` | `connections`
- **API**: Not directly supported, but posts default to PUBLIC

### 3. AI Assist Button
- **Current**: Placeholder button
- **Future**: Could integrate with AI content generation

### 4. Storage Integration
- **Current**: "Select from media" button
- **API**: Use `/media/` endpoint to list uploaded files

### 5. Progress Indicators
- **Current**: Basic loading states
- **Enhancement**: Show upload progress for large files

---

## 🚀 Quick Implementation Steps

1. **Create API service** with the curl commands above
2. **Add custom hook** for post creation logic
3. **Update form submission** to call API endpoints
4. **Handle file uploads** before post creation
5. **Add error handling** and success feedback
6. **Implement progress indicators** for better UX

Your UI is already perfectly structured for this API integration! 🎯
