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
    const errorData = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(errorData.message || errorData.error || 'An error occurred');
  }

  return response.json();
};

/**
 * Upload media file
 */
export const uploadMedia = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiRequest<MediaUploadResponse>('/media/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.success || !response.url) {
    throw new Error(response.error || 'Failed to upload media');
  }

  return response.url;
};

/**
 * Create text post
 */
export const createTextPost = async (data: PostData): Promise<PostResponse> => {
  return apiRequest<PostResponse>('/linkedin/text-post/', {
    method: 'POST',
    body: JSON.stringify({
      text: data.text,
    }),
  });
};

/**
 * Create image post (single)
 */
export const createImagePost = async (data: ImagePostData): Promise<PostResponse> => {
  return apiRequest<PostResponse>('/linkedin/image-post/', {
    method: 'POST',
    body: JSON.stringify({
      text: data.text,
      image_url: data.image_url,
    }),
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

