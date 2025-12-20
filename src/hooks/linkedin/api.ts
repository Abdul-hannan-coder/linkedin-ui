// LinkedIn OAuth API Functions

import {
  LinkedInTokenResponse,
  LinkedInCreateTokenResponse,
  LinkedInRefreshTokenResponse,
  LinkedInTokenData,
  LinkedInProfileResponse,
  LinkedInProfile,
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
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(errorData.message || 'An error occurred');
  }

  return response.json();
};

/**
 * Check LinkedIn connection status
 */
export const getLinkedInToken = async (): Promise<LinkedInTokenData | null> => {
  try {
    const response = await apiRequest<LinkedInTokenResponse>('/linkedin/get-token', {
      method: 'GET',
    });
    
    if (response.success && response.data?.linkedin_user_id) {
      return response.data;
    }
    return null;
  } catch (error) {
    // If token doesn't exist, return null (not connected)
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
};

/**
 * Create LinkedIn OAuth token (get authorization URL)
 */
export const createLinkedInToken = async (): Promise<LinkedInCreateTokenResponse> => {
  return apiRequest<LinkedInCreateTokenResponse>('/linkedin/create-token', {
    method: 'POST',
  });
};

/**
 * Refresh LinkedIn access token
 */
export const refreshLinkedInToken = async (): Promise<LinkedInRefreshTokenResponse> => {
  return apiRequest<LinkedInRefreshTokenResponse>('/linkedin/refresh-token', {
    method: 'POST',
  });
};

/**
 * Delete LinkedIn token (disconnect)
 */
export const deleteLinkedInToken = async (): Promise<void> => {
  await apiRequest('/linkedin/delete-token', {
    method: 'DELETE',
  });
};

/**
 * Get LinkedIn user profile
 */
export const getLinkedInProfile = async (): Promise<LinkedInProfile> => {
  const response = await apiRequest<LinkedInProfileResponse>('/linkedin/user-profile/', {
    method: 'GET',
  });
  
  if (!response.success || !response.profile) {
    throw new Error(response.error || 'Failed to fetch LinkedIn profile');
  }
  
  return response.profile;
};

