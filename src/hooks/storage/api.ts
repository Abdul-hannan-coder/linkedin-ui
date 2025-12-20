// Storage API Functions

import {
  MediaResponse,
  MediaItem,
  MediaUploadResponse,
  BulkDeleteResponse,
  CleanupResponse,
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
      console.error('Storage API Error:', {
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
 * Get all media files with optional filters and pagination
 */
export const getMedia = async (params?: {
  media_type?: 'image' | 'video';
  limit?: number;
  offset?: number;
}): Promise<MediaResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.media_type) {
    searchParams.append('media_type', params.media_type);
  }
  if (params?.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params?.offset !== undefined) {
    searchParams.append('offset', params.offset.toString());
  }
  
  const query = searchParams.toString();
  const endpoint = `/media/${query ? `?${query}` : ''}`;
  
  return apiRequest<MediaResponse>(endpoint, {
    method: 'GET',
  });
};

/**
 * Get specific media by ID
 */
export const getMediaById = async (mediaId: string): Promise<MediaItem> => {
  return apiRequest<MediaItem>(`/media/${mediaId}`, {
    method: 'GET',
  });
};

/**
 * Upload media file
 */
export const uploadMedia = async (file: File, mediaType: 'image' | 'video'): Promise<MediaUploadResponse> => {
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

    const result = await response.json() as MediaUploadResponse;
    
    if (!result.success) {
      throw new Error(result.error || result.message || 'Failed to upload media');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: string }).message)
      : 'Failed to upload media';
    
    throw new Error(errorMessage);
  }
};

/**
 * Delete single media
 */
export const deleteMedia = async (mediaId: string): Promise<{ success: boolean; message: string }> => {
  return apiRequest<{ success: boolean; message: string }>(`/media/${mediaId}`, {
    method: 'DELETE',
  });
};

/**
 * Bulk delete media
 */
export const bulkDeleteMedia = async (mediaIds: string[]): Promise<BulkDeleteResponse> => {
  return apiRequest<BulkDeleteResponse>('/media/bulk', {
    method: 'DELETE',
    body: JSON.stringify({ media_ids: mediaIds }),
  });
};

/**
 * Cleanup expired media
 */
export const cleanupMedia = async (): Promise<CleanupResponse> => {
  return apiRequest<CleanupResponse>('/media/cleanup', {
    method: 'POST',
  });
};

