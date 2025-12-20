# Storage Management - Complete Curl Commands & UI Integration

## 🎯 UI Analysis

Based on your storage interface at `/dashboard/storage`, here's the complete API integration:

### UI Components Identified:
1. **Media Grid**: Display images and videos with previews
2. **Filter Dropdown**: All Media, Images, Videos
3. **Upload Button**: Upload new media files
4. **Media Cards**: Show filename, size, date, status
5. **Use in Post**: Navigate to post creation
6. **Pagination**: Handle large media collections

---

## 📋 Storage API Endpoints

### 1. Get All Media Files
```bash
curl -X GET "https://backend.postsiva.com/media/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "media": [
    {
      "media_id": "e50fe458-5624-41d9-9144-19aa7bda3fc7",
      "media_type": "video",
      "platform": null,
      "public_url": "https://storage.postsiva.com/uploads/...",
      "filename": "6946a1978f2eb_1766236567.webp",
      "file_size": 44,
      "status": "uploaded",
      "uploaded_at": "2025-12-20T13:16:07",
      "expires_at": "2025-12-21T01:16:08"
    }
  ],
  "total": 7,
  "limit": 50,
  "offset": 0,
  "count": 7
}
```

### 2. Filter by Media Type
```bash
# Get only images
curl -X GET "https://backend.postsiva.com/media/?media_type=image" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get only videos  
curl -X GET "https://backend.postsiva.com/media/?media_type=video" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Pagination
```bash
# Get first page (3 items)
curl -X GET "https://backend.postsiva.com/media/?limit=3&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get second page (next 3 items)
curl -X GET "https://backend.postsiva.com/media/?limit=3&offset=3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Specific Media by ID
```bash
curl -X GET "https://backend.postsiva.com/media/MEDIA_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Upload New Media
```bash
# Upload image
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@image.jpg" \
  -F "media_type=image"

# Upload video
curl -X POST "https://backend.postsiva.com/media/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "media=@video.mp4" \
  -F "media_type=video"
```

### 6. Delete Media
```bash
# Delete single media
curl -X DELETE "https://backend.postsiva.com/media/MEDIA_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Bulk delete multiple media
curl -X DELETE "https://backend.postsiva.com/media/bulk" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "media_ids": ["ID1", "ID2", "ID3"]
  }'
```

### 7. Cleanup Expired Media
```bash
curl -X POST "https://backend.postsiva.com/media/cleanup" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Implementation Plan for Your UI

### 1. TypeScript Interfaces

```typescript
// src/types/storage.ts

export interface MediaItem {
  media_id: string;
  media_type: 'image' | 'video';
  platform: string | null;
  public_url: string;
  filename: string;
  file_size: number;
  status: 'uploaded' | 'posted';
  uploaded_at: string;
  expires_at: string;
}

export interface MediaResponse {
  success: boolean;
  media: MediaItem[];
  total: number;
  limit: number;
  offset: number;
  count: number;
}

export type MediaFilter = 'all' | 'image' | 'video';
```

### 2. API Service Layer

```typescript
// src/services/storage.ts

export const storageService = {
  // Get media with filters and pagination
  getMedia: (params?: {
    media_type?: 'image' | 'video';
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.media_type) searchParams.append('media_type', params.media_type);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const query = searchParams.toString();
    return api.get<MediaResponse>(`/media/${query ? `?${query}` : ''}`);
  },

  // Get specific media by ID
  getMediaById: (mediaId: string) =>
    api.get<MediaItem>(`/media/${mediaId}`),

  // Upload new media
  uploadMedia: (file: File, mediaType: 'image' | 'video') => {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('media_type', mediaType);
    return api.post('/media/upload', formData);
  },

  // Delete single media
  deleteMedia: (mediaId: string) =>
    api.delete(`/media/${mediaId}`),

  // Bulk delete media
  bulkDeleteMedia: (mediaIds: string[]) =>
    api.delete('/media/bulk', { data: { media_ids: mediaIds } }),

  // Cleanup expired media
  cleanupMedia: () =>
    api.post('/media/cleanup'),
};
```

### 3. Custom Hook for Storage Management

```typescript
// src/hooks/useStorage.ts

export const useStorage = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false
  });

  const loadMedia = async (loadMore = false) => {
    setLoading(true);
    try {
      const params = {
        media_type: filter === 'all' ? undefined : filter,
        limit: pagination.limit,
        offset: loadMore ? pagination.offset + pagination.limit : 0
      };

      const response = await storageService.getMedia(params);
      const newMedia = response.data.media;

      setMedia(prev => loadMore ? [...prev, ...newMedia] : newMedia);
      setPagination({
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
        hasMore: response.data.offset + response.data.count < response.data.total
      });
    } catch (error) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    
    try {
      await storageService.uploadMedia(file, mediaType);
      toast.success('File uploaded successfully');
      loadMedia(); // Refresh the list
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const deleteMedia = async (mediaId: string) => {
    try {
      await storageService.deleteMedia(mediaId);
      setMedia(prev => prev.filter(item => item.media_id !== mediaId));
      toast.success('Media deleted successfully');
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  const bulkDelete = async (mediaIds: string[]) => {
    try {
      await storageService.bulkDeleteMedia(mediaIds);
      setMedia(prev => prev.filter(item => !mediaIds.includes(item.media_id)));
      toast.success(`Deleted ${mediaIds.length} items`);
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  useEffect(() => {
    loadMedia();
  }, [filter]);

  return {
    media,
    loading,
    filter,
    setFilter,
    pagination,
    loadMedia,
    uploadFile,
    deleteMedia,
    bulkDelete,
    loadMore: () => loadMedia(true)
  };
};
```

### 4. Updated Storage Page Component

```typescript
// Update your StoragePage component

export default function StoragePage() {
  const {
    media,
    loading,
    filter,
    setFilter,
    pagination,
    uploadFile,
    deleteMedia,
    loadMore
  } = useStorage();

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => uploadFile(file));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      {/* Header - keep your existing design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Storage</h1>
          <p className="text-sm md:text-base text-slate-500 font-bold">
            Showing {media.length} of {pagination.total} media items
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Dropdown - keep your existing design */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="h-12 px-5 bg-white rounded-xl border-2 border-slate-100 flex items-center gap-3 font-bold text-slate-600 hover:border-primary/30 transition-all shadow-sm"
            >
              <Filter className="w-4 h-4" />
              {filter === "all" ? "All Media" : filter.charAt(0).toUpperCase() + filter.slice(1) + "s"}
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilterDropdown ? "rotate-180" : "")} />
            </button>
            
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                  {(["all", "image", "video"] as MediaFilter[]).map((type) => (
                    <button 
                      key={type}
                      onClick={() => {
                        setFilter(type);
                        setShowFilterDropdown(false);
                      }}
                      className={cn(
                        "w-full px-5 py-3 text-left font-bold text-sm transition-colors",
                        filter === type ? "bg-primary text-white" : "text-slate-600 hover:bg-primary/5"
                      )}
                    >
                      {type === "all" ? "All Media" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-12 px-8 rounded-xl gap-3 font-black shadow-xl shadow-primary/20"
          >
            <Upload className="w-5 h-5" />
            Upload
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {media.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.media_id}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-primary/5 overflow-hidden group flex flex-col h-full"
            >
              {/* Media Preview */}
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                {item.media_type === "video" ? (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-1 relative bg-black flex items-center justify-center">
                       <Image src={item.public_url} alt="" fill className="object-cover opacity-50" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                             <VideoIcon className="w-6 h-6 fill-current" />
                          </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <Image 
                    src={item.public_url} 
                    alt={item.filename} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                )}
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                  {item.media_type === "image" ? <ImageIcon className="w-3 h-3 text-white" /> : <VideoIcon className="w-3 h-3 text-white" />}
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.media_type}</span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <Button 
                    onClick={() => router.push("/dashboard/post")}
                    size="sm" 
                    className="h-8 rounded-lg bg-primary gap-2 text-[10px] font-black shadow-lg"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Use
                  </Button>
                  <Button 
                    onClick={() => deleteMedia(item.media_id)}
                    size="sm" 
                    variant="destructive"
                    className="h-8 rounded-lg gap-2 text-[10px] font-black shadow-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Media Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 truncate mb-1">{item.filename}</h3>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-wider">
                    <span>{formatFileSize(item.file_size)}</span>
                    <span>{formatDate(item.uploaded_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    item.status === "uploaded" ? "bg-green-50 text-green-600 border-green-100" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {item.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {pagination.hasMore && (
        <div className="flex justify-center mt-10">
          <Button 
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 rounded-xl"
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
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

# Get all media
echo "📋 All Media:"
curl -s -X GET "https://backend.postsiva.com/media/" \
  -H "Authorization: Bearer $TOKEN" | jq '{total, count, media: [.media[].filename]}'

# Filter images only
echo "🖼️ Images Only:"
curl -s -X GET "https://backend.postsiva.com/media/?media_type=image" \
  -H "Authorization: Bearer $TOKEN" | jq '{total, count}'

# Filter videos only  
echo "🎥 Videos Only:"
curl -s -X GET "https://backend.postsiva.com/media/?media_type=video" \
  -H "Authorization: Bearer $TOKEN" | jq '{total, count}'

# Pagination
echo "📄 First 3 items:"
curl -s -X GET "https://backend.postsiva.com/media/?limit=3&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '{total, count, limit, offset}'
```

---

## 📊 Summary for Cursor Implementation

| Feature | API Endpoint | UI Component |
|---------|-------------|--------------|
| **Display Media** | `GET /media/` | Media grid with cards |
| **Filter by Type** | `GET /media/?media_type=image` | Filter dropdown |
| **Pagination** | `GET /media/?limit=3&offset=0` | Load more button |
| **Upload Files** | `POST /media/upload` | Upload button + file input |
| **Delete Media** | `DELETE /media/{id}` | Delete button on hover |
| **Bulk Delete** | `DELETE /media/bulk` | Multi-select + bulk actions |

Your storage UI is perfectly structured for this API integration! 🎯
