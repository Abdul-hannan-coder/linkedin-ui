# LinkedIn Scheduling UI Integration Plan

## 🎯 UI Analysis

Based on your scheduling interface at `/dashboard/scheduled`, here's the complete API integration:

### UI Components Identified:
1. **Scheduled Posts List**: Empty state with clock icon
2. **Time Slot Grid**: Days with time slots (9 AM, 12 PM, 3 PM, 6 PM, 9 PM, Custom)
3. **Create Post Modal**: Full post creation with scheduling
4. **Post Type Selection**: Text, Image, Carousel, Video
5. **Content Editor**: Textarea with character count
6. **Visibility Settings**: Public vs Connections
7. **Scheduled Time Picker**: Date/time selection
8. **Live Preview**: Real-time post preview

---

## 🔗 Scheduling API Endpoints

### 1. Create Scheduled Posts
```bash
# Text Post with Scheduling
curl -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your post content",
    "visibility": "PUBLIC",
    "scheduled_time": "2025-12-20T21:00:00+05:00"
  }'

# Image Post with Scheduling
curl -X POST "https://backend.postsiva.com/linkedin/image-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image_id=MEDIA_ID" \
  -F "text=Your caption" \
  -F "visibility=PUBLIC" \
  -F "scheduled_time=2025-12-20T21:00:00+05:00"

# Multi-Image Post with Scheduling
curl -X POST "https://backend.postsiva.com/linkedin/image-post/multi/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image_ids=ID1,ID2,ID3" \
  -F "text=Your caption" \
  -F "visibility=PUBLIC" \
  -F "scheduled_time=2025-12-20T21:00:00+05:00"

# Video Post with Scheduling
curl -X POST "https://backend.postsiva.com/linkedin/video-post/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video_id=MEDIA_ID" \
  -F "text=Your caption" \
  -F "title=Video Title" \
  -F "visibility=PUBLIC" \
  -F "scheduled_time=2025-12-20T21:00:00+05:00"
```

### 2. Manage Scheduled Posts
```bash
# Get All Scheduled Posts
curl -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by Platform
curl -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?platform=linkedin" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by Status
curl -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?status=scheduled" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update Scheduled Post
curl -X PATCH "https://backend.postsiva.com/scheduled-posts/SCHEDULED_POST_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduled_time": "2025-12-21T10:00:00+05:00",
    "post_data": {
      "text": "Updated content",
      "visibility": "PUBLIC"
    }
  }'

# Cancel Scheduled Post
curl -X DELETE "https://backend.postsiva.com/scheduled-posts/SCHEDULED_POST_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Implementation Plan

### 1. TypeScript Interfaces

```typescript
// src/types/scheduling.ts

export interface ScheduledPost {
  scheduled_post_id: string;
  platform: 'linkedin';
  post_type: 'text' | 'image' | 'video' | 'carousel';
  post_data: {
    text: string;
    visibility: 'PUBLIC' | 'CONNECTIONS';
    media_id?: string;
    image_ids?: string;
    video_id?: string;
    title?: string;
  };
  scheduled_time: string;
  scheduled_time_local: string;
  scheduled_time_formatted: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  published_post_id?: string;
  published_post_url?: string;
  error_message?: string;
  time_until_scheduled: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  media?: {
    media_count: number;
    media_urls: Array<{
      media_id: string;
      public_url: string;
      media_type: string;
      filename: string;
      file_size: number;
    }>;
  };
}

export interface ScheduledPostsResponse {
  success: boolean;
  message: string;
  data: {
    scheduled_posts: ScheduledPost[];
    total: number;
    platform?: string;
    status?: string;
  };
}

export interface CreateScheduledPostRequest {
  text: string;
  visibility: 'public' | 'connections';
  scheduled_time: string;
  post_type: 'text' | 'image' | 'carousel' | 'video';
  media_ids?: string[];
  title?: string;
}
```

### 2. API Service Layer

```typescript
// src/services/scheduling.ts

export const schedulingService = {
  // Create scheduled posts
  createScheduledTextPost: (data: {
    text: string;
    visibility: 'PUBLIC' | 'CONNECTIONS';
    scheduled_time: string;
  }) => api.post('/linkedin/text-post/', data),

  createScheduledImagePost: (data: {
    image_id: string;
    text: string;
    visibility: 'PUBLIC' | 'CONNECTIONS';
    scheduled_time: string;
  }) => {
    const formData = new FormData();
    formData.append('image_id', data.image_id);
    formData.append('text', data.text);
    formData.append('visibility', data.visibility);
    formData.append('scheduled_time', data.scheduled_time);
    return api.post('/linkedin/image-post/', formData);
  },

  createScheduledMultiImagePost: (data: {
    image_ids: string[];
    text: string;
    visibility: 'PUBLIC' | 'CONNECTIONS';
    scheduled_time: string;
  }) => {
    const formData = new FormData();
    formData.append('image_ids', data.image_ids.join(','));
    formData.append('text', data.text);
    formData.append('visibility', data.visibility);
    formData.append('scheduled_time', data.scheduled_time);
    return api.post('/linkedin/image-post/multi/', formData);
  },

  createScheduledVideoPost: (data: {
    video_id: string;
    text: string;
    title: string;
    visibility: 'PUBLIC' | 'CONNECTIONS';
    scheduled_time: string;
  }) => {
    const formData = new FormData();
    formData.append('video_id', data.video_id);
    formData.append('text', data.text);
    formData.append('title', data.title);
    formData.append('visibility', data.visibility);
    formData.append('scheduled_time', data.scheduled_time);
    return api.post('/linkedin/video-post/', formData);
  },

  // Manage scheduled posts
  getScheduledPosts: (params?: {
    platform?: 'linkedin';
    status?: 'scheduled' | 'published' | 'failed';
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.platform) searchParams.append('platform', params.platform);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const query = searchParams.toString();
    return api.get<ScheduledPostsResponse>(`/scheduled-posts/my-scheduled-posts${query ? `?${query}` : ''}`);
  },

  updateScheduledPost: (id: string, data: {
    scheduled_time?: string;
    post_data?: Partial<ScheduledPost['post_data']>;
  }) => api.patch(`/scheduled-posts/${id}`, data),

  cancelScheduledPost: (id: string) => api.delete(`/scheduled-posts/${id}`),
};
```

### 3. Custom Hook for Scheduling

```typescript
// src/hooks/useScheduling.ts

export const useScheduling = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadScheduledPosts = async () => {
    setLoading(true);
    try {
      const response = await schedulingService.getScheduledPosts({
        platform: 'linkedin',
        status: 'scheduled'
      });
      setScheduledPosts(response.data.data.scheduled_posts);
    } catch (error) {
      toast.error('Failed to load scheduled posts');
    } finally {
      setLoading(false);
    }
  };

  const createScheduledPost = async (data: CreateScheduledPostRequest) => {
    setCreating(true);
    try {
      const visibility = data.visibility.toUpperCase() as 'PUBLIC' | 'CONNECTIONS';
      let result;

      switch (data.post_type) {
        case 'text':
          result = await schedulingService.createScheduledTextPost({
            text: data.text,
            visibility,
            scheduled_time: data.scheduled_time
          });
          break;

        case 'image':
          if (!data.media_ids?.[0]) throw new Error('Image required');
          result = await schedulingService.createScheduledImagePost({
            image_id: data.media_ids[0],
            text: data.text,
            visibility,
            scheduled_time: data.scheduled_time
          });
          break;

        case 'carousel':
          if (!data.media_ids?.length || data.media_ids.length < 2) {
            throw new Error('At least 2 images required for carousel');
          }
          result = await schedulingService.createScheduledMultiImagePost({
            image_ids: data.media_ids,
            text: data.text,
            visibility,
            scheduled_time: data.scheduled_time
          });
          break;

        case 'video':
          if (!data.media_ids?.[0]) throw new Error('Video required');
          result = await schedulingService.createScheduledVideoPost({
            video_id: data.media_ids[0],
            text: data.text,
            title: data.title || data.text.split('\n')[0] || 'Video Post',
            visibility,
            scheduled_time: data.scheduled_time
          });
          break;
      }

      toast.success('Post scheduled successfully!');
      loadScheduledPosts(); // Refresh the list
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule post');
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const updateScheduledPost = async (id: string, updates: {
    scheduled_time?: string;
    text?: string;
    visibility?: 'public' | 'connections';
  }) => {
    try {
      const updateData: any = {};
      
      if (updates.scheduled_time) {
        updateData.scheduled_time = updates.scheduled_time;
      }
      
      if (updates.text || updates.visibility) {
        updateData.post_data = {};
        if (updates.text) updateData.post_data.text = updates.text;
        if (updates.visibility) {
          updateData.post_data.visibility = updates.visibility.toUpperCase();
        }
      }

      await schedulingService.updateScheduledPost(id, updateData);
      toast.success('Scheduled post updated!');
      loadScheduledPosts();
    } catch (error) {
      toast.error('Failed to update scheduled post');
    }
  };

  const cancelScheduledPost = async (id: string) => {
    try {
      await schedulingService.cancelScheduledPost(id);
      toast.success('Scheduled post cancelled!');
      loadScheduledPosts();
    } catch (error) {
      toast.error('Failed to cancel scheduled post');
    }
  };

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  return {
    scheduledPosts,
    loading,
    creating,
    loadScheduledPosts,
    createScheduledPost,
    updateScheduledPost,
    cancelScheduledPost
  };
};
```

### 4. Updated Scheduled Page Component

```typescript
// Update your ScheduledPage component

export default function ScheduledPage() {
  const {
    scheduledPosts,
    loading,
    creating,
    createScheduledPost,
    cancelScheduledPost
  } = useScheduling();

  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSchedulePost = async () => {
    if (!content.trim() || !scheduledTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Upload media files if needed
      let mediaIds: string[] = [];
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => 
          mediaService.uploadMedia(file, file.type.startsWith('video/') ? 'video' : 'image')
        );
        const uploads = await Promise.all(uploadPromises);
        mediaIds = uploads.map(upload => upload.data.media_id);
      }

      await createScheduledPost({
        text: content,
        visibility: visibility as 'public' | 'connections',
        scheduled_time: scheduledTime,
        post_type: postType,
        media_ids: mediaIds,
        title: postType === 'video' ? content.split('\n')[0] : undefined
      });

      // Reset form
      setContent('');
      setSelectedFiles([]);
      setShowModal(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const formatScheduledTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="p-4 md:p-10 max-w-[1400px] mx-auto min-h-screen pb-20">
      {/* Header - keep your existing design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Scheduled Posts</h1>
          <p className="text-sm md:text-base text-slate-500 font-bold">
            {scheduledPosts.length} scheduled posts
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="h-12 px-8 rounded-xl gap-3 font-black shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New
        </Button>
      </div>

      <div className="space-y-12">
        {/* Scheduled Posts List */}
        <section>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 ml-1">
            Your Scheduled Posts
          </h3>
          
          {loading ? (
            <div className="bg-white rounded-[2rem] p-12 shadow-xl shadow-primary/5 border border-slate-100 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : scheduledPosts.length === 0 ? (
            // Keep your existing empty state
            <div className="bg-white rounded-[2rem] p-12 shadow-xl shadow-primary/5 border border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No scheduled posts found</h3>
              <p className="text-slate-400 font-bold text-sm">Schedule a post to see it here</p>
            </div>
          ) : (
            // Display scheduled posts
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.scheduled_post_id} className="bg-white rounded-2xl p-6 shadow-xl shadow-primary/5 border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase">
                          {post.post_type}
                        </span>
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-black rounded-full uppercase">
                          {post.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium line-clamp-2 mb-2">
                        {post.post_data.text}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>📅 {formatScheduledTime(post.scheduled_time_local)}</span>
                        <span>⏰ {post.time_until_scheduled}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => cancelScheduledPost(post.scheduled_post_id)}
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {post.media && (
                    <div className="flex gap-2 mt-4">
                      {post.media.media_urls.slice(0, 3).map((media, idx) => (
                        <img
                          key={idx}
                          src={media.public_url}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                      {post.media.media_count > 3 && (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                          +{post.media.media_count - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Time Slot Grid - keep your existing design but make functional */}
        <section>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 ml-1">Quick Schedule</h3>
          
          <div className="space-y-12">
            {/* Generate next 7 days */}
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              
              return (
                <div key={i} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h4 className="text-lg font-black text-slate-900">
                      {date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"].map((time) => {
                      const scheduledDateTime = new Date(date);
                      const [timeStr, period] = time.split(' ');
                      const [hours, minutes] = timeStr.split(':').map(Number);
                      scheduledDateTime.setHours(
                        period === 'PM' && hours !== 12 ? hours + 12 : 
                        period === 'AM' && hours === 12 ? 0 : hours,
                        minutes
                      );

                      return (
                        <div key={time} className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              {timeStr}
                            </div>
                            <span className="font-bold text-slate-600 uppercase text-xs tracking-widest">{time}</span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setScheduledTime(scheduledDateTime.toISOString());
                              setShowModal(true);
                            }}
                            className="h-10 px-5 rounded-lg border bg-white border-slate-100 text-primary hover:border-primary hover:bg-primary/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            New
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Modal - keep your existing design but make functional */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            {/* Your existing modal JSX with these key changes: */}
            
            {/* Add datetime picker in scheduled time section */}
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Scheduled Time
              </h3>
              <input
                type="datetime-local"
                value={scheduledTime ? new Date(scheduledTime).toISOString().slice(0, 16) : ''}
                onChange={(e) => setScheduledTime(new Date(e.target.value).toISOString())}
                className="w-full h-12 bg-slate-50/50 rounded-xl border-2 border-slate-100 px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary/30"
                min={new Date().toISOString().slice(0, 16)}
              />
            </section>

            {/* Update footer button */}
            <Button 
              onClick={handleSchedulePost}
              disabled={creating || !content.trim() || !scheduledTime}
              className="h-12 px-8 rounded-xl font-black gap-2 shadow-lg shadow-primary/20"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Schedule Post
                </>
              )}
            </Button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 🚀 Quick Test Script

```bash
#!/bin/bash

# Login
TOKEN=$(curl -s -X POST "https://backend.postsiva.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"123123123"}' \
  | jq -r '.access_token')

# Schedule text post for 1 hour from now
FUTURE_TIME=$(date -d "+1 hour" -Iseconds)
curl -X POST "https://backend.postsiva.com/linkedin/text-post/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"Scheduled post test! 📅\",
    \"visibility\": \"PUBLIC\",
    \"scheduled_time\": \"$FUTURE_TIME\"
  }"

# Get scheduled posts
curl -X GET "https://backend.postsiva.com/scheduled-posts/my-scheduled-posts?platform=linkedin" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Summary for Cursor Implementation

| UI Component | API Integration | Status |
|--------------|----------------|--------|
| **Scheduled Posts List** | `GET /scheduled-posts/my-scheduled-posts` | ✅ Ready |
| **Create Modal** | `POST /linkedin/*-post/` with `scheduled_time` | ✅ Ready |
| **Time Slot Grid** | Pre-fill scheduled_time for quick scheduling | ✅ Ready |
| **Post Management** | `PATCH/DELETE /scheduled-posts/{id}` | ✅ Ready |
| **Real-time Updates** | Refresh list after operations | ✅ Ready |

Your scheduling UI is perfectly structured for this API integration! 🎯
