// Scheduling API Functions

import {
  ScheduledPostsResponse,
  UpdateScheduledPostRequest,
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
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('Scheduling API Error:', {
        endpoint,
        status: response.status,
        errorData,
      });
    }
    
    const errorMessage = errorData.detail || errorData.message || errorData.error || `HTTP ${response.status} error`;
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Create scheduled text post
 */
export const createScheduledTextPost = async (data: {
  text: string;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  scheduled_time: string;
}): Promise<{ success: boolean; message: string }> => {
  return apiRequest<{ success: boolean; message: string }>('/linkedin/text-post/', {
    method: 'POST',
    body: JSON.stringify({
      text: data.text,
      visibility: data.visibility,
      scheduled_time: data.scheduled_time,
    }),
  });
};

/**
 * Create scheduled image post
 */
export const createScheduledImagePost = async (data: {
  image_id: string;
  text: string;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  scheduled_time: string;
}): Promise<{ success: boolean; message: string }> => {
  const formData = new FormData();
  formData.append('image_id', data.image_id);
  formData.append('text', data.text || '');
  formData.append('visibility', data.visibility);
  formData.append('scheduled_time', data.scheduled_time);

  return apiRequest<{ success: boolean; message: string }>('/linkedin/image-post/', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Create scheduled multi-image post
 */
export const createScheduledMultiImagePost = async (data: {
  image_ids: string[];
  text: string;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  scheduled_time: string;
}): Promise<{ success: boolean; message: string }> => {
  const formData = new FormData();
  formData.append('image_ids', data.image_ids.join(','));
  formData.append('text', data.text || '');
  formData.append('visibility', data.visibility);
  formData.append('scheduled_time', data.scheduled_time);

  return apiRequest<{ success: boolean; message: string }>('/linkedin/image-post/multi/', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Create scheduled video post
 */
export const createScheduledVideoPost = async (data: {
  video_id: string;
  text: string;
  title: string;
  visibility: 'PUBLIC' | 'CONNECTIONS';
  scheduled_time: string;
}): Promise<{ success: boolean; message: string }> => {
  const formData = new FormData();
  formData.append('video_id', data.video_id);
  formData.append('text', data.text || '');
  formData.append('title', data.title || 'Video Post');
  formData.append('visibility', data.visibility);
  formData.append('scheduled_time', data.scheduled_time);

  return apiRequest<{ success: boolean; message: string }>('/linkedin/video-post/', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Get all scheduled posts
 */
export const getScheduledPosts = async (params?: {
  platform?: 'linkedin';
  status?: 'scheduled' | 'published' | 'failed';
  limit?: number;
  offset?: number;
}): Promise<ScheduledPostsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.platform) {
    searchParams.append('platform', params.platform);
  }
  if (params?.status) {
    searchParams.append('status', params.status);
  }
  if (params?.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params?.offset !== undefined) {
    searchParams.append('offset', params.offset.toString());
  }
  
  const query = searchParams.toString();
  const endpoint = `/scheduled-posts/my-scheduled-posts${query ? `?${query}` : ''}`;
  
  return apiRequest<ScheduledPostsResponse>(endpoint, {
    method: 'GET',
  });
};

/**
 * Update scheduled post
 */
export const updateScheduledPost = async (
  id: string,
  data: UpdateScheduledPostRequest
): Promise<{ success: boolean; message: string }> => {
  return apiRequest<{ success: boolean; message: string }>(`/scheduled-posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * Cancel/delete scheduled post
 */
export const cancelScheduledPost = async (id: string): Promise<{ success: boolean; message: string }> => {
  return apiRequest<{ success: boolean; message: string }>(`/scheduled-posts/${id}`, {
    method: 'DELETE',
  });
};

