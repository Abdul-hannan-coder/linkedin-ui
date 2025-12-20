// Post API Functions

import {
  PostData,
  ImagePostData,
  MultiImagePostData,
  VideoPostData,
  PostResponse,
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
export const uploadMedia = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

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
      let errorData;
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

    const result = await response.json() as Record<string, unknown>;
    
    // Check different possible response structures
    // Try different possible field names for the URL
    const url = (result.url as string | undefined) || 
                ((result.data as Record<string, unknown>)?.url as string | undefined) ||
                (result.file_url as string | undefined) || 
                (result.media_url as string | undefined) || 
                (((result.file as Record<string, unknown>)?.url) as string | undefined);
    
    if (!url) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error('Upload response:', result);
      }
      throw new Error((result.error as string) || (result.message as string) || 'Failed to upload media: URL not found in response');
    }

    // Validate URL format
    if (typeof url !== 'string' || url.trim() === '') {
      throw new Error('Invalid URL returned from upload');
    }

    return url;
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
 * Create image post (single)
 */
export const createImagePost = async (data: ImagePostData): Promise<PostResponse> => {
  // Ensure text is always a string (even if empty)
  const payload = {
    text: data.text || '',
    image_url: data.image_url,
  };

  // Validate required fields
  if (!payload.image_url) {
    throw new Error('Image URL is required for image posts');
  }

  return apiRequest<PostResponse>('/linkedin/image-post/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Create multi-image post
 */
export const createMultiImagePost = async (data: MultiImagePostData): Promise<PostResponse> => {
  return apiRequest<PostResponse>('/linkedin/image-post/multi/', {
    method: 'POST',
    body: JSON.stringify({
      text: data.text,
      image_urls: data.image_urls,
    }),
  });
};

/**
 * Create video post
 */
export const createVideoPost = async (data: VideoPostData): Promise<PostResponse> => {
  return apiRequest<PostResponse>('/linkedin/video-post/', {
    method: 'POST',
    body: JSON.stringify({
      text: data.text,
      title: data.title,
      video_url: data.video_url,
    }),
  });
};

