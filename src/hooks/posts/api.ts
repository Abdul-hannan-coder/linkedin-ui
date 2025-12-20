// Post API Functions

import {
  PostData,
  ImagePostData,
  MultiImagePostData,
  VideoPostData,
  PostResponse,
  MediaUploadResponse,
} from './types';

const BASE_URL = 'https://backend.postsiva.com';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please login first.');
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  headers['Authorization'] = `Bearer ${token}`;

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: { message?: string; error?: string; detail?: string };
    try {
      errorData = await response.json();
    } catch {
      const text = await response.text().catch(() => '');
      errorData = {
        message: `HTTP error! status: ${response.status}`,
        error: `Server responded with status ${response.status}`,
        detail: text,
      };
    }
    
    // Log error details for debugging
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        endpoint,
        status: response.status,
        errorData,
      });
    }
    
    // Provide more detailed error message
    const errorMessage = errorData.detail || errorData.message || errorData.error || `HTTP ${response.status} error`;
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Upload media file
 */
export const uploadMedia = async (file: File, mediaType: 'image' | 'video'): Promise<string> => {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('media_type', mediaType);

  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please login first.');
  }

  try {
    const response = await fetch(`${BASE_URL}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData: { message?: string; error?: string; detail?: string };
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `HTTP error! status: ${response.status}`,
          error: `Server responded with status ${response.status}`,
        };
      }
      
      const errorMessage = errorData.message || errorData.error || errorData.detail || `HTTP ${response.status} error`;
      throw new Error(errorMessage);
    }

    const result = await response.json() as MediaUploadResponse;
    
    if (!result.success || !result.media_id) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error('Upload response:', result);
      }
      throw new Error(result.error || result.message || 'Failed to upload media: media_id not found in response');
    }

    // Validate media_id format
    if (typeof result.media_id !== 'string' || result.media_id.trim() === '') {
      throw new Error('Invalid media_id returned from upload');
    }

    return result.media_id;
  } catch (error) {
    // Improve error message for debugging
    if (error instanceof Error) {
      throw error;
    }
    
    // Try to extract error from response
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: string }).message)
      : 'Failed to upload media';
    
    throw new Error(errorMessage);
  }
};

/**
 * Create text post
 */
export const createTextPost = async (data: PostData): Promise<PostResponse> => {
  return apiRequest<PostResponse>('/linkedin/text-post/', {
    method: 'POST',
    body: JSON.stringify({
      text: data.text || '',
    }),
  });
};

/**
 * Create image post (single) - Uses FormData with image_id
 */
export const createImagePost = async (data: ImagePostData): Promise<PostResponse> => {
  // Validate required fields
  if (!data.image_id) {
    throw new Error('Image ID is required for image posts');
  }

  const formData = new FormData();
  formData.append('image_id', data.image_id);
  formData.append('text', data.text || '');
  formData.append('visibility', (data.visibility || 'public').toUpperCase());

  return apiRequest<PostResponse>('/linkedin/image-post/', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Create multi-image post - Uses FormData with multiple image_ids
 */
export const createMultiImagePost = async (data: MultiImagePostData): Promise<PostResponse> => {
  if (!data.image_ids || data.image_ids.length === 0) {
    throw new Error('At least one image ID is required for multi-image posts');
  }

  if (data.image_ids.length < 2) {
    throw new Error(`Multi-image posts require at least 2 images. Provided: ${data.image_ids.length}`);
  }

  const formData = new FormData();
  // ✅ CORRECTED: Join image IDs with commas and send as a single field
  formData.append('image_ids', data.image_ids.join(','));
  formData.append('text', data.text || '');
  formData.append('visibility', (data.visibility || 'public').toUpperCase());

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`Creating multi-image post with ${data.image_ids.length} images:`, data.image_ids.join(','));
  }

  return apiRequest<PostResponse>('/linkedin/image-post/multi/', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Create video post - Uses FormData with video_id
 */
export const createVideoPost = async (data: VideoPostData): Promise<PostResponse> => {
  if (!data.video_id) {
    throw new Error('Video ID is required for video posts');
  }

  const formData = new FormData();
  formData.append('video_id', data.video_id);
  formData.append('text', data.text || '');
  formData.append('title', data.title || 'Video Post');
  formData.append('visibility', (data.visibility || 'public').toUpperCase());

  return apiRequest<PostResponse>('/linkedin/video-post/', {
    method: 'POST',
    body: formData,
  });
};

